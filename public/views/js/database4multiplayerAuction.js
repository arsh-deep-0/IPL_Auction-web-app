const socket = io('https://auction-arsh.onrender.com');

const params = new URLSearchParams(window.location.search);
socket.emit('player-connected-in-auctionRoom', params.get('roomID'));

//on page reload , going back to database details

socket.on("user connected", (AuctionData) => {
    console.log(AuctionData);
    console.log('connection established');
    changePlayer(AuctionData.order, 'local');
    console.log(AuctionData);
    document.getElementById("Amount").innerHTML = AuctionData.bidValue;
    if (AuctionData.currentBidderName != undefined) {
        document.getElementById("currentBiderName").innerHTML = AuctionData.currentBidderName;
    }
    else {
        document.getElementById("currentBiderName").innerHTML = "none";
    }
    document.getElementById("currentBiderImg").src = "/resources/logos/" + AuctionData.currentBidderLogo + ".webp";
});



//changing player order and details

const search = document.getElementById("change");
const next = document.getElementById('NEXT');
const prev = document.getElementById('PREV');

const input = document.getElementById("searchOrder");
const currentPlayerOrder = document.getElementById("playerNum")

//search.addEventListener("click", decideOrder);
next.addEventListener("click", increaseOrder);
prev.addEventListener("click", decreaseOrder);

function decideOrder() {
    let order = input.value;
    changePlayer(order, 'global');

    let bidDetails = {
        bidValue: 0,
        roomID: params.get('roomID'),
        userID: getCookie('userID'),
    }
    socket.emit('increase-Bid', bidDetails);
}

function increaseOrder() {
    let order = Number(currentPlayerOrder.innerHTML);
    order++;
    console.log(order);
    changePlayer(order + "", 'global');
    let bidDetails = {
        bidValue: 0,
        roomID: params.get('roomID'),
        userID: getCookie('userID')
    }
   // socket.emit('increase-Bid', bidDetails);
}
function decreaseOrder() {
    let order = Number(currentPlayerOrder.innerHTML);
    order--;
    console.log(order);
    changePlayer(order + "", 'global');
    let bidDetails = {
        bidValue: 0,
        roomID: params.get('roomID')
    }
   // socket.emit('increase-Bid', bidDetails);
}

function changePlayer(playerOrder, scope) {
    // if(playerOrder==0){
    //     playerOrder++;
    // }

    let changingDetails = { playerOrder: playerOrder, scope: scope, roomID: params.get('roomID') }
    socket.emit('change-Player', changingDetails);
    console.log("emiited", changingDetails);

}


socket.on('change-Player', (myElement) => {
    console.log(myElement);
    if (myElement == null) {
        alert('Player-' + input.value + ' doesn\'t exist')
    } else {
        document.getElementById("name").innerHTML = myElement.name;
        currentPlayerOrder.innerHTML = myElement.order;
        document.getElementById("currPlayerImg").src = "/resources/Players/" + myElement.name + ".webp";
        document.getElementById("roleImg").src = "/resources/icons/" + myElement.Role + ".webp";
        document.getElementById("flagImg").src = "/resources/icons/" + myElement.Nationality + ".webp";
        document.getElementById("batAvg").innerHTML = myElement.batPts;
        document.getElementById("bowlPts").innerHTML = myElement.bowlPts;
        document.getElementById("basePrice").innerHTML = myElement.BasePrice;
        document.getElementById("wkPts").innerHTML = myElement.wkPts;
        document.getElementById("nationality").innerHTML = myElement.Nationality;
        document.getElementById("role").innerHTML = myElement.Role;

        document.getElementById('UP').disabled=false;

        //putting team logo in sold section \
        

        if (myElement.teamlogo == '0' || myElement.teamlogo == undefined) {
            document.getElementById('buyerTeam').style.display = 'none';

        } else {
            document.getElementById('buyerTeam').src = "/resources/logos/" + myElement.teamlogo + ".webp";
            document.getElementById('buyerTeam').style.display = 'block';
        }

        //set bids section to default
        document.getElementById("hidden").style.display = "none";
        document.getElementById("bids-3").style.display = "block";
        document.getElementById("UP").style.display = "block";
       // document.getElementById("Sold").style.display = "block";
        document.getElementById("teamSelector").style.display = "none"; 

        document.getElementById('currentBider').style.display = 'none';     


        //checking if player is sold or not 

        if (myElement.sellingStatus >= 1) {
            document.getElementById("currentBider").style.display = "none";
            let sellingDetails = { sellingStatus: myElement.sellingStatus, sellingAmount: myElement.SellingPrice, roomID: params.get('roomID') };
            soldPlayerHandler(sellingDetails);
           
        }else{
            let bidDetails = {
                bidValue: 0,
                roomID: params.get('roomID')
            }
            socket.emit('increase-Bid', bidDetails);
        }
           
        
    }
})



