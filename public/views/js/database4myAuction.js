let count = 0;
const socket = io('https://auction-arsh.onrender.com');

const search = document.getElementById("change");
const next = document.getElementById('NEXT');
const prev = document.getElementById('PREV');

const input = document.getElementById("searchOrder");
const current_player_order = document.getElementById("playerNum")

search.addEventListener("click", decideOrder);
next.addEventListener("click", increaseOrder);
prev.addEventListener("click", decreaseOrder);

function decideOrder() {
    let order = input.value;
    changePlayer(order)
}

function increaseOrder() {
    let order = current_player_order.innerText;
    order++;
    console.log(playerNumber);
    changePlayer(playerNumber + "");
}
function decreaseOrder() {
    let order = current_player_order.innerHTML;
    order--;
    console.log(playerNumber);
    changePlayer(playerNumber + "");
}

function changePlayer(playerOrder) {

    socket.emit('change-Player', playerOrder);
    console.log("emiited");
    //set bids section to default
    document.getElementById("hidden").style.display = "none";
    document.getElementById("bids-3").style.display = "block";
    document.getElementById("UP").style.display = "block";
    document.getElementById("Sold").style.display = "block";
    document.getElementById("teamSelector").style.display = "none";
}


socket.on('change-Player', (result) => {
    console.log(result);
    result.forEach(myElement => {
        document.getElementById("name").innerHTML = myElement.name;
        document.getElementById("playerNum").innerHTML = myElement.order;
        document.getElementById("currPlayerImg").src = "/resources/Players/" + myElement.name + ".png";
        document.getElementById("roleImg").src = "/resources/icons/" + myElement.Role + ".png";
        document.getElementById("flagImg").src = "/resources/icons/" + myElement.Nationality + ".png";
        document.getElementById("batAvg").innerHTML = myElement.batPts;
        document.getElementById("bowlPts").innerHTML = myElement.bowlPts;
        document.getElementById("basePrice").innerHTML = myElement.BasePrice;
        document.getElementById("wkPts").innerHTML = myElement.wkPts;
        document.getElementById("nationality").innerHTML = myElement.Nationality;
        document.getElementById("role").innerHTML = myElement.Role;

        //set bids section to default
        document.getElementById("hidden").style.display = "none";
        document.getElementById("bids-3").style.display = "block";
        document.getElementById("UP").style.display = "block";
        document.getElementById("Sold").style.display = "block";
        document.getElementById("teamSelector").style.display = "none";
    });
})







if (document.getElementById("searchOrder").innerHTML = "woww" && count > 0) {
    search.addEventListener("click", decideOrder);
    next.addEventListener("click", increaseOrder);
    prev.addEventListener("click", decreaseOrder);

    function decideOrder() {
        console.log("if");
        let order = input.value;
        changePlayer(order)
    }

    function increaseOrder() {
        let order = current_player_order.innerText;
        order++;
        console.log(playerNumber);
        changePlayer(playerNumber + "");
    }
    function decreaseOrder() {
        let order = current_player_order.innerHTML;
        order--;
        console.log(playerNumber);
        changePlayer(playerNumber + "");
    }

    function changePlayer(playerOrder) {

        socket.emit('change-Player', playerOrder);
        console.log("emiited");
        //set bids section to default
        document.getElementById("hidden").style.display = "none";
        document.getElementById("bids-3").style.display = "block";
        document.getElementById("UP").style.display = "block";
        document.getElementById("Sold").style.display = "block";
        document.getElementById("teamSelector").style.display = "none";
    }


    socket.on('change-Player', (result) => {
        console.log(result,"wow");
        result.forEach(myElement => {
            document.getElementById("name").innerHTML = myElement.name;
            document.getElementById("playerNum").innerHTML = myElement.order;
            document.getElementById("currPlayerImg").src = "/resources/Players/" + myElement.name + ".png";
            document.getElementById("roleImg").src = "/resources/icons/" + myElement.Role + ".png";
            document.getElementById("flagImg").src = "/resources/icons/" + myElement.Nationality + ".png";
            document.getElementById("batAvg").innerHTML = myElement.batPts;
            document.getElementById("bowlPts").innerHTML = myElement.bowlPts;
            document.getElementById("basePrice").innerHTML = myElement.BasePrice;
            document.getElementById("wkPts").innerHTML = myElement.wkPts;
            document.getElementById("nationality").innerHTML = myElement.Nationality;
            document.getElementById("role").innerHTML = myElement.Role;

            //set bids section to default
            document.getElementById("hidden").style.display = "none";
            document.getElementById("bids-3").style.display = "block";
            document.getElementById("UP").style.display = "block";
            document.getElementById("Sold").style.display = "block";
            document.getElementById("teamSelector").style.display = "none";
        });
    })

}



        const socket2 = io('https://auction-arsh.onrender.com');

        document.getElementById("go").onclick = () => {
            count++;
            const myText = document.getElementById("input").value;
            console.log(myText);
            socket2.emit('message', myText); /* our instance of io emited a message to our server, 
                                    now we have to handle it on server ,
                                    go to index.js*/
        }

        socket2.on('message', text => {     /* now this socket instance should handle the messsage emitted 
                                    from server side socket instance to all servers and from their to client side sockets*/

            document.getElementById("jj").innerHTML = text;
            console.log(text + "2");

        });


        if( document.getElementById("jj").innerHTML = "woww"&&count>0){
            // const socket2 = io('http://localhost:3001');

            document.getElementById("go").onclick = () => {

                const myText = document.getElementById("input").value;
                console.log(myText + "2");
                socket2.emit('message', myText); /* our instance of io emited a message to our server, 
                                    now we have to handle it on server ,
                                    go to index.js*/
            }

            socket2.on('message', text => {     /* now this socket instance should handle the messsage emitted 
                                    from server side socket instance to all servers and from their to client side sockets*/

                document.getElementById("jj").innerHTML = text;
                console.log(text + "2");

            });
        }