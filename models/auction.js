const mongoose =require('mongoose');

const auctionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    teamsCount:{
        type:Number,
        min:0
    },
   leaqueName:{
    type:String
   },
   date:{
    type:Date
   }   ,
   time:{
    type:String
   },
   maxPlayers:{
    type:Number
   },
   intialWallet:{
    type:Number
   },
   maxBidding:{
    type:Number
   },
   currentPlayerOrder:{
    type:Number
   },
   currentBidValue:{
    type:Number
   },
   currentBidderName:{
    type:String
   },
   currentBiderUserID:{
    type:String
   },
   currentBidderLogo:{
    type:String
   },
   currentBuyer:{
    type:Number
   }
   ,
   order:{
    type:Number
   }
})



const Auction= mongoose.model('IplAuction',auctionSchema);

module.exports=Auction;