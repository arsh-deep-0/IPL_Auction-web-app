const Socket = io('https://auction-arsh.onrender.com/');

const params = new URLSearchParams(window.location.search);

let startButton= document.getElementById('start-button');
console.log(startButton.innerHTML);

let roomID = params.get('roomID');
Socket.emit('check-room', roomID);

Socket.on('room-found', (playerData) => {
     
    
    Socket.on('room-full',roomID=>{
        if(roomID==params.get('roomID')){
            document.getElementById('vacancy').style.display = 'flex'; 
            alert('Room is full!!');
            document.getElementById('vacancy').innerHTML='Room is full!!';  
        }
    });
    
        let userDetails = {
            roomID: params.get('roomID'),
            userID: getCookie('userID'),
            userName: getCookie('userName')
        }

        Socket.emit('reached-waiting-room', userDetails);


        let userArray = [];
        let userLogo;

        document.getElementById('roomID').innerHTML = 'Room ID: ' + params.get('roomID');

        Socket.on('new-user-in-waiting-room', (userDetails) => {
            console.log(userDetails);

            let container = document.getElementById('container');
            if (userDetails.roomID == params.get('roomID')) {

                document.getElementById('total-players-reached').innerHTML = userDetails.playersReached;
                document.getElementById('total-players').innerHTML = userDetails.totalPlayers;

                if (userArray.includes(userDetails.userID)) {
                    console.log('statusText-' + userDetails.userID);
                    document.getElementById('statusText-' + userDetails.userID).innerHTML = userDetails.onlineStatus;
                    if (userDetails.onlineStatus == 'online') {
                        document.getElementById('status-light-' + userDetails.userID).style.background = "linear-gradient(90deg,green, rgb(20, 255, 63) )";
                        document.getElementById('status-light-' + userDetails.userID).style.filter = "drop-shadow(0px 0px 0.2rem #00ff55)";
                    } else {
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
                    playerLogo.id = 'player-logo-' + userDetails.userID;

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
                    statusText.id = 'statusText-' + userDetails.userID;

                    if (userDetails.onlineStatus == 'online') {
                        statusLight.style.background = "linear-gradient(140deg,green, rgb(20, 255, 63) )";
                        statusLight.style.filter = "drop-shadow(0px 0px 0.2rem #00ff55)";
                        statusText.innerHTML = 'online';
                    } else {
                        statusLight.style.background = "linear-gradient(-140deg,rgb(85, 2, 2), rgb(255, 28, 20) )";
                        statusLight.style.filter = "drop-shadow(0px 0px 0.2rem #f33232)";
                        statusText.innerHTML = 'offline';
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
                    if (userDetails.userID == getCookie('userID')) {
                        playerRole.innerHTML = playerRole.innerHTML + '  (You)';
                        userLogo = userDetails.userLogo;

                        if(userDetails.role == 'Host'){
                            startButton.innerHTML ='Start';
                        }else{
                            startButton.innerHTML = 'Request to Start'; 
                        }
                    }


                    playerLogo.src = "/resources/logos/" + userDetails.userLogo + '.webp';

                    if (document.getElementById(userDetails.userLogo).innerHTML == 'Taken') {
                        console.log(userDetails.userLogo + 'hi');
                        const avatarButtons = document.getElementsByClassName('selected-status');

                        let i = 0;
                        Array.from(avatarButtons).forEach((button) => {


                            if (button.innerHTML == 'Select' && i == 0) {
                                console.log(button.id);
                                i++;
                                document.getElementById(button.id).innerHTML = 'Taken';
                                document.getElementById(button.id).style.background = "linear-gradient(140deg,rgb(85, 2, 2), rgb(255, 28, 20))";
                                let avatarDetails = {
                                    userID: getCookie('userID'),
                                    userLogo: userDetails.userLogo,
                                    roomID: params.get('roomID'),
                                    newUserLogo: button.id
                                }
                                Socket.emit('avatar-changed', avatarDetails);
                            }

                        });
                    } else {
                        let selectButton = document.getElementById(userDetails.userLogo);
                        selectButton.style.background = "linear-gradient(140deg,rgb(85, 2, 2), rgb(255, 28, 20))";
                        selectButton.innerHTML = 'Taken';
                    }



                }

                const avatarButtons = document.getElementsByClassName('selected-status');

                // Attach click event listener to each avatar element
                Array.from(avatarButtons).forEach((button) => {
                    button.addEventListener('click', () => {
                        console.log(button.id);
                        if (button.innerHTML == 'Select') {
                            let avatarDetails = {
                                userID: getCookie('userID'),
                                userLogo: userLogo,
                                roomID: params.get('roomID'),
                                newUserLogo: button.id
                            }
                            Socket.emit('avatar-changed', avatarDetails);
                        }
                    });
                });

                //starting the auction  

              
                if(startButton.innerHTML=='Start') {
                    startButton.addEventListener('click', startAuction);
                    function startAuction() {
                        Socket.emit('start-auction',roomID);
                    }
                }else{
                    startButton.addEventListener('click', requestToStartAuction);
                    function requestToStartAuction() {
                        Socket.emit('request-to-start-auction',roomID);
                    }
                }
            }
        })

        Socket.on('user-left', userDetails => {

            console.log(userDetails.userID);
            if (userDetails.userID) {
                console.log('statusText-' + userDetails.userID);
                if (userDetails.userID == getCookie('userID')) {

                } else {

                    document.getElementById('statusText-' + userDetails.userID).innerHTML = 'Offline';
                    document.getElementById('status-light-' + userDetails.userID).style.background = "linear-gradient(90deg,rgb(85, 2, 2), rgb(255, 28, 20) )";
                    document.getElementById('status-light-' + userDetails.userID).style.filter = "drop-shadow(0px 0px 0.2rem #f33232)";

                }

            }

        })


        Socket.on('back-online', userID => {
            document.getElementById('statusText-' + userID).innerHTML = 'Online';
            document.getElementById('status-light-' + userID).style.background = "linear-gradient(90deg,green, rgb(20, 255, 63) )";
            document.getElementById('status-light-' + userID).style.filter = "drop-shadow(0px 0px 0.2rem #00ff55)";

        })

        Socket.on('avatar-changed', changes => {
            console.log(changes);
            userLogo = changes.newLogo;
            document.getElementById(changes.newLogo).innerHTML = 'Taken';
            document.getElementById(changes.newLogo).style.background = "linear-gradient(140deg,rgb(85, 2, 2), rgb(255, 28, 20))";
            document.getElementById(changes.oldLogo).innerHTML = 'Select';
            document.getElementById(changes.oldLogo).style.background = "linear-gradient(140deg,green, rgb(20, 255, 63) )";
            document.getElementById('player-logo-' + changes.userID).src = "/resources/logos/" + changes.newLogo + '.webp'

        })

        Socket.on('auction-room-ready',(roomID)=>{
            console.log(roomID);
            if(roomID==params.get('roomID')){
                window.location.href = `Auction?roomID=${roomID}`;
            }
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
    



})

Socket.on('room-not-found', () => {
    alert('No such room exists!');
})

