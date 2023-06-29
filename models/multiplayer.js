const mongoose =require('mongoose');

const multiplayerSchema = new mongoose.Schema({
    roomID:{
        type:String
    },
    numberOfPlayers:{
        type:Number
    },
    hostID:{
        type:String
    },
    allPlayers:{
        type:Array
    },
    playersReached:{
        type:Number
    }
})

const multiplayer= mongoose.model('multiplayerRooms',multiplayerSchema);
module.exports=multiplayer;