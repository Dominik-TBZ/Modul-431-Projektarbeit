/* fakefragen.js – komplett ersetzt */

let numPlayers;
let numFakePlayers;
let playerNames     = [];
let playerAnswers   = [];
let currentPlayer   = 0;

let questions       = [];
let selectedQuestions = [];
let fakeIndices     = new Set();   // mehrere Fake-Spieler möglich
let randomPairIndex = -1;
let questionsLoaded = false;

function loadQuestions() {
    fetch('questions.json')
        .then(res => res.json())
        .then(data => {
            questions = data;
            questionsLoaded = true;
        })
        .catch(err => alert('Fehler beim Laden der Fragen.'));
}

function askPlayerNames() {
    if (!questionsLoaded) { alert('Fragen werden noch geladen.'); return; }

    numPlayers     = parseInt(document.getElementById('numPlayers').value);
    numFakePlayers = parseInt(document.getElementById('numFakePlayers').value);

    if (isNaN(numPlayers)     || numPlayers < 1)                 { alert('Ungültige Spieleranzahl'); return; }
    if (isNaN(numFakePlayers) || numFakePlayers < 1 ||
        numFakePlayers > numPlayers)                             { alert('Ungültige Fake-Frage-Anzahl'); return; }

    document.getElementById('player-count').style.display = 'none';

    const nameInputs = document.getElementById('name-inputs');
    nameInputs.innerHTML = '';
    for (let i = 0; i < numPlayers; i++) {
        nameInputs.innerHTML += `<label for="name${i}">Spieler ${i + 1} Name:</label>
                                 <input type="text" id="name${i}" placeholder="Name"><br>`;
    }
    document.getElementById('player-names').style.display = 'block';
}

function askQuestions() {
    // Namen prüfen
    playerNames = [];
    for (let i = 0; i < numPlayers; i++) {
        const name = document.getElementById(`name${i}`).value.trim();
        if (!name) { alert('Bitte alle Namen ausfüllen'); return; }
        playerNames.push(name);
    }

    // Frage-Paar zufällig wählen
    randomPairIndex        = Math.floor(Math.random() * questions.length);
    const pair             = questions[randomPairIndex];
    selectedQuestions      = Array(numPlayers).fill(pair.normal);

    // Fake-Spieler festlegen
    fakeIndices = new Set();
    while (fakeIndices.size < numFakePlayers) {
        fakeIndices.add(Math.floor(Math.random() * numPlayers));
    }
    fakeIndices.forEach(i => selectedQuestions[i] = pair.impostor);

    // UI wechseln
    document.getElementById('player-names').style.display = 'none';
    document.getElementById('questions').style.display    = 'block';

    updateQuestionScreen();
}

function updateQuestionScreen() {
    document.getElementById('answer').value           = '';
    document.getElementById('question-text').textContent = selectedQuestions[currentPlayer];
    document.getElementById('current-player').textContent = `Spieler ${currentPlayer + 1}: ${playerNames[currentPlayer]}`;
}

function submitAnswer() {
    const ans = document.getElementById('answer').value.trim();
    if (!ans) { alert('Bitte Antwort eingeben'); return; }

    playerAnswers.push(ans);
    currentPlayer++;

    if (currentPlayer < numPlayers) {
        updateQuestionScreen();
    } else {
        // Alle Antworten erfasst – Ergebnis-Button zeigen
        document.getElementById('questions').style.display         = 'none';
        document.getElementById('show-results-container').style.display = 'block';
    }
}

function showResults() {
    document.getElementById('show-results-container').style.display = 'none';
    document.getElementById('results').style.display               = 'block';

    const list      = document.getElementById('answers-list');
    list.innerHTML  = `<h3>Die Frage: \"${questions[randomPairIndex].normal}\"</h3>`;

    for (let i = 0; i < numPlayers; i++) {
        list.innerHTML += `<p>${playerNames[i]}: ${playerAnswers[i]}</p>`;
    }
}

window.onload = loadQuestions;
