const socket = require("socket.io-client")("https://auction-arsh.onrender.com/players");

document.getElementById("go").onclick=()=>{
   
    const myText =document.getElementById("input").value;
    console.log(myText);
    socket2.emit('message', myText); /* our instance of io emited a message to our server, 
                                    now we have to handle it on server ,
                                    go to index.js*/
}

socket2.on('message', text => {     /* now this socket instance should handle the messsage emitted 
                                    from server side socket instance to all servers and from their to client side sockets*/

    document.getElementById("jj").innerHTML=text;
    console.log(text);

});