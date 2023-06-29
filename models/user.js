const mongoose =require('mongoose');

const userSchema = new mongoose.Schema({
    userName:{
        type:String
    },
    userID:{
        type:String
    },
    latestMatchID:{
        type:String
    }
})


const user= mongoose.model('users',userSchema);

module.exports=user;