const socket = io('https://auction-arsh.onrender.com');

//on page reload , going back to database details

socket.on("user connected",(data)=>{
    console.log(data+"hi");
    console.log('connection established');
    let current_player_order=data.order;
    changePlayer(current_player_order);
    document.getElementById("Amount").innerHTML=data.bidValue;

 });

//changing player order and details

const search = document.getElementById("change");
const next = document.getElementById('NEXT');
const prev = document.getElementById('PREV');

const input = document.getElementById("searchOrder");
const current_player_order = document.getElementById("playerNum")

search.addEventListener("click", decideOrder);
next.addEventListener("click", increaseOrder);
prev.addEventListener("click", decreaseOrder);

function decideOrder() {
    let order = input.value;
    changePlayer(order)
}

function increaseOrder() {
    let order = Number(current_player_order.innerHTML);
    order++;
    console.log(order);
    changePlayer(order + "");
}
function decreaseOrder() {
    let order = Number (current_player_order.innerHTML);
    order--;
    console.log(order);
    changePlayer(order + "");
}

function changePlayer(playerOrder) {

    socket.emit('change-Player', playerOrder);
    console.log("emiited",playerOrder);
   
}


socket.on('change-Player', (result) => {
    console.log(result);
    result.forEach(myElement => {
        document.getElementById("name").innerHTML = myElement.name;
        document.getElementById("playerNum").innerHTML = myElement.order;
        document.getElementById("currPlayerImg").src = "/resources/Players/" + myElement.name + ".webp";
        document.getElementById("roleImg").src = "/resources/icons/" + myElement.Role + ".webp";
        document.getElementById("flagImg").src = "/resources/icons/" + myElement.Nationality + ".webp";
        document.getElementById("batAvg").innerHTML = myElement.batPts;
        document.getElementById("bowlPts").innerHTML = myElement.bowlPts;
        document.getElementById("basePrice").innerHTML = myElement.BasePrice;
        document.getElementById("wkPts").innerHTML = myElement.wkPts;
        document.getElementById("nationality").innerHTML = myElement.Nationality;
        document.getElementById("role").innerHTML = myElement.Role;
       

        //set bids section to default
        document.getElementById("hidden").style.display = "none";
        document.getElementById("bids-3").style.display = "block";
        document.getElementById("UP").style.display = "block";
        document.getElementById("Sold").style.display = "block";
        document.getElementById("teamSelector").style.display = "none";


        //checking if player is sold or not 
        if(myElement.sellingStaus>0){
            document.getElementById("hidden").innerHTML=myElement.sellingPrice;
            document.getElementById("hidden").style.display="block";
        }
    });
})



//Increasing Bid

let currentBid = document.getElementById("Amount");
const basePrice=document.getElementById("basePrice");

const bidupButton = document.getElementById("UP");
const soldButton = document.getElementById("Sold");

bidupButton.addEventListener("click", increaseBid);

function increaseBid(){
    let currentBidValue=Number(currentBid.innerHTML);
    console.log(currentBidValue);
    if(currentBidValue==0){
        currentBid.innerHTML=basePrice.innerHTML*100;
    }

    else if(currentBidValue<1000){
        if(currentBidValue%100==20||currentBidValue%100==50){
            currentBid.innerHTML=currentBidValue+30;
        }
        else{
            currentBid.innerHTML=currentBidValue+20;
        }
    }
    else{
        currentBid.innerHTML=currentBidValue+50;
    }
    currentBidValue=currentBid.innerHTML;
    console.log(currentBidValue);
    socket.emit('increase-Bid',currentBidValue)
}


 //Handling increase bid message emitted to all servers

 socket.on('increase-Bid',value=>{
    console.log(value);
    currentBid.innerHTML=value;
 })




 //Selling a player 
