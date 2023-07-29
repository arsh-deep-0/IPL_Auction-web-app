


socket.on('buyer-Details', result => {

    const modalTeams = document.getElementById('modal-teams');
    modalTeams.innerHTML = '<p>Teams</p>';
    result.forEach(Buyer => {

        if(Buyer==null){}
        else{
            let logoDiv = document.createElement('div');
            logoDiv.classList.add('modal-logo-div');
            logoDiv.id = 'modal-logo-div-' + Buyer.order;
            modalTeams.appendChild(logoDiv);
    
            let logoImg = document.createElement('img');
            logoImg.classList.add('modal-logo');
            logoImg.id = 'modal-logo-' + Buyer.order;  //giving it a class name
            logoImg.src = "/resources/logos/" + Buyer.logo + ".webp";
            logoDiv.appendChild(logoImg)
        }      

    })
    let modalLogo1 = document.getElementById('modal-logo-div-' + (1));
    modalLogo1.style.background = "linear-gradient(143.7deg,#462523 -60%, #cb9b51 2%,#f6e27a 45%,#f6f2c0 50%,#f6e27a 55%,#cb9b51 98%,#462523 160%)";

    let viewData ={
        teamOrder:1,
        roomID:params.get('roomID')
    }
    socket.emit('view-team-players', viewData);
    socket.emit('view-team-analytics', viewData);

    const modalLogos = document.getElementsByClassName('modal-logo');
    //document.getElementById('modal-logo-div-0').back

    for (let i = 0; i < modalLogos.length; i++) { 
        const modalLogo = document.getElementById('modal-logo-div-' + (i + 1));

        modalLogo.addEventListener("click", function () {
            // Reset background color of all children to white
            for (let j = 0; j < modalLogos.length; j++) {
                let otherLogo = document.getElementById('modal-logo-div-' + (j + 1));
                otherLogo.style.background = "white";
            }

            // Set background color of the clicked child to blue

            this.style.background = "linear-gradient(143.7deg,#462523 -60%, #cb9b51 2%,#f6e27a 45%,#f6f2c0 50%,#f6e27a 55%,#cb9b51 98%,#462523 160%)";
            console.log(i)

            let viewData ={
                teamOrder:i+1,
                roomID:params.get('roomID')
            }
            socket.emit('view-team-players', viewData);
            socket.emit('view-team-analytics', viewData);

        });
    }
})


socket.on('view-team-players', players => {
    console.log(players);

    let batsmanDiv = document.getElementById('modal-batsman-div');
    batsmanDiv.innerHTML = '';
    let bowlerDiv = document.getElementById('modal-bowler-div');
    bowlerDiv.innerHTML = '';
    let allrounderDiv = document.getElementById('modal-allrounder-div');
    allrounderDiv.innerHTML = '';
    let WKsDiv = document.getElementById('modal-WKs-div');
    WKsDiv.innerHTML = '';

    let avgBatPts=document.getElementById('avg-bat-pts');
    avgBatPts.innerHTML=0;
    let batsmanCount=0;
    let avgBowlPts=document.getElementById('avg-bowl-pts');
    avgBowlPts.innerHTML=0
    let bowlerCount=0;
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
            avgBowlPts.innerHTML=(Number(avgBowlPts.innerText)+(player.bowlPts-Number(avgBowlPts.innerText))/bowlerCount).toFixed(1);

        } else if (player.Role == 'Batsman') {
            batsmanDiv.appendChild(playerDiv);
            playerStats.innerHTML = player.batPts;
            batsmanCount++;
            avgBatPts.innerHTML=(Number(avgBatPts.innerText)+(player.batPts-Number(avgBatPts.innerText))/batsmanCount).toFixed(1);


        } else if (player.Role == "AllRounder") {
            allrounderDiv.appendChild(playerDiv);
            batsmanCount++;
            bowlerCount++;
            playerStats.innerHTML = player.batPts+"/"+player.bowlPts;
            avgBowlPts.innerHTML=(Number(avgBowlPts.innerText)+(player.bowlPts-Number(avgBowlPts.innerText))/bowlerCount).toFixed(1);
            avgBatPts.innerHTML=(Number(avgBatPts.innerText)+(player.batPts-Number(avgBatPts.innerText))/batsmanCount).toFixed(1);

        } else {
            batsmanCount++;
            WKsDiv.appendChild(playerDiv);
            playerStats.innerHTML = player.batPts+"/"+player.wkPts;
            avgBatPts.innerHTML=(Number(avgBatPts.innerText)+(player.batPts-Number(avgBatPts.innerText))/batsmanCount).toFixed(1);
        }

    });

})


socket.on('view-team-analytics', team => {

    //changing selected team logo
    let teamlogo = document.getElementById('mlogo')
    teamlogo.src = "/resources/logos/" + team.logo + '.webp';
    console.log(teamlogo.src);

    let wallet = document.getElementById('wallet-left');
   


    const counterElement = document.querySelector('.counter');
    const targetNumber = team.currentWallet.toFixed(2); // Replace with your desired target number

    const decimalPlaces = 2; // Number of decimal places to display
    const duration = 2000; // Duration of the animation in milliseconds
    const intervalTime = 80; // Interval time for each frame

    const frameCount = Math.ceil(duration / intervalTime);
    const incrementValue = (targetNumber / frameCount).toFixed(decimalPlaces);

    let currentValue = 0;
    let frame = 0;

    const countAnimation = setInterval(() => {
        currentValue += parseFloat(incrementValue);

        if (frame < frameCount) {
            wallet.textContent = currentValue.toFixed(decimalPlaces);
            frame++;
        } else {
            clearInterval(countAnimation);
        }
    }, intervalTime);

   document.getElementById('batsmen-Number').innerHTML=team.BatsmansBought;
   document.getElementById('bowlers-Number').innerHTML=team.BowlersBought;
   document.getElementById('All-Rounders-Number').innerHTML=team.AllRoundersBought;
   document.getElementById('Wks-Number').innerHTML=team.WKsBought;
   document.getElementById('modal-team-name').innerHTML=team.name;
   document.getElementById('total-players').innerHTML=team.playersBought;
   document.getElementById('overseas').innerHTML=team.overseasBought;


    let walletLeft = (team.currentWallet * 180 / 80) - 135;
    let odometer = document.getElementById('odometer');
    odometer.animate([
        // key frames
        { transform: 'rotate(-135deg)' },
        { transform: 'rotate(' + walletLeft + 'deg)' },
        { transform: 'rotate(' + walletLeft + 'deg)' }
    ], {
        // sync options
        duration: 4000,
        iterations: Infinity
    });
})