//Increasing Bid

let currentBid = document.getElementById("Amount");
const basePrice = document.getElementById("basePrice");

const bidupButton = document.getElementById("UP");


bidupButton.addEventListener("click", increaseBid);

function increaseBid() {
    let currentBidValue = Number(currentBid.innerHTML);
    console.log(currentBidValue);
    if (currentBidValue == 0) {
        currentBid.innerHTML = basePrice.innerHTML * 100;
    }

    else if (currentBidValue < 1000) {
        if (currentBidValue % 100 == 20 || currentBidValue % 100 == 50) {
            currentBid.innerHTML = currentBidValue + 30;
        }
        else {
            currentBid.innerHTML = currentBidValue + 20;
        }
    }
    else {
        currentBid.innerHTML = currentBidValue + 50;
    }
    currentBidValue = currentBid.innerHTML;
    console.log(currentBidValue);
    let bidDetails = {
        bidValue: currentBidValue,
        roomID: params.get('roomID'),
        userID: getCookie('userID')
    }
    console.log(getCookie('userID'));
    socket.emit('increase-Bid', bidDetails)
}


//Handling increase bid message emitted to  servers

socket.on('increase-Bid', value => {
    console.log(value);
    if(value>0)
    document.getElementById("currentBider").style.display="flex";    
    document.getElementById("bids-3").style.display = "block";
    document.getElementById("UP").style.display = "block";
   // document.getElementById("Sold").style.display = "block";
    document.getElementById("teamSelector").style.display = "none";
    document.getElementById('hidden').style.display = "none";
    currentBid.innerHTML = value;
})




//Selling a player 
const soldButton = document.getElementById("Sold");
//soldButton.addEventListener('click',sellPlayer);

const sellPlayer=() => {
    let sellingStatus = 1;
    if (currentBid.innerHTML == 0) { 
        sellingStatus = 2;
    }
    let sellingDetails = {
        sellingAmount: currentBid.innerHTML,
        playerOrder: currentPlayerOrder.innerHTML,
        sellingStatus: sellingStatus,
        roomID: params.get('roomID')
    }
    socket.emit('player-Sold', sellingDetails);
}

const sellingPrice = document.getElementById('hidden');


//handler of player-sold , which updates to UI
socket.on('player-Sold', sellingDetails => {
    console.log('yeah', sellingDetails);
     if(sellingDetails.roomID ==params.get('roomID'))
      soldPlayerHandler(sellingDetails);  

})

