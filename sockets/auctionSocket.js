const Cricketer = require('../models/cricketer');
const Buyer = require('../models/buyer');
const IplAuction = require('../models/auction');
const User = require('../models/user');
const Multiplayer = require('../models/multiplayer');
const { default: mongoose, mongo } = require('mongoose');

const socketIO = (http) => {
    const io = require('socket.io')(http, {
       // cors: { origin: "https://auction-arsh.onrender.com/" } 
        cors: { origin: "https://auction-arsh.onrender.com/" } 
    });

    require('./userOnlineStatus')(io); //passing socket io events from another file 

    io.on('connection', (mySocket) => {
        console.log(` ${mySocket.id} connected`);

        require('./teamsDataSocket')(mySocket);
        mySocket.on('player-connected-in-auctionRoom', (roomID) => {
           
            console.log('hi');
            mySocket.join(roomID);
            IplAuction.findOne({ order: Number(roomID) })    //finds the current order of player which is running from MongoDB and the current Bid Value 
                .then((element) => {
                    console.log('bye');
                    console.log(element);

                    let currentPlayerOrder = element.currentPlayerOrder;
                    if (currentPlayerOrder == 0) {
                        currentPlayerOrder++;
                    }
                    let currentBidValue = element.currentBidValue;

                    let auctiondetails = { order: currentPlayerOrder, bidValue: currentBidValue ,currentBidderName:element.currentBidderName ,currentBidderLogo:element.currentBidderLogo,currentBiderUserID:element.currentBiderUserID};  
                    console.log("auction details",auctiondetails);

                    mySocket.emit("user connected", auctiondetails);

                    let buyersRoom = 'buyersRoom-' + roomID;
                    let buyerDetails = [];
                    fetchBuyerDetails(roomID)
                        .then(() => {
                            console.log('Buyer details fetched successfully.');
                        })
                        .catch(error => {
                            console.error('An error occurred:', error);
                        });


                })




            //Basic working of Socket io
            mySocket.on('message', (message) => {/*the message emitted by client side socket instance is handled here  */  //remember io is global and mySocket is its local instance ,so when u want to emit on all devices use io
                io.emit('message', `${mySocket.id.substr(0, 2)} said ${message} bro `);  /*the message emitted by client side 
                                                                              socket instance is now emitted to all servers 
                                                                              with little modification */
            });



        }
        );



        mySocket.on('change-Player', (changingDetails) => { //whenever next , prev or search button is clicked or new user is connected 
            let order = changingDetails.playerOrder;

            let cricketersRoom = 'cricketersRoom-' + changingDetails.roomID;

            IplAuction.findOneAndUpdate({ order: Number(changingDetails.roomID) }, { currentPlayerOrder: Number(order) }, { runValidators: true, returnDocument: 'after' })
                .then((result => {
                    mongoose.connection.collection(cricketersRoom).findOne({ order: Number(order) })
                        .then(result => {
                            console.log(result, 'change-player')
                            if (changingDetails.scope == 'global') {
                                io.to(changingDetails.roomID).emit('change-Player', result)
                            }
                            else {
                                mySocket.emit('change-Player', result)
                            }
                        }
                        );
                }))
        })

      

        mySocket.on('increase-Bid', bidDetails => {
            IplAuction.findOneAndUpdate({ order: Number(bidDetails.roomID) }, { currentBidValue: Number(bidDetails.bidValue) }, { runValidators: true, returnDocument: 'after' })
                .then((result => {
                    io.to(bidDetails.roomID).emit('increase-Bid', bidDetails.bidValue);
                    if(bidDetails.bidValue>0){
                    let buyersRoom='buyersRoom-'+bidDetails.roomID;
                    console.log("room",buyersRoom," ",bidDetails.userID);
                    console.log(bidDetails)

                    mongoose.connection.db.collection(buyersRoom).findOne({userID:bidDetails.userID}).
                    then(result=>{
                        console.log(result);
                        if(result){
                        let currentBidder={
                            name:result.name,
                            logo:result.logo,
                            userID:bidDetails.userID,
                            order:result.order
                        }
                        IplAuction.findOneAndUpdate({order:bidDetails.roomID},{currentBidderName:currentBidder.name,currentBidderLogo:currentBidder.logo}).
                        then(result =>{
                            io.to(bidDetails.roomID).emit('currentBidder',currentBidder);
                        })
                       
                    }
                       
                    })
                    }
                }))
               
        })

        mySocket.on('player-Sold', sellingDetails => {
            console.log('sellingDeails',sellingDetails);
            let buyersRoom = 'buyersRoom-' + sellingDetails.roomID; 
            let buyerDetails = [];
            // fetchBuyerDetails(sellingDetails.roomID)
            //     .then(() => {
            //         console.log('Buyer details fetched successfully.');
            //     })
            //     .catch(error => {
            //         console.error('An error occurred:', error);
            //     });


            console.log(sellingDetails, "sold") 
            let filter = sellingDetails.playerOrder;
            let update = sellingDetails.sellingAmount;
            let sellingStatus = sellingDetails.sellingStatus;

            let cricketersRoom = 'cricketersRoom-' + sellingDetails.roomID;  
            console.log(cricketersRoom);
            console.log(filter);
            mongoose.connection.collection(cricketersRoom).findOneAndUpdate({ order: Number(filter) }, { $set: { SellingPrice: Number(update), sellingStatus: Number(sellingStatus) } }, { runValidators: true, returnDocument: 'after' })
                .then(result => {
                    console.log(result, 'playerSold');
                    io.to(sellingDetails.roomID).emit('player-Sold', sellingDetails);
                })
        })

        mySocket.on('add-Player', addingDetails => {

            let cricketersRoom = 'cricketersRoom-' + addingDetails.roomID;
            mongoose.connection.collection(cricketersRoom).findOneAndUpdate({ order: Number(addingDetails.playerOrder) }, { $set: { Team: Number(addingDetails.buyingTeamOrder), sellingStatus: 3 } }, { runValidators: true, returnDocument: 'after' })
                .then(result => {
                    console.log(result);
                    let role = result.value.Role + 'sBought';
                    console.log(role);
                    console.log(addingDetails, 'added')
                    let sellingAmount = (-1 * result.value.SellingPrice / 100).toFixed(1);

                    let number = 0;
                    if (result.value.Nationality != 'India') {
                        number = 1
                    }

                    // Buyer.updateMany({},{$set:{'AllRoundersBought':0}})
                    // .then(result=>{
                    //  console.log(result);
                    // })

                    let buyersRoom = 'buyersRoom-' + addingDetails.roomID;


                    mongoose.connection.collection(buyersRoom).findOneAndUpdate({ order: Number(addingDetails.buyingTeamOrder) },
                        { $inc: { playersBought: 1, overseasBought: Number(number), [role]: 1, currentWallet: Number(sellingAmount) } },
                        { runValidators: true, returnDocument: 'after' })
                        .then(Buyer => {
                            console.log(Buyer);
                            mongoose.connection.collection(cricketersRoom).findOneAndUpdate({ order: Number(addingDetails.playerOrder) }, { $set: { teamlogo: Buyer.value.logo } }).
                                then(player => {
                                    console.log(player);
                                })
                            io.to(addingDetails.roomID).emit('add-Player', Buyer.value)
                        })
                })


        }) 

        mySocket.on('remove-Player', removingDetails => {
            let cricketersRoom = 'cricketersRoom-' + removingDetails.roomID;
            mongoose.connection.collection(cricketersRoom).findOneAndUpdate({ order: Number(removingDetails.playerOrder) }, { $set: { Team: '1000', sellingStatus: 0 } }, { runValidators: true }) // new :true is attentionaly not kept true  
                .then(result => {
                    let role = result.value.Role + 'sBought';
                    console.log(role);
                    console.log(removingDetails, 'removed');
                    let sellingAmount = (1 * result.value.SellingPrice / 100).toFixed(1);


                    let number = 0;
                    if (result.value.Nationality != 'India') {
                        number = -1;
                    }

                    console.log(result.value.Team)

                    let buyersRoom = 'buyersRoom-' + removingDetails.roomID;
                    mongoose.connection.collection(buyersRoom).findOneAndUpdate({ order: Number(result.value.Team) },
                        { $inc: { playersBought: -1, overseasBought: number, [role]: -1, currentWallet: Number(sellingAmount) } },
                        { runValidators: true, returnDocument: 'after' })
                        .then(Buyer => {
                            console.log(Buyer, 'money added  back');
                            mongoose.connection.collection(cricketersRoom).findOneAndUpdate({ order: Number(removingDetails.playerOrder) }, { $set: { teamlogo: '100' , sellingStatus: 0} }).
                                then(player => {
                                    console.log(player);
                                })
                            io.to(removingDetails.roomID).emit('remove-Player', Buyer.value)
                        })
                })

        })


        async function fetchBuyerDetails(roomID) {
            try {
                const multiplayer = await Multiplayer.findOne({ roomID });
                const { playersReached } = multiplayer;
                let buyersRoom = 'buyersRoom-' + roomID;
                let buyerDetails = [];


                for (let i = 1; i < playersReached + 1; i++) {
                    const buyer = await mongoose.connection.collection(buyersRoom).findOne({ order: i });
                    console.log(buyer);
                    buyerDetails.push(buyer);
                }
                console.log('Buyer details are',buyerDetails);
                mySocket.emit('buyer-Details', buyerDetails); 
            } catch (error) {
                console.error('An error occurred:', error);
            }
        }

    }
    )


}



module.exports = socketIO;