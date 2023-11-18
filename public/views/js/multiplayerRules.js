//const Socket = io('https://auction-arsh.onrender.com/');
const Socket = io('http://localhost:3001');
let input = document.getElementById("numOfPlayers");
let maxValue = 10; // Set your desired maximum value
let minValue=2;


input.addEventListener("input", function() {
  if (this.value > maxValue) {
    this.value = (this.value/10).toFixed(0);
  }
  if (this.value < minValue) {
    this.value = 2;
  }
});

const next= document.getElementById('next');

next.addEventListener('click',collectData);
const params = new URLSearchParams(window.location.search);

document.getElementById('roomID').innerText='RoomID: '+params.get('roomID');

function collectData(){
 
  let data={
    userName:getCookie('userName'),
    userID:getCookie('userID'),
    number:input.value,
    roomID:params.get('roomID')
  }
  Socket.emit('numOfPlayers',data);
  document.getElementById('modal-1').style.display='none';

  let hostname=getCookie('userName');
  let roomID=params.get('roomID');

  window.location.href = `waitingRoom?roomID=${roomID}`;

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