function soldPlayerHandler(sellingDetails) {
    console.log("got", sellingDetails);
    if (sellingDetails.sellingStatus == 0) {
        sellingPrice.style.display = "none"; 
        document.getElementById("bids-3").style.display = "block";
        document.getElementById("UP").style.display = "block";
       // document.getElementById("Sold").style.display = "block";
       // document.getElementById("teamSelector").style.display = "none";
    }
    else {
        sellingPrice.style.display = "block";
        document.getElementById("bids-3").style.display = "none";
        document.getElementById("UP").style.display = "none";
       // document.getElementById("Sold").style.display = "none";
    }
    if (sellingDetails.sellingStatus == 2) {
        sellingPrice.innerHTML = "Unsold";

    }
    else if (sellingDetails.sellingStatus == 1) {
        sellingPrice.innerHTML = "Sold at : " + "\u20B9" + sellingDetails.sellingAmount + " lakhs";
        //document.getElementById("teamSelector").style.display = "block";

    }
    else if (sellingDetails.sellingStatus == 3) {
        sellingPrice.innerHTML = "Sold at : " + "\u20B9" + sellingDetails.sellingAmount + " lakhs";
       // document.getElementById("teamSelector").style.display = "none";

    }
}


//reseting a sold player 

const reset = document.getElementById('reset');
/*reset.addEventListener('click', () => {

    if (document.getElementById('buyerTeam').style.display == "block") {//it means player sold and added in a team 
        let removingDetails = {
            playerOrder: currentPlayerOrder.innerHTML,
            sellingPrice: Number(currentBid.innerHTML),
            sellingStatus: 3,
            roomID: params.get('roomID')
        }
        socket.emit('remove-Player', removingDetails)
        console.log('sent');
    }

    let resetingDetails = { // this one helps to set player object in db back to default
        sellingAmount: 0,
        playerOrder: currentPlayerOrder.innerHTML,
        sellingStatus: 0
    }
    socket.emit('player-Sold', resetingDetails);
    let bidDetails = {
        bidValue: 0,
        roomID: params.get('roomID'),
        userID: getCookie('userID')
    }
    socket.emit('increase-Bid', bidDetails);
})*/





//updating buyer's details

socket.on('buyer-Details', details => {
    let parentDiv = document.getElementById('wallet');
    parentDiv.innerHTML = ''; //ensuring that there is not prior teams already in parent div
    let buyingTeams = document.getElementById('buying-teams');
    buyingTeams.innerHTML = '';
    console.log('buyer is here', details); 




    details.forEach(Buyer => {
        if (Buyer == null) {

        } else {
            makeNewBuyer(parentDiv, Buyer);
            addTeamInSelector(buyingTeams, Buyer);
        }

    })
})

function makeNewBuyer(parentDiv, Buyer) {
    const team = document.createElement('div');
    team.classList.add('team');
    team.id = ('team-' + Buyer.order);
    parentDiv.appendChild(team);

    const logoImgClass = document.createElement("div"); //making a new html element of type div
    const logoImg = document.createElement("img");
    logoImg.classList.add('logo');  //giving it a class name
    logoImg.src = "/resources/logos/" + Buyer.logo + ".webp"

    team.appendChild(logoImg); //appending it into main parent div


    const teamData = document.createElement('div');
    teamData.classList.add('team-data');
    const BuyerName = document.createElement("p");
    const BuyerPurse = document.createElement("p");
    const numOfPlayers = document.createElement("p");
    const numOfPlayersValue = document.createElement('span');

    BuyerName.classList.add('text');
    BuyerPurse.classList.add('text');
    numOfPlayers.classList.add('text');

    numOfPlayersValue.classList.add('numOfPlayers');
    numOfPlayersValue.id = 'numOfPlayers-' + Buyer.order;

    BuyerName.innerText = Buyer.name;
    BuyerPurse.innerHTML = 'Remainng Purse : &#8377 <span class="purse" id="purse-' + Buyer.order + '">' + Buyer.currentWallet.toFixed(2) + '</span> crores';
    numOfPlayersValue.innerHTML = Buyer.playersBought;
    numOfPlayers.innerHTML = "Players Bought: ";
    teamData.appendChild(BuyerName);
    teamData.appendChild(BuyerPurse);

    teamData.appendChild(numOfPlayers);
    numOfPlayers.appendChild(numOfPlayersValue);

    team.appendChild(teamData);

}

