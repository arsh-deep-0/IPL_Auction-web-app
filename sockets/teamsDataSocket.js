const Cricketer = require('../models/cricketer');
const Buyer = require('../models/buyer');
const IplAuction = require('../models/auction');
const User = require('../models/user');
const Multiplayer = require('../models/multiplayer');

const mongoose = require('mongoose');



const socketIO = (mySocket) => {
    mySocket.on('view-team-players', viewData => {
        
        console.log(viewData.teamOrder);

        fetchPlayerDetails(viewData.roomID, viewData);
    }) 

    mySocket.on('view-team-analytics', viewData => {
        let buyersRoom = 'buyersRoom-' + viewData.roomID;
        mongoose.connection.collection(buyersRoom).findOne({ order: viewData.teamOrder }).
            then(result => {
                mySocket.emit('view-team-analytics', result);
            })
    })

    mySocket.on('all-players', (query) => {
        console.log(query);
        let cricketersRoom = 'cricketersRoom-' + query.roomID;
        const collection = mongoose.connection.db.collection(cricketersRoom);  
       
       
        if (query.query == 1) {
            find(collection,{})
        }
        else {
            find(collection,{sellingStatus:query.query});
        }

        async function find(collection,query){
            try{
            const cursor = collection.find(query);
            const cricketers = await cursor.toArray();
    
            const cricketersDetails = cricketers.filter(cricketer => cricketer !== null);
            console.log(cricketersDetails);
            mySocket.emit('all-players', cricketersDetails);
        }catch (error) {
            console.error('An error occurred:', error);
        }
    }
       
    })

    mySocket.on('findUser', userID => {
        User.findOne({ userID: userID }).
            then(result => {
                mySocket.emit('findUser', result);
            })
    })

    mySocket.on('cookie', data => {
        console.log('nnoo');
        console.log(data);
        let user = new User(data);
        user.save()
            .then(user => {

                console.log(user);
            })
            .catch(e => {
                console.log(e);
            })
    })

    mySocket.on('create-room', (userID) => {
        let earlierMatchID;

        User.findOne({ userID: userID }).
            then(user => {
                console.log('this is user i got from uer id' + userID);
                console.log(user);
                if (user) {



                    let collectionName = 'buyersRoom-' + user.latestMatchID;
                    earlierMatchID = user.latestMatchID;
                    console.log(collectionName);



                    if (user.latestMatchID > 10) {
                        console.log('delete');
                        mongoose.connection.db.dropCollection(collectionName, (error, result) => {
                            console.log(result);
                            if (error) {
                                console.error('Error deleting collection:', error);
                            } else {
                                console.log('Collection deleted successfully:', result);
                            }
                        })
                        const uniqueRoomID = generateUniqueRoomId();

                        let room = new Multiplayer({ roomID: uniqueRoomID });

                        console.log('xex')
                        console.log(uniqueRoomID);

                        room.save()
                            .then(room => {
                                console.log('room created')
                                console.log(room);
                                User.findOneAndUpdate({ userID: userID }, { latestMatchID: uniqueRoomID }, { runValidators: true, new: true })
                                    .then(result => {

                                        mySocket.emit('roomID', result.latestMatchID);
                                    })


                            })
                            .catch(e => {
                                console.log(e);
                            })
                    }
                    else {
                        const uniqueRoomID = generateUniqueRoomId();

                        let room = new Multiplayer({ roomID: uniqueRoomID });

                        console.log('xex')
                        console.log(uniqueRoomID);

                        room.save()
                            .then(room => {
                                console.log('room create first time')
                                console.log(room);
                                User.findOneAndUpdate({ userID: userID }, { latestMatchID: uniqueRoomID }, { runValidators: true, new: true })
                                    .then(result => {

                                        mySocket.emit('roomID', result.latestMatchID);
                                    })


                            })
                            .catch(e => {
                                console.log(e);
                            })
                    }


                    Multiplayer.findOne({ roomID: earlierMatchID }).
                        then(result => {
                            console.log('auction room found:', result);
                            if (result) {
                                if (result.matchStatus == "Ongoing") {
                                    let collectionName = 'cricketersRoom-' + user.latestMatchID;

                                    mongoose.connection.db.dropCollection(collectionName, (error, result) => {
                                        if (error) {
                                            console.error('Error deleting collection:', error);
                                        } else {
                                            console.log('Collection deleted successfully:', result);
                                        }
                                    })
                                }
                            }

                        })




                }

            })

        function generateUniqueRoomId() {
            const min = 100000;
            const max = 999999;

            const roomId = Math.floor(Math.random() * (max - min + 1)) + min;

            // Check if the generated roomId already exists in the collection
            const existingRoom = Multiplayer.findOne({ roomID: roomId })
                .then(result => {
                    console.log(result);
                    if (result) {
                        console.log('ye');
                        return generateUniqueRoomId();
                    } else {
                        console.log('yen');
                        return roomId;
                    }
                })

            return roomId;
        }






    })

    mySocket.on('numOfPlayers', data => {

        Multiplayer.findOneAndUpdate({ roomID: data.roomID }, { $set: { playersReached: 0, numberOfPlayers: data.number, hostID: data.userID, matchStatus: 'not-Started' } }, { runValidators: true, new: true })
            .then(result => {
                console.log(result);
            })

        let duplicateCollectionName = 'buyersRoom-' + data.roomID;
        const db = mongoose.connection;
        duplicateCollection(db, duplicateCollectionName);

        Buyer.find({ order: { $lte: data.number } })
            .then((documents) => {
                const duplicateDocuments = documents.map((document) => ({ ...document.toObject() }));
                db.collection(duplicateCollectionName).insertMany(duplicateDocuments)
                    .then(() => {
                        console.log('Documents copied to the duplicate collection successfully.');


                    })
                    .catch((error) => {
                        console.error('Error copying documents to the duplicate collection', error);
                    });
            })
            .catch((error) => {
                console.error('Error retrieving documents from the source collection', error);
            });

    })


    async function fetchPlayerDetails(roomID, viewData) {
        try {

            let cricketersRoom = 'cricketersRoom-' + roomID;


            const collection = mongoose.connection.db.collection(cricketersRoom);
            const query = {
                Team: Number(viewData.teamOrder)
            };
            const cursor = collection.find(query);
            const cricketers = await cursor.toArray();

            const cricketersDetails = cricketers.filter(cricketer => cricketer !== null);
            console.log(cricketersDetails);
            mySocket.emit('view-team-players', cricketersDetails);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }


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