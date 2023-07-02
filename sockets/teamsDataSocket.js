const Cricketer = require('../models/cricketer');
const Buyer = require('../models/buyer');
const IplAuction = require('../models/auction');
const User = require('../models/user');
const Multiplayer = require('../models/multiplayer');

const mongoose = require('mongoose');



const socketIO = (mySocket) => {
    mySocket.on('view-team-players', teamOrder => {
        Cricketer.find({ Team: teamOrder }).
            then(result => {
                mySocket.emit('view-team-players', result);
            })
    })

    mySocket.on('view-team-analytics', order => {
        Buyer.findOne({ order: order }).
            then(result => {
                mySocket.emit('view-team-analytics', result);
            })
    })

    mySocket.on('all-players', (query) => {
        if (query == 1) {

            Cricketer.find({}).
                then(result => {
                    mySocket.emit('all-players', result);
                })
        }
        else {

            Cricketer.find({ sellingStatus: query }).
                then(result => {
                    mySocket.emit('all-players', result);
                })
        }
    })

    mySocket.on('cookie', data => {
        console.log('nnoo');
        console.log(data);
        let user = new User(data);
        user.save()
            .then(Auction1 => {

                console.log(Auction1);
            })
            .catch(e => {
                console.log(e);
            })
    })

    mySocket.on('create-room', (userID) => {

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

        const uniqueRoomID = generateUniqueRoomId();

        let room = new Multiplayer({ roomID: uniqueRoomID });

        console.log('xex')
        console.log(uniqueRoomID);

        room.save()
            .then(Auction1 => {
                console.log('xenx')
                console.log(Auction1);
            })
            .catch(e => {
                console.log(e);
            })

        User.findOne({ userID: userID }).
            then(user => {

                let collectionName = 'buyersRoom-' + user.latestMatchID;
                console.log(collectionName);
 
              if(user.latestMatchID>10)
                mongoose.connection.db.dropCollection(collectionName, (error, result) => {
                    if (error) {
                        console.error('Error deleting collection:', error);
                    } else {
                        console.log('Collection deleted successfully:', result);
                    }
                })

  


                User.findOneAndUpdate({ userID: userID }, { latestMatchID: uniqueRoomID }, { runValidators: true, new: true })
                    .then(result => {

                        mySocket.emit('roomID', result.latestMatchID);
                    })

            })


    })

    mySocket.on('numOfPlayers', data => {

        Multiplayer.findOneAndUpdate({ roomID: data.roomID }, { $set: { playersReached: 0, numberOfPlayers: data.number, hostID: data.userID } }, { runValidators: true, new: true })
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