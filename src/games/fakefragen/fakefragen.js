let numPlayers;
let playerNames = [];
let playerAnswers = [];
let currentPlayer = 0;
let questions = [];
let selectedQuestions = [];
let impostorIndex = -1;
let randomIndex = -1;  // Stellt sicher, dass der zufällige Index der Frage erhalten wird
let questionsLoaded = false; // Flag, um zu überprüfen, ob die Fragen geladen wurden

function loadQuestions() {
    // Hier holen wir die Fragen aus der JSON-Datei
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            questionsLoaded = true; // Fragen wurden erfolgreich geladen
        })
        .catch(error => {
            console.error("Fehler beim Laden der Fragen:", error);
        });
}

function askPlayerNames() {
    if (!questionsLoaded) {
        alert("Die Fragen werden noch geladen. Bitte versuche es später erneut.");
        return;  // Verhindert das Ausführen, bevor die Fragen geladen sind
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

function askQuestions() {
    if (!questionsLoaded) {
        alert("Die Fragen sind noch nicht vollständig geladen.");
        return;
    }

    for (let i = 0; i < numPlayers; i++) {
        playerNames.push(document.getElementById(`name${i}`).value);
    }
    if (playerNames.some(name => name.trim() === "")) {
        alert("Bitte gib für alle Spieler einen Namen ein.");
        return;
    }

    // Zufällig eine Frage auswählen und Impostor-Frage zuweisen
    randomIndex = Math.floor(Math.random() * questions.length);
    let selectedQuestionPair = questions[randomIndex];

    // Alle Spieler bekommen die normale Frage, außer ein zufälliger Spieler, der die Impostor-Frage erhält
    selectedQuestions = Array(numPlayers).fill(selectedQuestionPair.normal);
    impostorIndex = Math.floor(Math.random() * numPlayers);  // Zufällig einen Spieler für die Impostor-Frage auswählen
    selectedQuestions[impostorIndex] = selectedQuestionPair.impostor;

    document.getElementById("player-names").style.display = "none";
    document.getElementById("questions").style.display = "block";

    let question = selectedQuestions[currentPlayer];
    document.getElementById("question-text").textContent = question;
    document.getElementById("current-player").textContent = `Spieler ${currentPlayer + 1}: ${playerNames[currentPlayer]}`;
}

function submitAnswer() {
    let answer = document.getElementById("answer").value;
    if (answer.trim() === "") {
        alert("Bitte gib eine Antwort ein.");
        return;
    }

    playerAnswers.push(answer);
    currentPlayer++;

    if (currentPlayer < numPlayers) {
        document.getElementById("answer").value = "";
        document.getElementById("question-text").textContent = selectedQuestions[currentPlayer];
        document.getElementById("current-player").textContent = `Spieler ${currentPlayer + 1}: ${playerNames[currentPlayer]}`;
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById("questions").style.display = "none";
    document.getElementById("results").style.display = "block";
    let resultsDiv = document.getElementById("answers-list");

    let question = questions[randomIndex].normal;
    resultsDiv.innerHTML += `<h3>Die Frage: "${question}"</h3>`;
    
    for (let i = 0; i < numPlayers; i++) {
        resultsDiv.innerHTML += `<p>${playerNames[i]}: ${playerAnswers[i]}</p>`;
    }

    
    
}


window.onload = function() {
    loadQuestions(); 
};
