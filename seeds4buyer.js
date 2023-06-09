const mongoose = require('mongoose');

const IplAuction = require('./models/buyer');

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

    const Team0 = new IplAuction({
        name: 'Mumbai Indians',
        order: 1,
        logo:'milogo',
        intialWallet:80,
        currentWallet:80,
        playersBought:0,
        batsmenBought:0,
        bowlersBought:0,
        wksBought:0,
        overseasBought:0
    })


const Team1 = new IplAuction({
    name: 'Chennai Super Kings',
    order: 2,
    logo:'csklogo',
    intialWallet:80,
    currentWallet:80,
    playersBought:0,
    batsmenBought:0,
    bowlersBought:0,
    wksBought:0,
    overseasBought:0
})
const Team3 = new IplAuction({
    name: 'Rajasthan Royals ',
    order: 3,
    logo:'rrlogo',
    intialWallet:80,
    currentWallet:80,
    playersBought:0,
    batsmenBought:0,
    bowlersBought:0,
    wksBought:0,
    overseasBought:0
})
const Team4 = new IplAuction({
    name: 'Royal challengers Bangalore ',
    order: 4,
    logo:'rcblogo',
    intialWallet:80,
    currentWallet:80,
    playersBought:0,
    batsmenBought:0,
    bowlersBought:0,
    wksBought:0,
    overseasBought:0
})
const Team5 = new IplAuction({
    name: 'Punjab Kings',
    order: 5,
    logo:'pbkslogo',
    intialWallet:80,
    currentWallet:80,
    playersBought:0,
    batsmenBought:0,
    bowlersBought:0,
    wksBought:0,
    overseasBought:0
})
const Team6 = new IplAuction({
    name: 'Kolkata Knight Riders',
    order: 6,
    logo:'kkrlogo',
    intialWallet:80,
    currentWallet:80,
    playersBought:0,
    batsmenBought:0,
    bowlersBought:0,
    wksBought:0,
    overseasBought:0
})
const Team7 = new IplAuction({
    name: 'Sunrisers Hyderabaad',
    order: 7,
    logo:'srhlogo',
    intialWallet:80,
    currentWallet:80,
    playersBought:0,
    batsmenBought:0,
    bowlersBought:0,
    wksBought:0,
    overseasBought:0
})
const Team8 = new IplAuction({
    name: 'Delhi Capitals',
    order: 8,
    logo:'dclogo',
    intialWallet:80,
    currentWallet:80,
    playersBought:0,
    batsmenBought:0,
    bowlersBought:0,
    wksBought:0,
    overseasBought:0
})
const Team9 = new IplAuction({
    name: 'Gujrat Titans',
    order: 9,
    logo:'gtlogo',
    intialWallet:80,
    currentWallet:80,
    playersBought:0,
    batsmenBought:0,
    bowlersBought:0,
    wksBought:0,
    overseasBought:0
})
const Team10 = new IplAuction({
    name: 'Lukhnow Super Giants',
    order: 10,
    logo:'lsglogo',
    intialWallet:80,
    currentWallet:80,
    playersBought:0,
    batsmenBought:0,
    bowlersBought:0,
    wksBought:0,
    overseasBought:0
})

Team0.save()
Team1.save()


    Team3.save()
    Team4.save()
    Team5.save()
    Team6.save()
    Team7.save()
    Team8.save()
    Team9.save()
    Team10.save()
