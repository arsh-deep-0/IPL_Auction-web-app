
const socket = io('https://auction.cyclic.app/addNewPlayer');  //we are able to get an instance of io because of this line in ejs
                                            //<script src="https://cdn.socket.io/socket.io-3.0.0.js"></script>

document.getElementById("submit").onclick=()=>{
   
    const myText =document.getElementById("bp").value;
    console.log(myText);
    socket.emit('message', myText); /* our instance of io emited a message to our server, 
                                    now we have to handle it on server ,
                                    go to index.js*/
}

socket.on('message', text => {     /* now this socket instance should handle the messsage emitted 
                                    from server side socket instance to all servers*/

    document.getElementById("ss").innerHTML=text;
    console.log(text);

});

// Regular Websockets

// const socket = new WebSocket('ws://localhost:8080');

// // Listen for messages
// socket.onmessage = ({ data }) => {
//     console.log('Message from server ', data);
// };

// document.querySelector('button').onclick = () => {
//     socket.send('hello');
// }