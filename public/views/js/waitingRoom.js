const Socket = io('https://auction-arsh.onrender.com/');

const params = new URLSearchParams(window.location.search);

let userDetails = {
    roomID: params.get('roomID'),
    userID: getCookie('userID'),
    userName: getCookie('userName')
}


Socket.emit('reached-waiting-room', userDetails);

let userArray = [];

Socket.on('new-user-in-waiting-room', (userDetails) => {
    console.log(userDetails);

    let container = document.getElementById('container');
    if (userDetails.roomID == params.get('roomID')) {
        if (userArray.includes(userDetails.userID)) {
            console.log('statusText-' + userDetails.userID);
            document.getElementById('statusText-' + userDetails.userID).innerHTML = userDetails.onlineStatus;
            if(userDetails.onlineStatus=='online'){
                document.getElementById('status-light-' + userDetails.userID).style.background = "linear-gradient(90deg,green, rgb(20, 255, 63) )";
                document.getElementById('status-light-' + userDetails.userID).style.filter = "drop-shadow(0px 0px 0.2rem #00ff55)";
            }else{
                document.getElementById('statusText-' + userDetails.userID).innerHTML = 'Offline'; 
                document.getElementById('status-light-' + userDetails.userID).style.background = "linear-gradient(90deg,rgb(85, 2, 2), rgb(255, 28, 20) )";
                document.getElementById('status-light-' + userDetails.userID).style.filter = "drop-shadow(0px 0px 0.2rem #f33232)";
        
            }
            
            
        } else {
            userArray.push(userDetails.userID);

            let playerDiv = document.createElement('div');
            playerDiv.classList.add('player-div');
            playerDiv.id = 'player-' + userDetails.userID;
            container.appendChild(playerDiv);

            let playerNameDiv = document.createElement('div');
            playerNameDiv.classList.add('player-name');
            playerDiv.appendChild(playerNameDiv);

            let serialNumber = document.createElement('p');
            let playerName = document.createElement('p');
            let playerRole = document.createElement('p');
            serialNumber.id = 'serial-number';
            playerName.id = 'player-name';
            playerRole.id = 'player-role';

            let playerLogo = document.createElement('img');
            playerLogo.classList.add('player-logo');

            playerNameDiv.appendChild(serialNumber);
            playerNameDiv.appendChild(playerLogo);
            playerNameDiv.appendChild(playerName);
            playerNameDiv.appendChild(playerRole);


            let onlineStatus = document.createElement('div');
            onlineStatus.classList.add('online-status');
            playerDiv.appendChild(onlineStatus);

            let statusLight = document.createElement('div');
            statusLight.classList.add('status-light');
            statusLight.id = 'status-light-' + userDetails.userID;
            
            let statusText = document.createElement('p');
            statusText.id='statusText-'+userDetails.userID;
          
            if(userDetails.onlineStatus=='online'){
                statusLight.style.background = "linear-gradient(90deg,green, rgb(20, 255, 63) )";
                statusLight.style.filter = "drop-shadow(0px 0px 0.2rem #00ff55)";
                statusText.innerHTML='online';
            }else{
                statusLight.style.background = "linear-gradient(90deg,rgb(85, 2, 2), rgb(255, 28, 20) )";
                statusLight.style.filter = "drop-shadow(0px 0px 0.2rem #f33232)";
                statusText.innerHTML='offline';
            }

            onlineStatus.appendChild(statusLight);
            onlineStatus.appendChild(statusText);

            serialNumber.innerHTML = userArray.length + '.';
            playerName.innerHTML = userDetails.userName;
            if (userDetails.role == 'Host') {
                playerRole.innerHTML = userDetails.role;
            } else {
                playerRole.innerHTML = userDetails.role + '-' + userArray.length;
            }
            playerLogo.src = "/resources/logos/" + userDetails.userLogo + '.webp';
         
        }
    }
})

Socket.on('user-left', userDetails => {

    console.log(userDetails.userID);
    if (userDetails.userID) { 
        console.log('statusText-' + userDetails.userID);
        if(userDetails.userID==getCookie('userID')){

        } else{
           
            document.getElementById('statusText-' + userDetails.userID).innerHTML = 'Offline'; 
            document.getElementById('status-light-' + userDetails.userID).style.background = "linear-gradient(90deg,rgb(85, 2, 2), rgb(255, 28, 20) )";
            document.getElementById('status-light-' + userDetails.userID).style.filter = "drop-shadow(0px 0px 0.2rem #f33232)";
    
        }
        
    }

})


Socket.on('back-online',userID=>{
    document.getElementById('statusText-' + userID).innerHTML = 'Online';
            document.getElementById('status-light-' + userID).style.background = "linear-gradient(90deg,green, rgb(20, 255, 63) )";
            document.getElementById('status-light-' + userID).style.filter = "drop-shadow(0px 0px 0.2rem #00ff55)";
    
})













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