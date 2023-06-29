const Cricketer = require('../models/cricketer');
const Buyer = require('../models/buyer');
const IplAuction = require('../models/auction');
const User = require('../models/user');
const Multiplayer = require('../models/multiplayer');
const { default: mongoose } = require('mongoose');
const multiplayer = require('../models/multiplayer');

const connectedUsers = {};

const connectedRooms = {};

const socketIO = (http) => {
    const io = require('socket.io')(http, {
        cors: { origin: "https://auction-arsh.onrender.com" }
    });


    io.on('connection', (mySocket) => {
        console.log(` ${mySocket.id} connected`);

        require('./teamsDataSocket')(mySocket);//passing socket io events from another file 
        //require('./userOnlineStatus')(mySocket);//passing socket io events from another file 


        IplAuction.find({ order: 1 })    //finds the current order of player which is running from MongoDB and the current Bid Value 
            .then((result) => {
                console.log(result);
                result.forEach(element => {
                    let currentPlayerOrder = element.currentPlayerOrder;
                    if (currentPlayerOrder == 0) {
                        currentPlayerOrder++;
                    }
                    let currentBidValue = element.currentBidValue;

                    let auctiondetails = { order: currentPlayerOrder, bidValue: currentBidValue };

                    console.log(auctiondetails);
                    mySocket.emit("user connected", auctiondetails);

                    Buyer.find({ order: { $lte: 8 } }) //Finding the details of all buyers  
                        .then(result => {
                            console.log(result);
                            mySocket.emit('buyer-Details', result);
                        })
                });

            })

        //Basic working of Socket io
        mySocket.on('message', (message) => {/*the message emitted by client side socket instance is handled here  */  //remember io is global and mySocket is its local instance ,so when u want to emit on all devices use io
            io.emit('message', `${mySocket.id.substr(0, 2)} said ${message} bro `);  /*the message emitted by client side 
                                                                              socket instance is now emitted to all servers 
                                                                              with little modification */
        });


        mySocket.on('change-Player', (changingDetails) => { //whenever next , prev or search button is clicked or new user is connected
            let order = changingDetails.playerOrder;

            IplAuction.findOneAndUpdate({ order: 1 }, { currentPlayerOrder: order }, { runValidators: true, new: true })
                .then((result => {
                    Cricketer.find({ order: order })
                        .then(result => {
                            if (changingDetails.scope == 'global') {
                                io.emit('change-Player', result)
                            }
                            else {
                                mySocket.emit('change-Player', result)
                            }
                        }
                        );
                }))
        })

        mySocket.on('increase-Bid', bidValue => {
            IplAuction.findOneAndUpdate({ order: 1 }, { currentBidValue: bidValue }, { runValidators: true, new: true })
                .then((result => {
                    io.emit('increase-Bid', bidValue);
                }))
        })

        mySocket.on('player-Sold', sellingDetails => {
            //firstly we have to add teams in team selector
            Buyer.find({ order: { $lte: 8 } }) //Finding the details of all buyers  
                .then(result => {
                    io.emit('buyer-Details', result);
                })

            console.log(sellingDetails, "sold")
            let filter = sellingDetails.playerOrder;
            let update = sellingDetails.sellingAmount;
            let sellingStatus = sellingDetails.sellingStatus;
            Cricketer.findOneAndUpdate({ order: filter }, { SellingPrice: update, sellingStatus: sellingStatus }, { runValidators: true, new: true })
                .then(result => {
                    io.emit('player-Sold', sellingDetails);
                })
        })

        mySocket.on('add-Player', addingDetails => {

            Cricketer.findOneAndUpdate({ order: addingDetails.playerOrder }, { Team: addingDetails.buyingTeamOrder, sellingStatus: 3 }, { runValidators: true, new: true })
                .then(result => {
                    let role = result.Role + 'sBought';
                    console.log(role);
                    console.log(addingDetails, 'added')
                    let sellingAmount = (-1 * result.SellingPrice / 100).toFixed(1);

                    let number = 0;
                    if (result.Nationality != 'India') {
                        number = 1
                    }

                    // Buyer.updateMany({},{$set:{'AllRoundersBought':0}})
                    // .then(result=>{
                    //  console.log(result);
                    // })


                    Buyer.findOneAndUpdate({ order: addingDetails.buyingTeamOrder },
                        { $inc: { playersBought: 1, overseasBought: number, [role]: 1, currentWallet: sellingAmount } },
                        { runValidators: true, new: true })
                        .then(Buyer => {
                            console.log(Buyer);
                            Cricketer.findOneAndUpdate({ order: addingDetails.playerOrder }, { teamlogo: Buyer.logo }).
                                then(player => {
                                    console.log(player);
                                })
                            io.emit('add-Player', Buyer)
                        })
                })


        })
        mySocket.on('remove-Player', removingDetails => {
            Cricketer.findOneAndUpdate({ order: removingDetails.playerOrder }, { Team: '0', sellingStatus: 0 }, { runValidators: true }) // new :true is attentionaly not kept true
                .then(result => {
                    let role = result.Role + 'sBought';
                    console.log(role);
                    console.log(removingDetails, 'removed');
                    let sellingAmount = (1 * result.SellingPrice / 100).toFixed(1);


                    let number = 0;
                    if (result.Nationality != 'India') {
                        number = -1;
                    }
                    Buyer.findOneAndUpdate({ order: result.Team },
                        { $inc: { playersBought: -1, overseasBought: number, [role]: -1, currentWallet: sellingAmount } },
                        { runValidators: true, new: true })
                        .then(Buyer => {
                            Cricketer.findOneAndUpdate({ order: removingDetails.playerOrder }, { teamlogo: '0' }).
                                then(player => {
                                    console.log(player);
                                })
                            io.emit('remove-Player', Buyer)
                        })
                })

        })


        mySocket.on('reached-waiting-room', userDetails => {
            connectedUsers[mySocket.id] = userDetails.userID;
            let room = userDetails.roomID;
            connectedRooms[mySocket.id] = userDetails.roomID;
            mySocket.join(room);

            let buyersRoom = 'buyersRoom-' + userDetails.roomID;
            const db = mongoose.connection;

            db.collection(buyersRoom).findOne({ userID: userDetails.userID }).
                then(user => {

                    if (user) {
                        addPlayersLocally();
                    } else {
                        addPlayers();
                    }
                })



            function addPlayers() {
                Multiplayer.findOneAndUpdate({ roomID: userDetails.roomID }, { $inc: { playersReached: 1 } }, { runValidators: true, new: true }).
                    then(result => {

                        console.log(result);
                        let buyersRoom = 'buyersRoom-' + userDetails.roomID;
                        const db = mongoose.connection;
                        db.collection(buyersRoom).findOneAndUpdate({ order: result.playersReached }, { $set: { name: userDetails.userName, userID: userDetails.userID, onlineStatus: 'online' } }, { runValidators: true, new: true })
                            .then(buyersRoomObject => {

                                console.log(buyersRoomObject);

                                for (let i = 1; i <= result.playersReached; i++) {
                                    db.collection(buyersRoom).findOne({ order: i }).
                                        then(user => {



                                            if (result.hostID == user.userID) {
                                                let userdetails = {
                                                    role: 'Host',
                                                    userName: user.name,
                                                    userID: user.userID,
                                                    roomID: userDetails.roomID,
                                                    userLogo: user.logo,
                                                    onlineStatus: user.onlineStatus
                                                }
                                                console.log(`what`);
                                                console.log(userdetails);
                                                io.emit('new-user-in-waiting-room', userdetails)
                                            } else {
                                                let userdetails = {
                                                    role: 'Player',
                                                    userName: user.name,
                                                    userID: user.userID,
                                                    roomID: userDetails.roomID,
                                                    userLogo: user.logo,
                                                    onlineStatus: user.onlineStatus
                                                }
                                                console.log(`wow`);
                                                console.log(userdetails);
                                                io.emit('new-user-in-waiting-room', userdetails)
                                            }
                                        })
                                }

                            })

                    })
            }
            function addPlayersLocally() {
                Multiplayer.findOneAndUpdate({ roomID: userDetails.roomID }, { }, { runValidators: true, new: true }).
                    then(result => {
                        
                        console.log('hi');
                        console.log(result);
                    
                        let buyersRoom = 'buyersRoom-' + userDetails.roomID;
                        const db = mongoose.connection;
                       
                        db.collection(buyersRoom).findOneAndUpdate({userID:userDetails.userID},{ $set:{onlineStatus: 'online'}}, { runValidators: true, new: true }).
                        then(currentUser=>{
                            for (let i = 1; i <= result.playersReached; i++) {
                                db.collection(buyersRoom).findOne({ order: i }).
                                    then(user => {
                                        if (result.hostID == user.userID) {
                                            let userdetails = {
                                                role: 'Host',
                                                userName: user.name,
                                                userID: user.userID,
                                                roomID: userDetails.roomID,
                                                userLogo: user.logo,
                                                onlineStatus: user.onlineStatus
    
                                            }
                                            console.log(`what locally`);
                                            console.log(userdetails);
                                            io.emit('new-user-in-waiting-room', userdetails)
                                        } else {
                                            let userdetails = {
                                                role: 'Player',
                                                userName: user.name,
                                                userID: user.userID,
                                                roomID: userDetails.roomID,
                                                userLogo: user.logo,
                                                onlineStatus: user.onlineStatus
                                            }
                                            console.log(`wow locally`);
                                            console.log(userdetails);
                                            io.emit('new-user-in-waiting-room', userdetails);
                                        }
                                    })
                            }
                        })
                      
                    })
            }
        });

        mySocket.on('check-room', roomID => {
            console.log(roomID);
            Multiplayer.findOne({ roomID: roomID }).
                then(result => {
                    console.log(result);
                    if (result != null) {
                        mySocket.emit('room-found');
                        console.log('found');
                    } else {
                        mySocket.emit('room-not-found');
                        console.log('not');
                    }
                })
        })


        mySocket.on('disconnect', () => {
            console.log(`Client ${mySocket.id} disconnected`);
            const userID = connectedUsers[mySocket.id];
            console.log(userID); 

          
            // Remove the user from the connectedUsers object
            //delete connectedUsers[mySocket.id];

            let room = connectedRooms[mySocket.id];
            console.log(room);
            if (room) {
                let buyersRoom = 'buyersRoom-' + room;
                const db = mongoose.connection;
                db.collection(buyersRoom).findOneAndUpdate({ userID: userID }, {$set:{ onlineStatus: 'off-line' }}, { runValidators: true, new: true }).
                    then(user => {
                        console.log(user);
                        if(user){
                            
                            if (user.order == 1) {
                                let userdetails = {
                                    role: 'Host',
                                    userName: user.name,
                                    userID: userID,
                                    roomID: room,
                                    userLogo: user.logo,
                                    onlineStatus: 'offline'
    
                                }
                                console.log(`what locally`);
                                console.log(userdetails);
                                mySocket.broadcast.emit('user-left', userdetails)
                            } else {
                                let userdetails = {
                                    role: 'Player',
                                    userName: user.name,
                                    userID: userID,
                                    roomID: room,
                                    userLogo: user.logo,
                                    onlineStatus: 'Offline'
                                }
                                console.log(`wow locally`);
                                console.log(userdetails);
                                mySocket.broadcast.emit('user-left', userdetails);
                            }
                        }
                      
                    })

            }





            // Emit the 'userLeft' event to all clients in room

        }

        );

        mySocket.on('back-online', (userDetails) => {
            connectedUsers[mySocket.id] = userDetails.userID;
            let room = userDetails.roomID;
            connectedRooms[mySocket.id] = userDetails.roomID;
            mySocket.join(room);

            io.emit('back-online', userDetails.userID);

        })





    }
    )
}


module.exports = socketIO;