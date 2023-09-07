
//Deck of cards
let dealtCards = new Set();
var suits = ["spades", "diamonds", "clubs", "hearts"];
var values = ["A", "r02", "r03", "r04", "r05", "r06", "r07", "r08", "r09", "r10", "J", "Q", "K"];
var cardValues = {
    "A": 11,
    "r02": 2,
    "r03": 3,
    "r04": 4,
    "r05": 5,
    "r06": 6,
    "r07": 7,
    "r08": 8,
    "r09": 9,
    "r10": 10,
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


//generates random card, if duplicate will reroll card. assigns suit and value as class id
function generateCard() {
    let cardText, valueClass, suitClass, value, suit;
    do {
        value = getRandomArr(values);
        suit = getRandomArr(suits);
        cardText = value + " of " + suit;
        valueClass = value;
        suitClass = suit;
    } while (dealtCards.has(cardText));

    dealtCards.add(cardText);
    return {
        text: cardText,
        valueClass: valueClass,
        suitClass: suitClass
    };
}

function setCard(selector, cardInfo) {
    let cardEl = document.querySelector(selector);
    cardEl.textContent = cardInfo.text;
    cardEl.classList.add(cardInfo.valueClass, cardInfo.suitClass);
    cardEl.classList.add("card")
    // cardEl.classList.remove("hidden")
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

    setCard(".dealer-card-1", generateCard());
    setCard(".player-card-1", generateCard());
    setCard(".player-card-2", generateCard());

    updatePlayerScore();
    updateDealerScore();
    updateDeckSize();
    enableButtons();

    if (dealtCards.size > 48) {
        shuffleDeck();
        updateDeckSize();
    }
}


//deal single card to player on hit, add suit and value to class


function dealCardPlayer() {
    for (let cardEl of playerCards) {
        if (!cardEl.textContent || cardEl.textContent === "") {
            let cardInfo = generateCard();
            cardEl.textContent = cardInfo.text;
            cardEl.classList.add(cardInfo.valueClass, cardInfo.suitClass);
            cardEl.classList.add("card")

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

//loop to deal single card to dealer until dealer score is higher than player or bust. adds suit and value to class id


function dealCardDealer() {
    let dealerScoreValue = calcDealerScore();

    while (dealerScoreValue < 17 || (dealerScoreValue < playerHandScore && dealerScoreValue <= 21)) {
        for (let cardEl of dealerCards) {
            if (!cardEl.textContent || cardEl.textContent === "") {
                let cardInfo = generateCard();
                cardEl.textContent = cardInfo.text;
                cardEl.classList.add(cardInfo.valueClass, cardInfo.suitClass);
                cardEl.classList.add("card")
                // cardEl.classList.remove("hidden")
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
    hitPlayerBtn.disabled = true;
    standBtn.disabled = true;

    setTimeout(resetTable, 3500)

}

//reset everything but account balance
function resetTable() {


    removeCardClasses();
    shuffleDeck();
    playerCards.forEach(card => card.textContent = "");
    dealerCards.forEach(card => card.textContent = "");
    playerScore.textContent = "";
    dealerScore.textContent = "";
    messageSelector.textContent = "";
    potSize = 0;
    potSizeSelector.textContent = `Pot Size: $${potSize}`;
    dealCardsBtn.disabled = true;
    hitPlayerBtn.disabled = true;
    standBtn.disabled = true;
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

//remove assigned class of suit and value

function removeCardClasses() {


    playerCards.forEach(card => {
        card.classList.remove("card");
        card.textContent = "";

        ['hearts', 'diamonds', 'clubs', 'spades'].forEach(suit => card.classList.remove(suit));

        values.forEach(value => {
            card.classList.remove(value);
        });
    });


    dealerCards.forEach(card => {
        card.classList.remove("card");
        card.textContent = "";

        ['hearts', 'diamonds', 'clubs', 'spades'].forEach(suit => card.classList.remove(suit));

        values.forEach(value => {
            card.classList.remove(value);
        });

    });



}