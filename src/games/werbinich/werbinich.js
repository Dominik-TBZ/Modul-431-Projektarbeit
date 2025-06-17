let celebrities = [];
let selectedCelebrityPlayer1 = null;
let selectedCelebrityPlayer2 = null;

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
        const div = document.createElement("div");
        div.classList.add("grid-item");
        div.innerHTML = `
            <img src="img/${celebrity.image}" alt="${celebrity.name}" data-name="${celebrity.name}">
        `;

        // Spieler 1
        const player1Div = div.cloneNode(true);
        player1Div.onclick = () => selectCelebrity(index, player1Div, "player1");
        gridContainerPlayer1.appendChild(player1Div);

        // Spieler 2
        const player2Div = div.cloneNode(true);
        player2Div.onclick = () => selectCelebrity(index, player2Div, "player2");
        gridContainerPlayer2.appendChild(player2Div);
    });
}

function selectCelebrity(index, element, player) {
    // Überprüfen, ob das Bild bereits ausgegraut ist
    if (element.classList.contains('disabled')) {
        // Falls es bereits ausgegraut ist, aktiviere es
        element.classList.remove('disabled');
        if (player === "player1") {
            selectedCelebrityPlayer1 = null;
            document.getElementById("selection-info-player1").style.display = "none";
        } else {
            selectedCelebrityPlayer2 = null;
            document.getElementById("selection-info-player2").style.display = "none";
        }
    } else {
        // Wenn das Bild noch nicht ausgegraut ist, setze es als gewählt und graue es aus
        if (player === "player1") {
            if (selectedCelebrityPlayer1) {
                // Wenn bereits ein Bild gewählt ist, graue es aus
                const previousSelection = document.querySelector(`[data-name="${selectedCelebrityPlayer1}"]`).parentElement;
                previousSelection.classList.add('disabled');
            }
            selectedCelebrityPlayer1 = celebrities[index].name;
            document.getElementById("selected-name-player1").textContent = selectedCelebrityPlayer1;
            document.getElementById("selection-info-player1").style.display = "block";
        } else {
            if (selectedCelebrityPlayer2) {
                // Wenn bereits ein Bild gewählt ist, graue es aus
                const previousSelection = document.querySelector(`[data-name="${selectedCelebrityPlayer2}"]`).parentElement;
                previousSelection.classList.add('disabled');
            }
            selectedCelebrityPlayer2 = celebrities[index].name;
            document.getElementById("selected-name-player2").textContent = selectedCelebrityPlayer2;
            document.getElementById("selection-info-player2").style.display = "block";
        }
        element.classList.add('disabled');
    }
}

// Lade die Persönlichkeiten bei Seitenaufruf
window.onload = function() {
    loadCelebrities();
};
