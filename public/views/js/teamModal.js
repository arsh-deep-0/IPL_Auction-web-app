socket.on('buyer-Details',result=>{
    const modalTeams= document.getElementById('modal-teams');
    modalTeams.innerHTML='';
    let i=0;
    result.forEach(Buyer => {
        let logoDiv=document.createElement('div');
        logoDiv.classList.add('modal-logo-div');
        logoDiv.id='modal-logo-div-'+i;
        modalTeams.appendChild(logoDiv);
        let logoImg = document.createElement('img');
        logoImg.classList.add('modal-logo');
        logoImg.id='modal-logo-'+i;  //giving it a class name
        logoImg.src = "/resources/logos/" + Buyer.logo + ".webp";
        logoDiv.appendChild(logoImg)
        i++; 
    })
    
    const modalLogos = document.getElementsByClassName('modal-logo');
    document.getElementById('modal-logo-div-0').back
    
    for (let i = 0; i < modalLogos.length; i++) {
        const modalLogo =document.getElementById('modal-logo-div-'+i);
        
        modalLogo.addEventListener("click", function () {
            // Reset background color of all children to white
            for (let j = 0; j < modalLogos.length; j++) {
               let otherLogo =document.getElementById('modal-logo-div-'+j);
                otherLogo.style.background = "white";
            }
    
            // Set background color of the clicked child to blue
            
            this.style.background = "linear-gradient(143.7deg, #3b215d 0, #552792 100%)";
            
            
        });
    }
})



