
const bottomNavbarLinks = document.getElementsByClassName('bottom-navbar-ele');

 let auctionLink = document.getElementById('play-Auction');
 auctionLink.style.background = "linear-gradient( 143.7deg, #f97794 -20%,  #6200ff 40%,   #7423ed 100%)";
 auctionLink.style.color = "#fff";


for (let i = 0; i < bottomNavbarLinks.length; i++) {
    bottomNavbarLinks[i].addEventListener("click", function () {
        // Reset background color of all children to white
        for (var j = 0; j < bottomNavbarLinks.length; j++) {
            let modal = (bottomNavbarLinks[j].innerHTML) + '-Modal';
           
            if (modal == 'Auction-Modal') {
                
             }
            else {
                console.log(modal);
                if(document.getElementById(modal).style.display=="block"){
                    document.getElementById(modal).style.animationName="disappear-to-left-modal";
                    setTimeout(()=>{
                        document.getElementById(modal).style.display = "none";
                    },250) 
                    
                }
                
            }
            bottomNavbarLinks[j].style.background = "linear-gradient(143.7deg,#462523 -60%, #cb9b51 2%,#f6e27a 45%,#f6f2c0 50%,#f6e27a 55%,#cb9b51 98%,#462523 160%)";
           
            bottomNavbarLinks[j].style.color = "#000"
        }

        // Set background color of the clicked child to blue
        let modal = (this.innerHTML) + '-Modal';
        if (modal == 'Auction-Modal') { }
        else {
            document.getElementById(modal).style.animationName="appear-from-left-modal";
            
                document.getElementById(modal).style.display = "block";
         
        }
        this.style.background = "linear-gradient( 143.7deg, #f97794 -20%,  #6200ff 40%,   #7423ed 100%)";
        this.style.color = "white";
        
    });
}















