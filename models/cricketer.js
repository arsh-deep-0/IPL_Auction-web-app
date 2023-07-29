const mongoose =require('mongoose');

const playerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    batPts:{
        type:Number,
        min:0
    },
    bowlPts:{
        type:Number,
        min:0
    },
    wkPts:{
        type:Number,
        min:0
    },
    BasePrice:{
        type:Number,
        min:0
    },
    currentBidder:{
        type:String
    },
    SellingPrice:{
        type:Number
    },
    Nationality:{
        type:String
    },
    order:{
        type:Number,
        min:0
    },
    imgSrc:{
        type:String
    },
    Role:{
        type:String
    },
    Team:{
        type:Number
    },
    teamlogo:{
        type:String
    },
    sellingStatus:{
        type:Number
    },
    imgSrc:{
        type:String
    } 
})



const Cricketer= mongoose.model('cricketers',playerSchema);
console.log("done bro")
module.exports=Cricketer;