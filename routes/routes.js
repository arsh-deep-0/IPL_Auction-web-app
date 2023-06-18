// routes.js

const express = require('express');
const router = express.Router();
const Cricketer = require('../models/cricketer');
const Buyer = require('../models/buyer');
const IplAuction = require('../models/auction');

router.get('/', (req, res) => {
  res.render('home');      
});

router.get('/auction', async (req, res) => {
  const auction = await IplAuction.find({ order: 1 });
  const order = 1;

  res.render('newAuction', { auction });  
});

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
