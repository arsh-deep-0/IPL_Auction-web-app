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
   AllRoundersBought:{
    type:Number
   },
  
   BatsmansBought:{
    type:Number
   },
  
   BowlersBought:{
    type:Number
   },
   WKsBought:{
    type:Number
   },
   overseasBought:{
    type:Number
   }
})



const Buyer= mongoose.model('Buyer',buyerSchema);

module.exports=Buyer;