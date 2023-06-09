const mongoose =require('mongoose');

const buyerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    order:{
        type:Number,
        required:true
    },
    logo:{
        type:String
    },
    intialWallet:{
        type:Number,
        min:0
    },
    currentWallet:{
        type:Number
    },
   playersBought:{
    type:Number
   },
   batsmenBought:{
    type:Number
   },
   bowlersBought:{
    type:Number
   },
   wksBought:{
    type:Number
   },
   overseasBought:{
    type:Number
   }
})



const Buyer= mongoose.model('Buyer',buyerSchema);

module.exports=Buyer;