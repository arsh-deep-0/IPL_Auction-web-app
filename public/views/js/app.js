let count=0;
        const socket2 = io('https://auction-arsh.onrender.com');

        document.getElementById("submit").onclick = () => {
            count++;
            const myText =document.getElementById("bp").value;
            console.log(myText);
            socket2.emit('message', myText); /* our instance of io emited a message to our server, 
                                    now we have to handle it on server ,
                                    go to index.js*/
        }

        socket2.on('message', text => {     /* now this socket instance should handle the messsage emitted 
                                    from server side socket instance to all servers and from their to client side sockets*/

                                    document.getElementById("ss").innerHTML=text;
                                    console.log(text);

        });


        if( document.getElementById("ss").innerHTML = "woww"&&count>0){
           // const socket2 = io('https://auction-arsh.onrender.com');

        document.getElementById("submit").onclick = () => {

            
            const myText =document.getElementById("bp").value;
            console.log(myText);
            socket2.emit('message', myText);  /* our instance of io emited a message to our server, 
                                    now we have to handle it on server ,
                                    go to index.js*/
        }

        socket2.on('message', text => {     /* now this socket instance should handle the messsage emitted 
                                    from server side socket instance to all servers and from their to client side sockets*/

            document.getElementById("ss").innerHTML = text;
            console.log(text+"2");

        });
        }



/*        
const socket = io('https://auction-arsh.onrender.com');  //we are able to get an instance of io because of this line in ejs
                                            //<script src="https://cdn.socket.io/socket.io-3.0.0.js"></script>

document.getElementById("submit").onclick=()=>{
   
    const myText =document.getElementById("bp").value;
    console.log(myText);
    socket.emit('message', myText); /* our instance of io emited a message to our server, 
                                    now we have to handle it on server ,
                                    go to index.js*/
/*}

socket.on('message', text => {     /* now this socket instance should handle the messsage emitted 
                                    from server side socket instance to all servers*/

  /*  document.getElementById("ss").innerHTML=text;
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
// }*/