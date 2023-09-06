
//Deck of cards
let dealtCards = new Set();
var suits = ["spades", "diamonds", "clubs", "hearts"];
var values = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var cardValues = {
    "Ace": 11,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "J": 10,
    "Q": 10,
    "K": 10,

}





//generate random number
function getRandomNumber(array) {
    return Math.floor(Math.random() * array.length)
}
//pick random from array
function getRandomArr(array) {
    return array[getRandomNumber(array)];
}
//pick random card & if same card already dealt will generate new card
function generateCard() {
    let card;
    do {
        card = getRandomArr(values) + " of " + getRandomArr(suits);
    } while (dealtCards.has(card));
    dealtCards.add(card);
    return card;
}


//object selectors 
const dealCardsBtn = document.querySelector("#deal-cards")
const playerCard1 = document.querySelector(".player-card-1")
const hitPlayerBtn = document.querySelector("#hit")
const playerScore = document.querySelector(".player-score")
const playerCards = document.querySelectorAll(".player-hand p")
const dealerCards = document.querySelectorAll(".dealer-hand p")
const dealerScore = document.querySelector(".dealer-score")
const standBtn = document.querySelector(".btn#stand")
const deckSize = document.querySelector(".deck-size");
const messageSelector = document.querySelector(".message")
const resetBtn = document.querySelector("#reset")
const stackSelector = document.querySelector(".stack")
const potSizeSelector = document.querySelector(".pot-size")
const bet10Btn = document.querySelector("#bet10");
const bet50Btn = document.querySelector("#bet50");
const bet100Btn = document.querySelector("#bet100");

deckSize.style.display = "none"
let potSize = 0;
let stackValue = 1000;
stackSelector.textContent = `Stack: $${stackValue}`;
potSizeSelector.textContent = `Pot Size: $${potSize}`;

dealCardsBtn.disabled = true;
resetBtn.disabled = true;
standBtn.disabled = true;
hitPlayerBtn.disabled = true;



//btn events
dealCardsBtn.addEventListener("click", dealCards);
hitPlayerBtn.addEventListener("click", dealCardPlayer);
standBtn.addEventListener("click", standHand);
resetBtn.addEventListener("click", resetTable);
bet10Btn.addEventListener("click", bet10fn);
bet50Btn.addEventListener("click", bet50fn);
bet100Btn.addEventListener("click", bet100fn);



//dealer/player cards
function dealCards() {


    document.querySelector(".dealer-card-1").textContent = generateCard();
    document.querySelector(".player-card-1").textContent = generateCard();
    document.querySelector(".player-card-2").textContent = generateCard();
    updatePlayerScore();
    updateDealerScore();
    updateDeckSize();
    enableButtons();

    if (dealtCards.size > 48) {
        shuffleDeck();
        updateDeckSize();
    }
}


//deal single card to player on hit
function dealCardPlayer() {

    for (let cardEl of playerCards) {
        if (!cardEl.textContent || cardEl.textContent === "") {
            cardEl.textContent = generateCard();
            break;
        }
    }
    updatePlayerScore();
    updateDeckSize()

    if (dealtCards.size > 50) {
        shuffleDeck();
        updateDeckSize();
    }

    if (playerHandScore === 21) {
        standHand();
    }
}

//loop to deal single card to dealer until dealer score is higher than player or bust
function dealCardDealer() {


    let dealerScoreValue = calcDealerScore();

    while (dealerScoreValue < 17 || (dealerScoreValue < playerHandScore && dealerScoreValue <= 21)) {
        for (let cardEl of dealerCards) {
            if (!cardEl.textContent || cardEl.textContent === "") {

                cardEl.textContent = generateCard();
                break;
            }
        }
        dealerScoreValue = calcDealerScore();
    }

    updateDealerScore();
    updateDeckSize();

    if (dealtCards.size > 50) {
        shuffleDeck();
        updateDeckSize();
    }


}



// //finding players hand score
function calcPlayerScore() {
    playerHandScore = 0;
    let numAces = 0;



    for (let cardEl of playerCards) {
        if (cardEl.textContent) {
            let card = cardEl.textContent.split(" of ")[0];

            if (card === 'Ace') {
                numAces += 1;
            }

            playerHandScore = playerHandScore + cardValues[card];
        }
    }

    while (playerHandScore > 21 && numAces >= 1) {
        playerHandScore = playerHandScore - 10;
        numAces = numAces - 1;
    }

    return playerHandScore
}

