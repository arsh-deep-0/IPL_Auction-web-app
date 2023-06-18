{
    let orignalQuery = document.getElementById('query-1');
    orignalQuery.style.background = "linear-gradient(143.7deg,#462523 -60%, #cb9b51 2%,#f6e27a 45%,#f6f2c0 50%,#f6e27a 55%,#cb9b51 98%,#462523 160%)";
    socket.emit('all-players',1);
}



for (let i = 0; i < 4; i++) {

    let query = document.getElementById('query-' + i);

    query.addEventListener('click', () => {

        for (let j = 0; j < 4; j++) {
            let otherQuery = document.getElementById('query-' + j);
            otherQuery.style.background = "white";
        }

        query.style.background = "linear-gradient(143.7deg,#462523 -60%, #cb9b51 2%,#f6e27a 45%,#f6f2c0 50%,#f6e27a 55%,#cb9b51 98%,#462523 160%)";
        socket.emit('all-players',i);
    })
}


socket.on('all-players',players=>{
    console.log(players);

    let batsmanDiv = document.getElementById('query-modal-batsman-div');
    batsmanDiv.innerHTML = '';
    let bowlerDiv = document.getElementById('query-modal-bowler-div');
    bowlerDiv.innerHTML = '';
    let allrounderDiv = document.getElementById('query-modal-allrounder-div');
    allrounderDiv.innerHTML = '';
    let WKsDiv = document.getElementById('query-modal-WKs-div');
    WKsDiv.innerHTML = '';

   let batsmenNumber= document.getElementById('query-batsmen-Number');
   let bowlerNumber= document.getElementById('query-bowlers-Number');
   let allrounderNumber = document.getElementById("query-All-Rounders-Number");
   let wknumber= document.getElementById("query-Wks-Number");


    let batsmanCount=0;
    let bowlerCount=0;
    let wkCount=0;
    let allrounderCount=0;

    bowlerNumber.innerHTML=bowlerCount;
    batsmenNumber.innerHTML=batsmanCount;
    wknumber.innerHTML=wkCount;
    allrounderNumber.innerHTML=allrounderCount;   

    players.forEach(player => {

        let playerDiv = document.createElement('div');
        playerDiv.classList.add('modal-player-div');
        playerDiv.id = 'modal-player-div-' + player.order;

    
        let playerData = document.createElement('div');
        playerData.classList.add('modal-player-data');
        playerDiv.appendChild(playerData);

        let playerName = document.createElement('p');
        playerName.classList.add('modal-player-name');
        playerName.id = 'modal-player-name' + player.order;
        playerName.innerHTML = player.name;
        playerDiv.appendChild(playerName);

        let playerStats = document.createElement('p');
        playerStats.classList.add('modal-player-name');
        playerStats.id = 'modal-player-stats' + player.order;
        playerStats.style.marginTop="12.5rem";
        playerStats.style.fontSize="1.3rem";
        
        playerDiv.appendChild(playerStats);

        let playerImg = document.createElement('img');
        playerImg.classList.add('modal-player');
        playerImg.id = 'modal-player-' + player.order;  //giving it a class name
        playerImg.src = "/resources/Players/" + player.name + ".webp";
        playerData.appendChild(playerImg);

        let template = document.createElement('img');
        template.classList.add('modal-player-template');
        template.src = "/resources/icons/player-template.webp";
        playerDiv.appendChild(template);


        if (player.Role == 'Bowler') {
            bowlerDiv.appendChild(playerDiv);
            playerStats.innerHTML = player.bowlPts;
            bowlerCount++;
            bowlerNumber.innerHTML=bowlerCount;

        } else if (player.Role == 'Batsman') {
            batsmanDiv.appendChild(playerDiv);
            playerStats.innerHTML = player.batPts;
            batsmanCount++;
           batsmenNumber.innerHTML=batsmanCount;


        } else if (player.Role == "AllRounder") {
            allrounderCount++;
            allrounderDiv.appendChild(playerDiv);
            playerStats.innerHTML = player.batPts+"/"+player.bowlPts;
            allrounderNumber.innerHTML=allrounderCount;

        } else {
            wkCount++;
            WKsDiv.appendChild(playerDiv);
            playerStats.innerHTML = player.batPts+"/"+player.wkPts;
            wknumber.innerHTML=wkCount;
        }

    });

})