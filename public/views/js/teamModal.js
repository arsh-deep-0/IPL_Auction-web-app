socket.on('buyer-Details',result=>{
    const modalTeams= document.getElementById('modal-teams');
    modalTeams.innerHTML='<p>Teams</p>';
    result.forEach(Buyer => {

        let logoDiv=document.createElement('div');
        logoDiv.classList.add('modal-logo-div');
        logoDiv.id='modal-logo-div-'+Buyer.order;
        modalTeams.appendChild(logoDiv);

        let logoImg = document.createElement('img');
        logoImg.classList.add('modal-logo');
        logoImg.id='modal-logo-'+Buyer.order;  //giving it a class name
        logoImg.src = "/resources/logos/" + Buyer.logo + ".webp";
        logoDiv.appendChild(logoImg)
        
    })
    
    const modalLogos = document.getElementsByClassName('modal-logo');
    //document.getElementById('modal-logo-div-0').back
    
    for (let i = 0; i < modalLogos.length; i++) {
        const modalLogo =document.getElementById('modal-logo-div-'+(i+1));
        
        modalLogo.addEventListener("click", function () {
            // Reset background color of all children to white
            for (let j = 0; j < modalLogos.length; j++) {
               let otherLogo =document.getElementById('modal-logo-div-'+(j+1));
                otherLogo.style.background = "linear-gradient(143.7deg,#462523 -60%, #cb9b51 2%,#f6e27a 45%,#f6f2c0 50%,#f6e27a 55%,#cb9b51 98%,#462523 160%)";
            }
    
            // Set background color of the clicked child to blue
            
            this.style.background = "linear-gradient(-90deg, #25054a 0, #7423ed 100%)";
            console.log(i)
            socket.emit('view-team-players',i+1);  
            socket.emit('view-team-analytics',i+1);                      
            
        });
    }
})


socket.on('view-team-players',players=>{ 
console.log(players);
    
let modalPlayers= document.getElementById('modal-players');


let batsmanDiv=document.getElementById('modal-batsman-div');
   
   batsmanDiv.innerHTML='';
    let bowlerDiv=document.getElementById('modal-bowler-div');
   bowlerDiv.innerHTML='';
    let allrounderDiv=document.getElementById('modal-allrounder-div');
  allrounderDiv.innerHTML='';
players.forEach(player => {
    
  

    let playerDiv=document.createElement('div');
    playerDiv.classList.add('modal-player-div');
    playerDiv.id='modal-player-div-'+player.order;

    if(player.Role=='Bowler'){
        bowlerDiv.appendChild(playerDiv);

    }else if(player.Role=='Batsman'){
        batsmanDiv.appendChild(playerDiv);
    
    }else if(player.Role=="All-Rounder"){
        allrounderDiv.appendChild(playerDiv);
     

    }else{
        batsmanDiv.appendChild(playerDiv);
      
    }
    
    let playerData=document.createElement('div');
    playerData.classList.add('modal-player-data');
    playerDiv.appendChild(playerData);

    let playerName=document.createElement('p');
    playerName.classList.add('modal-player-name');
    playerName.id='modal-player-name'+player.order;
    playerName.innerHTML=player.name;
    playerDiv.appendChild(playerName);

    let playerImg = document.createElement('img');
    playerImg.classList.add('modal-player');
    playerImg.id='modal-player-'+player.order;  //giving it a class name
    playerImg.src = "/resources/players/" + player.name + ".webp";
    playerData.appendChild(playerImg);

    let template=document.createElement('img');
    template.classList.add('modal-player-template');
    template.src="/resources/icons/player-template.webp";
    playerDiv.appendChild(template);
});

})


socket.on('view-team-analytics',team=>{

    //changing selected team logo
    let teamlogo =document.getElementById('mlogo')
    teamlogo.src="/resources/logos/"+team.logo+'.webp';
    console.log(teamlogo.src);


    let walletLeft=(team.currentWallet *180/80)-135;
    let odometer=document.getElementById('odometer');
    odometer.animate([
        // key frames
        { transform: 'rotate(-135deg)' },
        { transform: 'rotate('+walletLeft+'deg)' },
        { transform: 'rotate('+walletLeft+'deg)' }
      ], {
        // sync options
        duration: 4000,
        iterations: Infinity
      });
})
