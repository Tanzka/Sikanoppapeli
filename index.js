const players = [];
let gameScore = 100;
let diceAmount = 1;

//Settings

const settings = document.getElementById("settings");
const nameSelect = document.getElementById("names");
const scoreboard = document.getElementById("scoreboard");
const game = document.getElementById("game");

const settingsForm = document.getElementById("settings-form");
const namesForm = document.getElementById("names-form");
settingsForm.addEventListener("submit", submitSettings);
namesForm.addEventListener("submit", submitNames);

function submitSettings(event) {
    event.preventDefault();
    const playersAmount = document.getElementById("player-select").value;
    
    gameScore = document.getElementById("score-goal").value;
    diceAmount = document.forms["settings"]["dice-amount"].value;

    for (let i = 0; i < playersAmount; i++) { 
        let player = {id: i, name: "", score: 0};
        players.push(player);

        let newLabel = document.createElement("label");
        newLabel.setAttribute("class", "label");
        newLabel.setAttribute("for", "name-p" + i);
        newLabel.innerText = "Pelaaja " + (i + 1) + ":";
        nameSelect.appendChild(newLabel);

        let newInput = document.createElement("input");
        newInput.setAttribute("type", "text");
        newInput.setAttribute("id", "name-p" + i);
        nameSelect.appendChild(newInput);
        nameSelect.appendChild(document.createElement("br"));
    }
    settings.setAttribute("class", "hidden");
    nameSelect.setAttribute("class", "");
}

function submitNames(event) {
    event.preventDefault();

    for (let i = 0; i < players.length; i++) { 
        const player = players[i];
        const name = document.getElementById("name-p" + i).value;

        if (name.length < 1) {
            document.getElementById("names-warning").setAttribute("class", "warning");
            return;
        }

        player.name = name;

        let newPlayer = document.createElement("p");
        newPlayer.setAttribute("id", "score-p" + i);
        newPlayer.innerText = name + ": 0";
        scoreboard.appendChild(newPlayer);
    }

    nameSelect.setAttribute("class", "hidden");
    game.setAttribute("class", "");
    startGame();
}

//Define a bunch of variables we need for the game

const dice1 = document.getElementById("dice-1");
const dice2 = document.getElementById("dice-2");
const turnText = document.getElementById("turn");
const scoreText = document.getElementById("score-text");
const winText = document.getElementById("winner-text");

const throwButton = document.getElementById("throw-button");
const endButton = document.getElementById("end-button");
const newGameButton = document.getElementById("new-game");

endButton.addEventListener("click", endTurn);
newGameButton.addEventListener("click", newGame);

let currentTurn = 0;
let turnScore = 0;
let doubles = 0;

function startGame() {
    switch (diceAmount) {
        case "1":
            throwButton.addEventListener("click", throwDie);
            break;
        
        case "2":
            dice2.setAttribute("class", "dice");
            throwButton.addEventListener("click", throwDice);
            break;
    }

    updateTurnText();
}

function throwDie() { 
    let result = Math.floor(Math.random() * 6) + 1;

    dice1.setAttribute("src", "dice_images/" + result + ".gif");

    turnScore += result;
    updateTurnScoreText();

    if (result == 1) {
        turnScore = 0;
        endTurn();
        return;
    }

    if (turnScore + players[currentTurn].score >= gameScore) {
        winGame();
    }
}

function throwDice() { 
    let result1 = Math.floor(Math.random() * 6) + 1;
    let result2 = Math.floor(Math.random() * 6) + 1;

    dice1.setAttribute("src", "dice_images/" + result1 + ".gif");
    dice2.setAttribute("src", "dice_images/" + result2 + ".gif");

    let summedResult = result1 + result2;

    if (result1 == result2) {
        doubles += 1;
        if (doubles == 3) {
            turnScore = 0;
            doubles = 0;
            endTurn();
            return;
        }
        if (result1 == 1) {
            summedResult = 25;
            turnScore += summedResult;
            updateTurnScoreText();
            if (turnScore + players[currentTurn].score >= gameScore) {
                winGame();
            }
            return;
        }
        summedResult *= 2;
        turnScore += summedResult;
        updateTurnScoreText();
        if (turnScore + players[currentTurn].score >= gameScore) {
            winGame();
        }
        return;
    }

    doubles = 0;
    turnScore += summedResult;
    updateTurnScoreText();

    if (result1 == 1 || result2 == 1) {
        turnScore = 0;
        endTurn();
        return;
    }

    if (turnScore + players[currentTurn].score >= gameScore) {
        winGame();
    }
}

function endTurn() {
    updatePlayerScore();
    turnScore = 0;

    currentTurn++;
    if (currentTurn >= players.length) {
        currentTurn = 0;
    }
    updateTurnText();
    updateTurnScoreText();
}

function updateTurnText() {
    turnText.innerText = `Pelaajan ${players[currentTurn].name} vuoro`
}

function updateTurnScoreText() {
    scoreText.innerText = `Vuoron pisteet: ${turnScore}`
}

function updatePlayerScore() {
    players[currentTurn].score += turnScore;
    document.getElementById("score-p" + currentTurn).innerText = `${players[currentTurn].name}: ${players[currentTurn].score}`
}

function winGame() {
    updatePlayerScore();
    throwButton.setAttribute("class", "hidden");
    endButton.setAttribute("class", "hidden");
    winText.innerText = `${players[currentTurn].name} voitti!`
    winText.setAttribute("class", "");
    newGameButton.setAttribute("class", "button");
}

function newGame() {
    location.reload();
}

// Code for the rules modal
const openModalButtons = document.querySelectorAll("[data-modal-target]");
const closeModalButtons = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");

openModalButtons.forEach(button => {
    button.addEventListener("click", () => {
        const modal = document.querySelector(button.dataset.modalTarget);
        openModal(modal);
    });
});

overlay.addEventListener("click", () => {
    const modals = document.querySelectorAll(".modal.active");
    modals.forEach(modal => {
        closeModal(modal);
    });
});

closeModalButtons.forEach(button => {
    button.addEventListener("click", () => {
        const modal = button.closest(".modal");
        closeModal(modal)
    });
});

function openModal(modal) {
    if (modal == null) return;
    modal.classList.add("active");
    overlay.classList.add("active");
}

function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove("active");
    overlay.classList.remove("active");
}

