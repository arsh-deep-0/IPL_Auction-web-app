let playerNumber = document.getElementById("playerNum").innerHTML;
console.log(playerNumber);
let player = [
    {
        "order": "1",
        "name": "MS Dhoni",
        "imgSrc": "/Players/MS dhoni.png",
        "batavg": "78",
        "bowlavg": "Nil",
        "openingbid": "2",
        "wkPts": "22",
        "nationality":"india",
        "role":"wk"
    },
    {
        "order": "2",
        "name": "Jasprit Bumrah",
        "imgSrc": "/Players/jasprit bumrah.webp",
        "batavg": "8",
        "bowlavg": "97",
        "openingbid": "2",
        "wkPts": "Nil",
        "nationality":"india",
        "role":"Bowler"
    },
    {
        "order": "3",
        "name": "ROHIT SHARMA",
        "imgSrc": "/Players/rohit sharma.png",
        "batavg": 88,
        "bowlavg": "18",
        "openingbid": "2",
        "wkPts": "Nil",
        "nationality":"india",
        "role":"Batsman"
    },
    {
        "order": "4",
        "name": "Ben Stokes",
        "imgSrc": "/Players/ben stokes.png",
        "batavg": "70",
        "bowlavg": "62",
        "openingbid": "2",
        "wkPts": "Nil",
        "nationality":"england",
        "role":"All-Rounder"
    },
    {
        "order": "5",
        "name": "Hardik Pandya",
        "imgSrc": "/Players/hardik pandya.png",
        "batavg": "68",
        "bowlavg": "69",
        "openingbid": "2",
        "wkPts": "Nil",
        "nationality":"India",
        "role":"All-Rounder"
    },
    {
        "order": "6",
        "name": "Bhuvneshvar Kumar",
        "imgSrc": "/Players/bkumar.png",
        "batavg": "14",
        "bowlavg": "85",
        "openingbid": "2",
        "wkPts": "Nil",
        "nationality":"India",
        "role":"Bowler"
    },
    {
        "order": "7",
        "name": "Virat Kohli",
        "imgSrc": "/Players/virat_kohli.png",
        "batavg": "95",
        "bowlavg": "8",
        "openingbid": "5",
        "wkPts": "Nil",
        "nationality":"india",
        "role":"batsman"
    },
    {
        "order": "8",
        "name": "Shikhar Dhawan",
        "imgSrc": "/Players/Shikhar Dhawan.png",
        "batavg": "80",
        "bowlavg": "1",
        "openingbid": "2",
        "wkPts": "Nil",
        "nationality":"India",
        "role":"batsman"
    },
    {
        "order": "9",
        "name": "Jos Buttler",
        "imgSrc": "/Players/Buttler.png",
        "batavg": "89",
        "bowlavg": "1",
        "openingbid": "2",
        "wkPts": "16",
        "nationality":"England",
        "role":"wk"
    }

];

const click = document.getElementById("change");





let curr_bid = document.getElementById("Amount").innerHTML;
let substracting_value = 0;

const bidup = document.getElementById("UP");
const sold = document.getElementById("Sold");
bidup.addEventListener("click", increaseBid);
let bids = 0;

function increaseBid() {
    if (bids == 0) {
        curr_bid = document.getElementById("basePrice").innerHTML * 100;
        bids++;
    }
    else {
        if ((curr_bid / 10) % 10 == 2 || (curr_bid / 10) % 10 == 5) {
            curr_bid += 30;
        }
        else {
            curr_bid += 20;
        }
    }

    document.getElementById("Amount").innerHTML = curr_bid;

}

sold.addEventListener("click", sell);

function sell() {
    document.getElementById("hidden").innerHTML = "Sold at : " + "\u20B9" + curr_bid + " lakhs";
  
    document.getElementById("Amount").innerHTML = "0";

    substracting_value = curr_bid / 100;
    curr_bid = 0;
    bids = 0;
    document.getElementById("hidden").style.display = "block";
    document.getElementById("bids-3").style.display = "none";
    document.getElementById("UP").style.display = "none";
    document.getElementById("Sold").style.display = "none";
    document.getElementById("teamSelector").style.display = "block";

}

const confirm = document.getElementById("confirm");
confirm.addEventListener("click", find);
function find() {
    let team = "MIn";
    let teams = document.forms[0];
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].checked) {
            team = teams[i].value + "";
        }
    }
    let purseId = team + "purse";
    let numId = team + "num";


    let curr_purse = document.getElementById(purseId).innerHTML - substracting_value;
    console.log(curr_purse);
    document.getElementById("" + purseId).innerHTML = "" + curr_purse.toFixed(2);
    document.getElementById(numId).innerHTML++;
    console.log(team);
    console.log(purseId);
}

document.addEventListener('click', (e) => {
    // Retrieve id from clicked element
    let elementId = e.target.id;
    // If element has id
    if (elementId !== '') {
        console.log(elementId);


        if (elementId[0] == "l") {

            document.getElementsByClassName("modal")[0].style.display = "flex";
            document.getElementsByClassName("wallet")[0].style.display = "none";
            document.getElementsByClassName("statsHolder")[0].style.display = "none";
            document.getElementsByClassName("bids")[0].style.display = "none";
            document.body.style.backgroundColor = "#eabcbc";

        }

    }
    // If element has no id
    else {
        console.log("An element without an id was clicked.");
    }

}
);


let windowWidth = window.innerWidth;

console.log(window.innerWidth);

window.addEventListener("resize", moveBackground);

let translateBg1;
let translateBg2;
let widthBg;
moveBackground();
function moveBackground() {
    windowWidth = window.innerWidth;
     translateBg1= (windowWidth-1536)/4+1020;
     translateBg2= (windowWidth-1536)/4-700;
     widthBg=250*(windowWidth/1536)+150;
     console.log(translateBg1+" "+translateBg2);
    document.getElementById("bg-1").style.transform ="rotate(-60deg) translate("+translateBg1+"px)";
    document.getElementById("bg-1").style.width=widthBg+"px";
    document.getElementById("bg-2").style.width=widthBg+"px";
    document.getElementById("bg-2").style.transform ="rotate(55deg) translate("+translateBg2+"px) translateY(-200px)";
    console.log("resize" + windowWidth);
}

