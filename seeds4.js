const mongoose = require('mongoose');

const Cricketer = require('./models/cricketers');

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


const RohitS = new Cricketer({

    name: 'Virat Kohli',
    batPts: '95',
    bowlPts: '14',
    wkPts: '0',
    order: '1',
    sellingStatus: '0',
    Nationality: 'India',
    BasePrice: '5',
    SellingPrice: '0',
    Team: 'Nil',
    Role: 'Batsman'


})

RohitS.save()
    .then(Rohit => {
        console.log(Rohit);
    })
    .catch(e => {
        console.log(e);
    })