//finding dealers hand score
function calcDealerScore() {
    dealerHandScore = 0;
    numAces = 0

    for (let cardEl of dealerCards) {
        if (cardEl.textContent) {
            let card = cardEl.textContent.split(" of ")[0];

            if (card === 'Ace') {
                numAces += 1;
            }

            dealerHandScore = dealerHandScore + cardValues[card];
        }
    }

    while (dealerHandScore > 21 && numAces >= 1) {
        dealerHandScore = dealerHandScore - 10;
        numAces = numAces - 1;
    }

    return dealerHandScore
}


//updating player score
function updatePlayerScore() {
    const score = calcPlayerScore();
    playerScore.textContent = "Player Score: " + score;

    if (score > 21) {
        determineWinner();
    }
}

//updating dealer score

function updateDealerScore() {
    const score = calcDealerScore();
    dealerScore.textContent = "Dealer Score: " + score;
}

// stand to pass turn to dealer
function standHand() {
    dealCardDealer();
    determineWinner();
}



//function to reset dealtCards (shuffle deck)
function shuffleDeck() {
    dealtCards.clear();
    updateDeckSize()
}

function updateDeckSize() {
    const remainingCards = 52 - dealtCards.size;
    deckSize.textContent = "Cards Left: " + remainingCards;
}


//determine winner

function determineWinner() {
    const playerScore = calcPlayerScore();
    const dealerScore = calcDealerScore();
    let result = "";

    if (playerScore > 21 && dealerScore > 21) {
        result = "Both Player and Dealer busted! It's a draw!";
    } else if (playerScore > 21) {
        result = "Player busted! Dealer wins!";
    } else if (dealerScore > 21) {
        stackValue = stackValue + potSize * 2
        result = "Dealer busted! Player wins!";
    } else if (playerScore > dealerScore) {
        stackValue = stackValue + potSize * 2
        result = "Player wins!";
    } else if (dealerScore > playerScore) {
        result = "Dealer wins!";
    } else {
        stackValue = stackValue + potSize
        result = "It's a draw!";
        stackSelector.textContent = `Stack: $${stackValue}`;
    }

    messageSelector.textContent = result;
    stackSelector.textContent = `Stack: $${stackValue}`;
    // dealCardsBtn.disabled = false;
    hitPlayerBtn.disabled = true;
    standBtn.disabled = true;

    setTimeout(resetTable, 3500)

}

//reset everything but account balance
function resetTable() {
    shuffleDeck();
    playerCards.forEach(card => card.textContent = "");
    dealerCards.forEach(card => card.textContent = "");
    playerScore.textContent = "Player Score: ";
    dealerScore.textContent = "Dealer Score: ";
    messageSelector.textContent = "";
    potSize = 0;
    potSizeSelector.textContent = `Pot Size: $${potSize}`;
    dealCardsBtn.disabled = false;
    hitPlayerBtn.disabled = false;
    standBtn.disabled = false;
    bet10Btn.disabled = false;
    bet50Btn.disabled = false;
    bet100Btn.disabled = false;
}


//enable/disable buttons
function enableButtons() {
    resetBtn.disabled = false;
    standBtn.disabled = false;
    hitPlayerBtn.disabled = false;
    dealCardsBtn.disabled = true;
    bet10Btn.disabled = true;
    bet50Btn.disabled = true;
    bet100Btn.disabled = true;
}
//stackValue/potSize
//add $$$ to pot, decrease from stack
function bet10fn() {
    if (stackValue < 10) {
        return
    }
    potSize = potSize + 10;
    stackValue = stackValue - 10;
    potSizeSelector.textContent = `Pot Size: $${potSize}`;
    stackSelector.textContent = `Stack: $${stackValue}`;
    dealCardsBtn.disabled = false;
}
function bet50fn() {
    if (stackValue < 50) {
        return
    }
    potSize = potSize + 50;
    stackValue = stackValue - 50;
    potSizeSelector.textContent = `Pot Size: $${potSize}`;
    stackSelector.textContent = `Stack: $${stackValue}`;
    dealCardsBtn.disabled = false;
}
function bet100fn() {
    if (stackValue < 100) {
        return
    }
    potSize = potSize + 100;
    stackValue = stackValue - 100;
    potSizeSelector.textContent = `Pot Size: $${potSize}`;
    stackSelector.textContent = `Stack: $${stackValue}`;
    dealCardsBtn.disabled = false;
}