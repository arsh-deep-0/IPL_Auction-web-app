const socket = io('https://auction-arsh.onrender.com');

const cards = document.querySelectorAll('.card');
const cardHolders = document.querySelectorAll('.card-holder');
let sourceCardHolder = null; // Store the card holder from which the card is being dragged

for (const card of cards) {
    card.addEventListener('dragstart', (e) => {
        e.target.classList.add('hold');
        sourceCardHolder = e.target.closest('.card-holder'); // Store the source card holder
        setTimeout(() => {
            e.target.classList.add('hide');
        }, 0);
    });

    card.addEventListener('dragend', (e) => {
        e.target.className = 'card';
        sourceCardHolder = null; // Clear the source card holder
    });
}

for (const cardHolder of cardHolders) {
    cardHolder.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    cardHolder.addEventListener('dragenter', (e) => {
        e.target.classList.add('dashed');
    });

    cardHolder.addEventListener('dragleave', (e) => {
        e.target.classList.remove('dashed');
    });

    cardHolder.addEventListener('drop', (e) => {
        e.target.classList.remove('dashed');

        if (sourceCardHolder) {
            if (e.target.classList.contains('card')) {
                console.log('Already present');
                const card = sourceCardHolder.querySelector('.hold');
                e.target.parentNode.replaceChild(card, e.target);
                sourceCardHolder.appendChild(e.target);
            } else {
                console.log('Not present');
                const card = sourceCardHolder.querySelector('.hold');
                e.target.appendChild(card);
            }
            sourceCardHolder = null; // Clear the source card holder
        }
    });
}

// Get all the team-div elements
const teamDivs = document.querySelectorAll('.team-div');

function reorder() {
    // Loop through each team-div element
    teamDivs.forEach(teamDiv => {
        // Get the player-rank element within the current team-div
        const playerRankElement = teamDiv.querySelector('.player-rank');

        // Get the number from the player-rank element
        const playerRank = parseInt(playerRankElement.textContent);

        // Calculate the top style value
        const topValue = `${(playerRank - 1) * 3 + 2}rem`; // Here, you can adjust the multiplier as needed

        // Apply the calculated top style value to the parent team-div element
        teamDiv.style.top = topValue;
    });
}

reorder();

// Get all the player-rank elements
const playerRankElements = document.querySelectorAll('.player-rank');

// Function to increase the value by 1 every second
const increaseRank = () => {
    playerRankElements.forEach(playerRankElement => {
        const currentValue = parseInt(playerRankElement.textContent);
        playerRankElement.textContent = ((currentValue + 1)%3+1).toString();
    });
    reorder();
};

// Start increasing ranks every second
setInterval(increaseRank, 1000);


const boxes = document.querySelectorAll('.box');

boxes.forEach(box => {
  setInterval(() => setBorderRadius(box), 300);
});

function setBorderRadius(box) {
    box.style.setProperty('--br-blobby', generateBorderRadiusValue());
    box.style.setProperty('--br-blobby-after', generateBorderRadiusValue());
    box.style.setProperty('--br-blobby-before', generateBorderRadiusValue());
}

function generateBorderRadiusValue() {
    return `${getRandomValue()}% ${getRandomValue()}% ${getRandomValue()}% ${getRandomValue()}% / ${getRandomValue()}% ${getRandomValue()}% ${getRandomValue()}%`;
}
    
function getRandomValue() {
    return Math.floor(Math.random() * 50) + 50;
}