function addTeamInSelector(buyingTeams, Buyer) {

    const label = document.createElement("label");
    label.id = "label-" + Buyer.order;

    const input = document.createElement('input');
    input.type = "radio";
    input.name = 'buyer';
    input.value = Buyer.order;
    label.appendChild(input);

    const logoImg = document.createElement('img');
    logoImg.classList.add('logo');  //giving it a class name
    logoImg.src = "/resources/logos/" + Buyer.logo + ".webp";

    label.appendChild(logoImg);
    buyingTeams.appendChild(label);

}

//adding player to team
const confirm = document.getElementById("confirm");
confirm.addEventListener("click", find);

function find(order) {
  
    console.log(order);
    let addingDetails = {
        playerOrder: currentPlayerOrder.innerHTML,
        buyingTeamOrder: order,
        sellingPrice: currentBid.innerHTML,
        roomID: params.get('roomID')
    }
    socket.emit('add-Player', addingDetails)

}

//updating buyer stats

socket.on('add-Player', Buyer => {
    document.getElementById('teamSelector').style.display = "none";
    document.getElementById('purse-' + Buyer.order).innerHTML = Buyer.currentWallet.toFixed(2);
    document.getElementById('numOfPlayers-' + Buyer.order).innerHTML = Buyer.playersBought;
    document.getElementById('buyerTeam').src = "/resources/logos/" + Buyer.logo + ".webp";
    document.getElementById('buyerTeam').style.display = "block";
})

socket.on('remove-Player', Buyer => {
    document.getElementById('teamSelector').style.display = "none";
    document.getElementById('purse-' + Buyer.order).innerHTML = Buyer.currentWallet.toFixed(2);
    document.getElementById('numOfPlayers-' + Buyer.order).innerHTML = Buyer.playersBought;
    document.getElementById('buyerTeam').src = "";
    document.getElementById('buyerTeam').style.display = "none";
})

socket.on('currentBidder', currentBidder => {
    document.getElementById('currentBiderName').innerHTML = currentBidder.name;
    document.getElementById('currentBiderImg').src = "/resources/logos/" + currentBidder.logo + ".webp";
    document.getElementById('UP').disabled=false;
    document.getElementById('UP').backgroundColor='grey'; 
    startCountdown(currentBidder.userID,currentBidder.order);
   

    if(currentBidder.userID == getCookie('userID')){
        document.getElementById('UP').disabled=true;
       
    }
})




//Making web app full screen by clicking anywhere in body

const element = document.documentElement;;

element.addEventListener("click", fullscreen);

function fullscreen() {
    // Enter fullscreen mode
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function getCookie(name) {
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }

    return "";
}


let countdownInterval;

function startCountdown(userID,Bidderorder) {
    console.log("Countdown started!");

    // Set the countdown duration in seconds
    const countdownDuration = 16;

    // Get the current timestamp
    const startTime = new Date().getTime();

    // Calculate the target timestamp when the countdown should end
    const targetTime = startTime + countdownDuration * 1000;

    // Clear any existing interval
    clearInterval(countdownInterval);

    // Update the countdown every second
    countdownInterval = setInterval(() => {
        // Get the current timestamp
        const currentTime = new Date().getTime();

        // Calculate the remaining time in seconds
        const remainingTime = Math.max(0, Math.round((targetTime - currentTime) / 1000));

        if (remainingTime === 0) {
            // Countdown completed
            console.log("Hi!"); 
          
            if(userID===getCookie("userID")){
                console.log(userID," ",getCookie('userID'));
            sellPlayer();
             find(Bidderorder);
             document.getElementById("currentBider").style.display="none"; 
            }
           

            // Clear the interval to stop the countdown
            clearInterval(countdownInterval);
        }

        // Update the countdown display
        document.getElementById("countdown").textContent = remainingTime;
    }, 1000);
}


