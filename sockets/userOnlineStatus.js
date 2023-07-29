const Cricketer = require('../models/cricketer');
const Buyer = require('../models/buyer');
const IplAuction = require('../models/auction');
const User = require('../models/user');
const Multiplayer = require('../models/multiplayer');

const mongoose = require('mongoose');


const connectedUsers = {};

const connectedRooms = {};



const socketIO = (io) => {
    io.on('connection', (mySocket) => {

        mySocket.on('avatar-changed', avatarDetails => {
            console.log(avatarDetails);
            let BuyersRoom = 'buyersRoom-' + avatarDetails.roomID;
            mongoose.connection.collection(BuyersRoom).findOneAndUpdate({ userID: avatarDetails.userID }, { $set: { logo: avatarDetails.newUserLogo } }, { runValidators: true, returnDocument: 'after' }).
                then((user) => {
                    console.log(user);

                    console.log(user.value.logo);
                    let changes = {
                        newLogo: user.value.logo,
                        oldLogo: avatarDetails.userLogo,
                        userID: avatarDetails.userID,
                        roomID: avatarDetails.roomID
                    }
                    io.emit('avatar-changed', changes);
                })
        })

        mySocket.on('reached-waiting-room', userDetails => {

            let buyersRoom = 'buyersRoom-' + userDetails.roomID;
            const db = mongoose.connection;

            db.collection(buyersRoom).findOne({ userID: userDetails.userID },).
                then(user => {

                    if (user) {
                        addPlayersLocally();
                    } else {
                        addPlayers();
                    }
                })



            function addPlayers() {
                Multiplayer.findOne({ roomID: userDetails.roomID }).
                    then(multiplayer => {
                        if (multiplayer.playersReached < multiplayer.numberOfPlayers) {
                            connectedUsers[mySocket.id] = userDetails.userID;
                            let room = userDetails.roomID;
                            connectedRooms[mySocket.id] = userDetails.roomID;
                            mySocket.join(room);

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
                                                                onlineStatus: user.onlineStatus,
                                                                playersReached: result.playersReached,
                                                                totalPlayers: result.numberOfPlayers
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
                                                                onlineStatus: user.onlineStatus,
                                                                playersReached: result.playersReached,
                                                                totalPlayers: result.numberOfPlayers
                                                            }
                                                            console.log(`wow`);
                                                            console.log(userdetails);
                                                            io.emit('new-user-in-waiting-room', userdetails)
                                                        }
                                                    })
                                            }

                                        })

                                })
                        } else {
                            mySocket.emit('room-full', userDetails.roomID);
                        }
                    })

            }
            function addPlayersLocally() {
                connectedUsers[mySocket.id] = userDetails.userID;
                let room = userDetails.roomID;
                connectedRooms[mySocket.id] = userDetails.roomID;
                mySocket.join(room);
                Multiplayer.findOneAndUpdate({ roomID: userDetails.roomID }, {}, { runValidators: true, new: true }).
                    then(result => {

                        console.log('hi');
                        console.log(result);

                        let buyersRoom = 'buyersRoom-' + userDetails.roomID;
                        const db = mongoose.connection;

                        db.collection(buyersRoom).findOneAndUpdate({ userID: userDetails.userID }, { $set: { onlineStatus: 'online' } }, { runValidators: true, new: true }).
                            then(currentUser => {
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
                                                    onlineStatus: user.onlineStatus,
                                                    playersReached: result.playersReached,
                                                    totalPlayers: result.numberOfPlayers

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
                                                    onlineStatus: user.onlineStatus,
                                                    playersReached: result.playersReached,
                                                    totalPlayers: result.numberOfPlayers
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
                        let playersData = {
                            totalPlayers: result.numberOfPlayers,
                            playersReached: result.playersReached
                        }
                        mySocket.emit('room-found', playersData);
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
                db.collection(buyersRoom).findOneAndUpdate({ userID: userID }, { $set: { onlineStatus: 'off-line' } }, { runValidators: true, new: true }).
                    then(user => {
                        console.log(user);
                        if (user) {

                            if (user.order == 1) {
                                let userdetails = {
                                    role: 'Host',
                                    userName: user.value.name,
                                    userID: user.value.userID,
                                    roomID: room,
                                    userLogo: user.value.logo,
                                    onlineStatus: user.value.onlineStatus

                                }
                                console.log(`what locally`);
                                console.log(userdetails);
                                mySocket.broadcast.emit('user-left', userdetails)
                            } else {
                                let userdetails = {
                                    role: 'Player',
                                    userName: user.value.name,
                                    userID: user.value.userID,
                                    roomID: room,
                                    userLogo: user.value.logo,
                                    onlineStatus: user.value.onlineStatus
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

        mySocket.on('start-auction', roomID => {
            console.log(roomID);
            Multiplayer.findOneAndUpdate({ roomID: roomID }, { matchStatus: 'Ongoing' }, { runValidators: true, new: true }).
                then(result => {
                    console.log(result); 
                    let auctionData = {
                        name: 'Auction-' + roomID,
                        currentPlayerOrder: 0,
                        currentBidValue:0,
                        order:roomID,
                        currentBuyer:0
                    }
                    let newAuction = new IplAuction(auctionData);
                    newAuction.save() 
                    .then(auction => {

                        console.log(auction);
                    })
                    .catch(e => {
                        console.log(e);
                    })

                    let duplicateCollectionName = 'cricketersRoom-' + roomID;
                    const db = mongoose.connection;
                    duplicateCollection(db, duplicateCollectionName);
            
                    Cricketer.find({order: {$lte:12*result.playersReached} })
                        .then((documents) => { 
                            const duplicateDocuments = documents.map((document) => ({ ...document.toObject() }));
                            db.collection(duplicateCollectionName).insertMany(duplicateDocuments)
                                .then(() => {
                                    console.log('Documents copied to the duplicate collection successfully.');
                                    io.emit('auction-room-ready',roomID);
            
            
                                })
                                .catch((error) => {
                                    console.error('Error copying documents to the duplicate collection', error);
                                });
                        })
                        .catch((error) => {
                            console.error('Error retrieving documents from the source collection', error);
                        });

                    
                })
        });

    })
}

function duplicateCollection(db, duplicateCollectionName) {
    db.createCollection(duplicateCollectionName)
        .then(() => {
            console.log(`Duplicate collection '${duplicateCollectionName}' created successfully.`);
        })
        .catch((error) => {
            console.error('Error creating duplicate collection', error);
        }); 

}


module.exports = socketIO; 