const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
require('dotenv').config();

//const IplPlayer = require('./models/player');
const Cricketer = require('./models/cricketer');
const Buyer = require('./models/buyer');
const IplAuction = require('./models/auction');

const PORT = process.env.PORT || 3000;

const conn = mongoose.connect(process.env.MONGO_URI
)
    .then(() => {
        console.log("connection open!!");
        //console.log(`MongoDB Connected: ${conn.connection.host}`);
    })
    .catch(err => {
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
    cors: { origin: "https://auction-arsh.onrender.com" }
});


io.on('connection', (mySocket) => {
    console.log(` ${mySocket.id} connected`);

    IplAuction.find({ order: 1 })    //finds the current order of player which is running from MongoDB and the current Bid Value 
        .then((result) => {
            result.forEach(element => {
                let currentPlayerOrder = element.currentPlayerOrder;
                // if(currentPlayerOrder==0){
                //     currentPlayerOrder++;
                // }
                let currentBidValue = element.currentBidValue;

                let auctiondetails = { order: currentPlayerOrder, bidValue: currentBidValue };

                mySocket.emit("user connected", auctiondetails);

                Buyer.find({ order: { $lte: 8 } }) //Finding the details of all buyers  
                    .then(result => {
                        mySocket.emit('buyer-Details', result);
                    })
            });

        })

    //Basic working of Socket io
    mySocket.on('message', (message) => {/*the message emitted by client side socket instance is handled here  */  //remember io is global and mySocket is its local instance ,so when u want to emit on all devices use io
        io.emit('message', `${mySocket.id.substr(0, 2)} said ${message} bro `);  /*the message emitted by client side 
                                                                              socket instance is now emitted to all servers 
                                                                              with little modification */
    });

    mySocket.on('disconnect', () =>
        console.log(`Client ${mySocket.id} disconnected`)
    );

    mySocket.on('change-Player', (changingDetails) => { //whenever next , prev or search button is clicked or new user is connected
        let order = changingDetails.playerOrder;

        IplAuction.findOneAndUpdate({ order: 1 }, { currentPlayerOrder: order }, { runValidators: true, new: true })
            .then((result => {
                Cricketer.find({ order: order })
                    .then(result => {
                        if (changingDetails.scope == 'global') {
                            io.emit('change-Player', result)
                        }
                        else {
                            mySocket.emit('change-Player', result)
                        }
                    }
                    );
            }))
    })

    mySocket.on('increase-Bid', bidValue => {
        IplAuction.findOneAndUpdate({ order: 1 }, { currentBidValue: bidValue }, { runValidators: true, new: true })
            .then((result => {
                io.emit('increase-Bid', bidValue);
            }))
    })

    mySocket.on('player-Sold', sellingDetails => {
        //firstly we have to add teams in team selector
        Buyer.find({ order: { $lte: 8 } }) //Finding the details of all buyers  
            .then(result => {
                io.emit('buyer-Details', result);
            })

        console.log(sellingDetails, "sold")
        let filter = sellingDetails.playerOrder;
        let update = sellingDetails.sellingAmount;
        let sellingStatus = sellingDetails.sellingStatus;
        Cricketer.findOneAndUpdate({ order: filter }, { SellingPrice: update, sellingStatus: sellingStatus }, { runValidators: true, new: true })
            .then(result => {
                io.emit('player-Sold', sellingDetails);
            })
    })

    mySocket.on('add-Player', addingDetails => {

        Cricketer.findOneAndUpdate({ order: addingDetails.playerOrder }, { Team: addingDetails.buyingTeamOrder, sellingStatus: 3 }, { runValidators: true, new: true })
            .then(result => {
                let role = result.Role + 'sBought';
                console.log(role);
                console.log(addingDetails, 'added')
                let sellingAmount = (-1 * result.SellingPrice / 100).toFixed(1);

                /*Buyer.updateMany({},{$rename:{BatsmanBought:'BatsmansBought',bowlersBought:'BowlersBought',wksBought:'WKsBought'}})
                .then(result=>{
                 console.log(result);
                })*/

                Buyer.findOneAndUpdate({ order: addingDetails.buyingTeamOrder },
                    { $inc: { playersBought: 1, [role]: 1, currentWallet: sellingAmount } },
                    { runValidators: true, new: true })
                    .then(Buyer => {
                        Cricketer.findOneAndUpdate({order:addingDetails.playerOrder},{teamlogo:Buyer.logo}).
                        then(player=>{
                            console.log(player);
                        })
                        io.emit('add-Player', Buyer)
                    })
            })


    })
    mySocket.on('remove-Player', removingDetails => {
        Cricketer.findOneAndUpdate({ order: removingDetails.playerOrder }, { Team: '0', sellingStatus: 0 }, { runValidators: true }) // new :true is attentionaly not kept true
            .then(result => {
                let role = result.Role + 'sBought';
                console.log(role);
                console.log(removingDetails, 'removed');
                let sellingAmount = (1 * result.SellingPrice / 100).toFixed(1);

                Buyer.findOneAndUpdate({ order: result.Team },
                    { $inc: { playersBought: -1, [role]: -1, currentWallet: sellingAmount } },
                    { runValidators: true, new: true })
                    .then(Buyer => {
                        Cricketer.findOneAndUpdate({order:removingDetails.playerOrder},{teamlogo:'Nil'}).
                        then(player=>{
                            console.log(player);
                        })
                        io.emit('remove-Player', Buyer)
                    })
            })

    })
});



app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs');
// view engine setup

/*app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');*/
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));


const hostname = 'localhost';
http.listen(PORT, console.log(`app is listening to port ${PORT}!`));//never use app.listen(port)
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
    const auction = await IplAuction.find({ order: 1 });
    const order = 1;

    res.render('newAuction', { auction })
})

app.post('/myAuction', async (req, res) => {
    const newAuction = new IplAuction(req.body);
    await newAuction.save();
    res.render('myAuction', { newAuction });
})

app.get('/myAuction', (req, res) => {
    res.render('myAuction')
})

app.get('/players', async (req, res) => {
    const players = await Cricketer.find({});
    res.render('players', { players })
})


app.get('/players/:order', async (req, res) => {
    const { order } = req.params;
    const player = await Cricketer.findOne({ order: order });
    // res.send(`Details of ${player.name}`); never do send and render simultaneously
    res.render('player', { player })
})

app.get('/addNewPlayer', async (req, res) => {

    const players = await Cricketer.find({});
    res.render('addNewPlayer', { players })
})




app.post("/players", async (req, res) => {
    console.log(req.body);
    const newPlayer = new Cricketer(req.body);
    console.log(newPlayer);
    await newPlayer.save();
    res.redirect("players");
})


app.get('/players/edit/:order', async (req, res) => {
    const { order } = req.params;
    const editablePlayer = await Cricketer.findOne({ order: order })
    res.render('editPlayer', { editablePlayer })
})

app.put('/players/:order', async (req, res) => {
    const { order } = req.params;
    console.log(order);
    const editedPlayer = await Cricketer.findOneAndUpdate({ order: order }, req.body, { runValidators: true, new: true });
    console.log(req.body);
    const player = editedPlayer;
    res.render('player', { player })
})






