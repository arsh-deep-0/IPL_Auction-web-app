//const Socket= require('./database4myAuction')
//const Socket = io('https://auction-arsh.onrender.com/');
const Socket = io('https://auction-arsh.onrender.com');
console.log(getCookie('userName')); 

let input = document.getElementById("numOfPlayers");
let maxValue = 999999; // Set your desired maximum value
let minValue=0;


input.addEventListener("input", function() {
  if (this.value > maxValue) {
    this.value = (this.value/10).toFixed(0);
  }
  if (this.value < minValue) {
    this.value = 0;
  }
});
const nextButton= document.getElementById('next');
nextButton.addEventListener('click',sendRoomID);

let roomID;
function sendRoomID(){
    roomID=input.value;
    Socket.emit('check-room',roomID);
    console.log('sent');
}

Socket.on('room-found',()=>{
    roomID=input.value;
    window.location.href = `waitingRoom?roomID=${roomID}`;
})

Socket.on('room-not-found',()=>{
document.getElementById('message').innerHTML='No Such Room Exists!! , Please enter a Valid Room Number'
})

// Function to generate a unique user ID based on IP address
function generateUserID(ipAddress) {
    const uniqueID = ipAddress + Date.now();
    return uniqueID;
}

// Function to set a cookie with the given name, value, and days until expiration
function setCookie(name, value, days) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + expirationDate.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Function to get the value of the cookie with the given name
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

// Check if the user has a user ID cookie
const userIDCookie = getCookie("userID");

if (userIDCookie) {
    // User already has a user ID, retrieve it
    const userID = userIDCookie;
    console.log("User ID:", userID);

    // Retrieve the user name from the cookie
    const userNameCookie = getCookie("userName");
    const userName = userNameCookie ? userNameCookie : "";
    console.log("User Name:", userName);

    document.getElementById('greet').style.display = 'flex';
    document.getElementById('username-cookie').innerHTML = 'Hello ' + getCookie('userName');
    
    document.getElementById('enterRoomIDModel').style.display="flex";

   
    

  

} else {
    // User does not have a user ID, generate a new one based on the IP address
    const getIPAddress = async () => {
        try {
            const response = await fetch("https://api.ipify.org?format=json");
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error("Error retrieving IP address:", error);
            return null;
        }
    };

    // Prompt the user for their name
    //const userName = prompt("Please enter your name:");

    document.getElementById('nameModal').style.display = "flex"; //showa the modal if no userID cookie is here
    const submitName = document.getElementById('submit');
    submitName.addEventListener('click', getName);


    function getName() {
        console.log('hi');
        let userName = document.getElementById('name').value;
        document.getElementById('nameModal').style.display = "none";

        // Set the user name as a cookie that expires in 30 days
        setCookie("userName", userName, 30);
        console.log(userName + 'hi');
        console.log("Generated User name:", userName);

        getIPAddress().then(ipAddress => {
            if (ipAddress) {
                const userID = generateUserID(ipAddress);
                console.log("Generated User ID:", userID);


                // Set the user ID as a cookie that expires in 30 days
                setCookie("userID", userID, 30);

                Socket.emit('cookie', { userName: userName, userID: userID })

            } else {
                console.log("Unable to retrieve IP address. User ID and name not set.");
            }
        });

        document.getElementById('enterRoomIDModel').style.display="flex";
        document.getElementById('greet').style.display = 'flex';
        document.getElementById('username-cookie').innerHTML = 'Hello ' + getCookie('userName');
    }


}



