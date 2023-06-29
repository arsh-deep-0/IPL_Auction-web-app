const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
require('dotenv').config();
const routes= require('./routes/routes')


const PORT = process.env.PORT || 3000;

const db= mongoose.connect(process.env.MONGO_URI
)
    .then(() => {
        console.log("connection open!!");
    }) 
    .catch(err => {
        console.log(err);
    })

  


//creating an http server and passing express app to it 

const http = require('http').createServer(app);

const auctionSocket = require('./sockets/auctionSocket');
auctionSocket(http);

http.listen(PORT, console.log(`app is listening to port ${PORT}!`));




app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs');
// view engine setup
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

app.use('/', routes); // Use the router in your app

