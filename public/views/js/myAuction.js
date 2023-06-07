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
    }
    // If element has no id
    else {
        console.log("An element without an id was clicked.");
    }

}
);


let windowWidth = window.innerWidth;



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
     
    document.getElementById("bg-1").style.transform ="rotate(-60deg) translate("+translateBg1+"px)";
    document.getElementById("bg-1").style.width=widthBg+"px";
    document.getElementById("bg-2").style.width=widthBg+"px";
    document.getElementById("bg-2").style.transform ="rotate(55deg) translate("+translateBg2+"px) translateY(-200px)";
    
}

