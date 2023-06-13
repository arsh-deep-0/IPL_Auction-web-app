//const socket2 = io('http://localhost:3001'); 


const bottomNavbarLinks = document.getElementsByClassName('bottom-navbar-ele');

 let auctionLink = document.getElementById('play-Auction');
 auctionLink.style.backgroundColor = "#6233fc";
 auctionLink.style.color = "#fff";


for (let i = 0; i < bottomNavbarLinks.length; i++) {
    bottomNavbarLinks[i].addEventListener("click", function () {
        // Reset background color of all children to white
        for (var j = 0; j < bottomNavbarLinks.length; j++) {
            let modal = (bottomNavbarLinks[j].innerHTML) + '-Modal';
           
            if (modal == 'Auction-Modal') { }
            else {
                console.log(modal);
                if(document.getElementById(modal).style.display=="block"){
                    document.getElementById(modal).style.animationName="disappear-to-left-modal";
                    setTimeout(()=>{
                        document.getElementById(modal).style.display = "none";
                    },250)
                    
                }
                
            }
            bottomNavbarLinks[j].style.backgroundColor = "white";
           
            bottomNavbarLinks[j].style.color = "#000"
        }

        // Set background color of the clicked child to blue
        let modal = (this.innerHTML) + '-Modal';
        if (modal == 'Auction-Modal') { }
        else {
            document.getElementById(modal).style.animationName="appear-from-left-modal";
            
                document.getElementById(modal).style.display = "block";
         
        }
        this.style.backgroundColor = "#6233fc";
        this.style.color = "#fff";
        
    });
}













// Close the modal when the user clicks outside of it

