let celebrities = [];
let selectedCelebrityPlayer1 = [];
let selectedCelebrityPlayer2 = [];

function loadCelebrities() {
    fetch('personalities.json') // Lade Persönlichkeiten aus der JSON-Datei
        .then(response => response.json())
        .then(data => {
            celebrities = data.personalities;
            generateGrid();
        })
        .catch(error => {
            console.error("Fehler beim Laden der Persönlichkeiten:", error);
        });
}

function generateGrid() {
    const gridContainerPlayer1 = document.getElementById("grid-container-player1");
    const gridContainerPlayer2 = document.getElementById("grid-container-player2");

    celebrities.forEach((celebrity, index) => {
        // Erstellen des HTML-Elements nur für das Bild
        const div = document.createElement("div");
        div.classList.add("grid-item");
        div.innerHTML = `<img src="img/${celebrity.image}" alt="${celebrity.name}" data-name="${celebrity.name}">`;

        // Spieler 1 - Einfügen des Charakters
        const player1Div = div.cloneNode(true);
        player1Div.id = `player1-item-${celebrity.name}`;
        player1Div.onclick = () => selectCelebrity(index, player1Div, "player1");
        gridContainerPlayer1.appendChild(player1Div);

        // Spieler 2 - Einfügen des Charakters
        const player2Div = div.cloneNode(true);
        player2Div.id = `player2-item-${celebrity.name}`;
        player2Div.onclick = () => selectCelebrity(index, player2Div, "player2");
        gridContainerPlayer2.appendChild(player2Div);
    });
}

function selectCelebrity(index, element, player) {
    // Überprüfen, ob das Bild bereits deaktiviert wurde (ausgewählt oder ausgeschlossen)
    if (element.classList.contains('disabled')) {
        // Falls es deaktiviert ist, aktiviere es wieder
        element.classList.remove('disabled');
        if (player === "player1") {
            selectedCelebrityPlayer1 = selectedCelebrityPlayer1.filter(name => name !== celebrities[index].name);
            document.getElementById("selected-name-player1").textContent = selectedCelebrityPlayer1.join(', ') || 'Keine Auswahl';
        } else {
            selectedCelebrityPlayer2 = selectedCelebrityPlayer2.filter(name => name !== celebrities[index].name);
            document.getElementById("selected-name-player2").textContent = selectedCelebrityPlayer2.join(', ') || 'Keine Auswahl';
        }
    } else {
        // Wenn der Charakter noch nicht deaktiviert wurde, füge ihn zur Auswahl hinzu
        element.classList.add('disabled');
        if (player === "player1") {
            selectedCelebrityPlayer1.push(celebrities[index].name);
            document.getElementById("selected-name-player1").textContent = selectedCelebrityPlayer1.join(', ');
        } else {
            selectedCelebrityPlayer2.push(celebrities[index].name);
            document.getElementById("selected-name-player2").textContent = selectedCelebrityPlayer2.join(', ');
        }
    }
}

// Lade die Persönlichkeiten bei Seitenaufruf
window.onload = function() {
    loadCelebrities();
};
