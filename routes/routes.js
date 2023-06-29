// routes.js

const express = require('express');
const router = express.Router();
const Cricketer = require('../models/cricketer');
const Buyer = require('../models/buyer');
const IplAuction = require('../models/auction');

router.get('/', (req, res) => {
  res.render('home');      
});

router.get('/selectAuction', async (req, res) => {
  console.log(req.body);
  const auction = await IplAuction.find({ order: 1 });
  const order = 1;

  res.render('selectAuctionType', { auction });  
});

router.get('/multiplayerRules',(req,res)=>{
  res.render('MultiplayerRules');
})

router.get('/setAuctionRules',(req,res)=>{
  res.render('setAuctionRules');
})

router.get('/waitingRoom', (req,res)=>{
  res.render('waitingRoom');
 
})

router.get('/selectCharacters',(req,res)=>{
  res.render('selectCharacters');
})

router.get('/enterroomNumber',(req,res)=>{
  res.render('enterroomNumber');
})

router.post('/myAuction', async (req, res) => {  
  const newAuction = new IplAuction(req.body);
  await newAuction.save();
  res.render('myAuction', { newAuction });
});

router.get('/myAuction', (req, res) => {
  res.render('myAuction');
});

router.get('/players', async (req, res) => {
  const players = await Cricketer.find({});
  res.render('players', { players });
});

router.get('/players/:order', async (req, res) => {
  const { order } = req.params;
  const player = await Cricketer.findOne({ order: order });
  res.render('player', { player });
});

router.get('/addNewPlayer', async (req, res) => {
  const players = await Cricketer.find({});
  res.render('addNewPlayer', { players });
});

router.post("/players", async (req, res) => {
  const newPlayer = new Cricketer(req.body);
  await newPlayer.save();
  res.redirect("players");
});

router.get('/players/edit/:order', async (req, res) => {
  const { order } = req.params;
  const editablePlayer = await Cricketer.findOne({ order: order });
  res.render('editPlayer', { editablePlayer });
});

router.put('/players/:order', async (req, res) => {
  const { order } = req.params;
  const editedPlayer = await Cricketer.findOneAndUpdate({ order: order }, req.body, { runValidators: true, new: true });
  const player = editedPlayer;
  res.render('player', { player });
});

module.exports = router;
