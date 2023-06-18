const Cricketer = require('../models/cricketer');
const Buyer = require('../models/buyer');
const IplAuction = require('../models/auction');

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
        else{
            
            Cricketer.find({ sellingStatus:query}).
                then(result => {
                    mySocket.emit('all-players', result);
                })
        }
    })
}

module.exports = socketIO;