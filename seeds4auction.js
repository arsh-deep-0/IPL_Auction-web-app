const mongoose = require('mongoose');

const IplAuction = require('./models/auction');

mongoose.connect("mongodb+srv://Arshdeep:A1r2s3d4e5@cluster0.441ajgx.mongodb.net/Auctions?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("connection open!!");
    })
    .catch(err => {
        console.log(err);
    })



const Auction1 = new IplAuction({
    name: 'Auction1',
    teamsCount: 8,
    order: 1,
    currentPlayerOrder: 0,
    currentBidValue: 0

})

Auction1.save()
    .then(Auction1 => {
        console.log(Auction1);
    })
    .catch(e => {
        console.log(e);
    })


