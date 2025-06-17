let numPlayers;
let playerNames = [];
let playerWords = [];
let currentPlayer = 0;
let words = {};  // Objekt, um die Wörter zu speichern
let impostorIndex = -1;
let wordsLoaded = false; // Flag, um zu überprüfen, ob die Begriffe geladen wurden

function loadWords() {
    // Hier holen wir die Begriffe aus der JSON-Datei
    fetch('words.json')
        .then(response => response.json())
        .then(data => {
            words = data;
            wordsLoaded = true; // Begriffe wurden erfolgreich geladen
            console.log("Begriffe geladen:", words);  // Überprüfen, ob die Daten korrekt geladen wurden
        })
        .catch(error => {
            console.error("Fehler beim Laden der Begriffe:", error);
            alert("Fehler beim Laden der Begriffe.");
        });
}

function askPlayerNames() {
    if (!wordsLoaded) {
        alert("Die Begriffe werden noch geladen. Bitte versuche es später erneut.");
        return;  // Verhindert das Ausführen, bevor die Begriffe geladen sind
    }

    numPlayers = parseInt(document.getElementById("numPlayers").value);
    if (isNaN(numPlayers) || numPlayers < 1) {
        alert("Bitte gib eine gültige Anzahl an Spielern ein.");
        return;
    }
    document.getElementById("player-count").style.display = "none";
    let nameInputs = document.getElementById("name-inputs");
    for (let i = 0; i < numPlayers; i++) {
        nameInputs.innerHTML += `
            <label for="name${i}">Spieler ${i + 1} Name:</label>
            <input type="text" id="name${i}" placeholder="Name">
            <br>
        `;
    }
    document.getElementById("player-names").style.display = "block";
}

function startGame() {
    // Überprüfen, ob alle Namen eingegeben wurden
    for (let i = 0; i < numPlayers; i++) {
        const name = document.getElementById(`name${i}`).value.trim();
        if (name === "") {
            alert("Bitte gib für alle Spieler einen Namen ein.");
            return;
        }
        playerNames.push(name);
    }

    // Blocker anzeigen und den ersten Spieler benennen
    showNameBlocker();
}

function showNameBlocker() {
    // Zeige den Blocker an und nenne den ersten Spieler
    let firstPlayer = playerNames[0];
    document.getElementById("first-player-name").textContent = firstPlayer;
    document.getElementById("name-blocker").style.display = "flex";  // Zeige den Blocker an
    setTimeout(function() {
        // Verstecke den Blocker nach 2 Sekunden
        document.getElementById("name-blocker").style.display = "none";
        // Starte das Spiel
        assignWords();
    }, 2000);  // Blocker für 2 Sekunden anzeigen
}

function assignWords() {
    if (!wordsLoaded) {
        alert("Die Begriffe sind noch nicht vollständig geladen.");
        return;
    }

    // Zufällig einen Impostor auswählen
    impostorIndex = Math.floor(Math.random() * numPlayers);

    // Alle Spieler bekommen das gleiche Wort „Apfel“, außer der Impostor
    playerWords = [];
    for (let i = 0; i < numPlayers; i++) {
        if (i === impostorIndex) {
            playerWords.push(words.impostor);  // Der Impostor bekommt „Impostor“
        } else {
            playerWords.push(words.words[0]);  // Alle anderen bekommen „Apfel“ (erstes Wort)
        }
    }

    // Zeigt den Begriff des ersten Spielers an
    showCurrentPlayerWord();
    document.getElementById("player-names").style.display = "none";
    document.getElementById("words").style.display = "block";
}

function showCurrentPlayerWord() {
    let word = playerWords[currentPlayer];
    document.getElementById("word-text").textContent = `Dein Wort: ${word}`;
    document.getElementById("current-player").textContent = `Spieler ${currentPlayer + 1}: ${playerNames[currentPlayer]}`;
}

function submitAnswer() {
    // Verstecke den Titel „Dein Wort:“, den Namen des letzten Spielers, und den „Weiter“-Button
    if (currentPlayer === numPlayers - 1) {
        // Verstecke alle relevanten Elemente des letzten Spielers
        document.getElementById("current-player").style.display = "none";  
        document.getElementById("word-text").style.display = "none";  
        document.getElementById("words").querySelector("button").style.display = "none";  // Verstecke den Weiter-Button
        document.getElementById("word-title").style.display = "none";  // Verstecke den Titel „Dein Wort:“
    }

    currentPlayer++;

    if (currentPlayer < numPlayers) {
        // Der nächste Spieler bekommt seinen Begriff angezeigt
        showCurrentPlayerWord();  // Begriff des nächsten Spielers anzeigen
    } else {
        // Wenn es der letzte Spieler war, Blocker anzeigen
        showResultsButton();  
    }
}

function showResultsButton() {
    document.getElementById("show-results-container").style.display = "block"; // Button anzeigen
}

function showResults() {
    // Beim Anzeigen der Ergebnisse alles zurücksetzen
    document.getElementById("show-results-container").style.display = "none";  // Button ausblenden
    document.getElementById("words").style.display = "none";
    document.getElementById("results").style.display = "block";
    let resultsDiv = document.getElementById("answers-list");

    // Zeigt alle Spieler und ihre Wörter
    for (let i = 0; i < numPlayers; i++) {
        resultsDiv.innerHTML += `<p>${playerNames[i]}: ${playerWords[i]}</p>`;
    }

    // Optional: Zurücksetzen der aktuellen Anzeige für den letzten Spieler
    document.getElementById("current-player").style.display = "none";
    document.getElementById("word-text").style.display = "none";
}

// Lädt Begriffe und startet das Spiel, sobald die Seite geladen wird
window.onload = function() {
    loadWords(); // Lädt die Begriffe
};
