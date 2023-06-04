const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override'); 
require('dotenv').config();

const IplPlayer = require('./models/batsmen');
const Cricketer = require('./models/batsmen');

const IplAuction =require('./models/auction');

const PORT = process.env.PORT || 3000;
  
const conn=mongoose.connect(process.env.MONGO_URI
)
.then(()=>{
    console.log("connection open!!");
    //console.log(`MongoDB Connected: ${conn.connection.host}`);
})
.catch(err=>{
    console.log(err);
})


//creating an http server and passing express app to it 
/* we can also do this instead :- 
const http = app.listen(port, () => {
    console.log("Listening on port: " + port);
});
*/
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
    cors: { origin: "https://auction.cyclic.app" }
});


io.on('connection', (mySocket) => {
    console.log('a user connected');
    io.emit("user connected");
    mySocket.on('disconnect', () => console.log('Client disconnected'));
    mySocket.on('message', (message) =>     {/*the message emitted by client side socket instance is handled here  */
        console.log(message);
        
        io.emit('message', `${mySocket.id.substr(0,2)} said ${message}` );  /*the message emitted by client side 
                                                                              socket instance is now emitted to all servers 
                                                                              with little modification */ 
    });
});



app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs');
// view engine setup

/*app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');*/
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));


const hostname ='localhost';
http.listen(PORT,console.log(`app is listening to port ${PORT}!`));//never use app.listen(port)
/*http.listen(PORT, hostname, function (err) {
    if (err) {
      throw err;
    }
    console.log('server listening on: ', hostname, ':', PORT);
  });*/

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






