const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override'); 

const IplPlayer = require('./models/batsmen');
const Cricketer = require('./models/batsmen');

const IplAuction =require('./models/auction');

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

 

app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));


app.listen(3000, () => {
    console.log(`app is listening to port 3000!`);
})


app.get('/', (req, res) => {
    res.render('home');
})

app.get('/auction', async (req, res) => {
    const auction = await IplAuction.find({order:1});
    const order=1;

    res.render('newAuction', { auction })
})

app.post('/myAuction',async (req, res) =>{
    
    const newAuction =  new IplAuction(req.body);
    await newAuction.save();
    res.render('myAuction',{newAuction});
})

app.get('/myAuction',(req,res)=>{
    res.render('myAuction')
})

app.get('/players', async (req, res) => {
    const players = await IplPlayer.find({});
    res.render('players', { players })
})


app.get('/players/:order', async (req, res) => {
    const { order } = req.params;
    const player = await IplPlayer.findOne({ order: order });
    // res.send(`Details of ${player.name}`); never do send and render simultaneously
    res.render('player', { player })
})

app.get('/addNewPlayer', async (req, res) => {

    const players = await IplPlayer.find({});
    res.render('addNewPlayer', { players })
})


app.post("/players", async (req, res) => {
    console.log(req.body);
    const newPlayer =  new IplPlayer(req.body);
    await newPlayer.save();
    res.redirect("players");
})


app.get('/players/edit/:order', async (req, res) => {
    const {order}= req.params;
    const editablePlayer = await IplPlayer.findOne({order:order})
    res.render('editPlayer', { editablePlayer })
})

app.put('/players/:order', async (req, res) => {
    const {order}= req.params;
    console.log(order);
    const editedPlayer = await IplPlayer.findOneAndUpdate({order:order},req.body,{runValidators:true , new: true} );
    console.log(req.body);
    const player=editedPlayer;
    res.render('player', { player })
})





