const Cricketer = require('../models/cricketer');
const Buyer = require('../models/buyer');
const IplAuction = require('../models/auction');

const socketIO =  (mySocket) => {
     mySocket.on('view-team-players',teamOrder=>{
        Cricketer.find({Team:teamOrder}).
        then(result=>{
            mySocket.emit('view-team-players',result); 
        })
     })

     mySocket.on('view-team-analytics',order=>{
        Buyer.findOne({order:order}).
        then(result=>{
            mySocket.emit('view-team-analytics',result);
        })
     })
    }

module.exports = socketIO;