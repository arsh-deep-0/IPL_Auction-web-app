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
    basePrice:{
        type:Number,
        min:0
    },
    order:{
        type:Number,
        min:0
    },
    imgSrc:{
        type:String
    }
})



const Cricketer= mongoose.model('IplPlayer',playerSchema);

module.exports=Cricketer;