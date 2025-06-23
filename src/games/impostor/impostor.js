let numPlayers;
let numImpostors;
let playerNames = [];
let playerWords = [];
let currentPlayer = 0;

let words = {};
let impostorIndices = new Set();
let wordsLoaded = false;
let wordVisible = false;

function loadWords() {
    fetch('words.json')
        .then(res => res.json())
        .then(data => {
            words = data;
            wordsLoaded = true;
        })
        .catch(() => alert('Fehler beim Laden der Begriffe.'));
}

function askPlayerNames() {
    if (!wordsLoaded) {
        alert('Die Begriffe werden noch geladen. Bitte warte.');
        return;
    }

    numPlayers    = parseInt(document.getElementById('numPlayers').value);
    numImpostors  = parseInt(document.getElementById('numImpostors').value);

    if (isNaN(numPlayers)   || numPlayers < 1)               { alert('Ungültige Spieleranzahl');   return; }
    if (isNaN(numImpostors) || numImpostors < 1 || numImpostors >= numPlayers) {
        alert('Ungültige Impostor-Anzahl');
        return;
    }

    document.getElementById('player-count').style.display = 'none';

    const nameInputs = document.getElementById('name-inputs');
    nameInputs.innerHTML = '';
    for (let i = 0; i < numPlayers; i++) {
        nameInputs.innerHTML += `<label for="name${i}">Spieler ${i + 1} Name:</label>
                                 <input type="text" id="name${i}" placeholder="Name"><br>`;
    }
    document.getElementById('player-names').style.display = 'block';
}

function startGame() {
    playerNames = [];
    for (let i = 0; i < numPlayers; i++) {
        const name = document.getElementById(`name${i}`).value.trim();
        if (name === '') { alert('Bitte alle Namen ausfüllen'); return; }
        playerNames.push(name);
    }
    assignWords();
}

function assignWords() {
    impostorIndices = new Set();
    while (impostorIndices.size < numImpostors) {
        impostorIndices.add(Math.floor(Math.random() * numPlayers));
    }

    playerWords = [];
    for (let i = 0; i < numPlayers; i++) {
        playerWords.push(impostorIndices.has(i) ? words.impostor : words.words[0]); // alle Nicht-Impostor dasselbe Wort
    }

    document.getElementById('player-names').style.display = 'none';
    document.getElementById('words').style.display = 'block';
    currentPlayer = 0;
    showPlayerScreen();
}

function showPlayerScreen() {
    wordVisible = false;
    document.getElementById('word-text').style.display = 'none';
    document.getElementById('word-text').textContent = playerWords[currentPlayer];
    document.getElementById('current-player').textContent = `Spieler ${currentPlayer + 1}: ${playerNames[currentPlayer]}`;
    document.getElementById('toggle-word-btn').textContent = 'Wort anzeigen';
}

function toggleWord() {
    if (!wordVisible) {
        document.getElementById('word-text').style.display = 'block';
        document.getElementById('toggle-word-btn').textContent = 'Weiter';
        wordVisible = true;
    } else {
        currentPlayer++;
        if (currentPlayer < numPlayers) {
            showPlayerScreen();
        } else {
            document.getElementById('words').style.display = 'none';
            showResultsButton();
        }
    }
}

function showResultsButton() {
    document.getElementById('show-results-container').style.display = 'block';
}

function showResults() {
    document.getElementById('show-results-container').style.display = 'none';
    document.getElementById('results').style.display = 'block';

    const resultsDiv = document.getElementById('answers-list');
    resultsDiv.innerHTML = '';
    for (let i = 0; i < numPlayers; i++) {
        resultsDiv.innerHTML += `<p>${playerNames[i]}: ${playerWords[i]}</p>`;
    }
}

window.onload = loadWords;
