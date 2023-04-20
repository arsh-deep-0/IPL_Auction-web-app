const mongoose=require('mongoose');

const IplPlayer = require('./models/batsmen');

mongoose.connect("mongodb+srv://Arshdeep:A1r2s3d4e5@cluster0.441ajgx.mongodb.net/Cricketers?retryWrites=true&w=majority",
{
   useNewUrlParser: true,
   useUnifiedTopology:true
})
.then(()=>{
    console.log("connection open!!");
})
.catch(err=>{
    console.log(err);
})

const abd= new IplPlayer({
    name:'AB devillers',
    batPts:100,
    bowlPts:0,
    wkPts:22 ,
 
})

const Rohit= new IplPlayer({
    name:'Rohit',
    batPts:90,
    bowlPts:18,
    wkPts:0 ,
    basePrice:5,
    order:3,
    imgSrc:"/resources/playerPhotos/RohitSnobg.png"
 
})

 Rohit.save()
 . then(Rohit=>{
    console.log(Rohit);
})
.catch(e=>{
    console.log(e); 
})


