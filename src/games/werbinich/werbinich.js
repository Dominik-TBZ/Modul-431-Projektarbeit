// =============================================
// Wer bin ich? – Spiel-Logik (externes Skript)
// Features:
// • Zentrierung der Personenbilder
// • Buttons „Personen anzeigen“ je Spieler
// • Nach Abschluss aller Runden: Button „Ergebnisse anzeigen“
// =============================================

// -----------------------------
// Globale Variablen
// -----------------------------
let celebrities = [];
let players = []; // { name: string, celeb: { name, image } }
let currentPlayerIndex = 0;
let turnsCompleted = 0; // zählt, wie viele Spieler ihren Screen gesehen haben

// -----------------------------
// Persönlichkeiten laden
// -----------------------------
fetch('personalities.json')
    .then((r) => r.json())
    .then((data) => {
        celebrities = data.personalities;
    })
    .catch((err) => console.error('Fehler beim Laden der Persönlichkeiten:', err));

// -----------------------------
// Event-Handler für Setup-Schritte
// -----------------------------
document.getElementById('btn-player-count-next').addEventListener('click', () => {
    const count = parseInt(document.getElementById('player-count').value, 10);
    if (isNaN(count) || count < 2) {
        alert('Bitte mindestens zwei Personen angeben.');
        return;
    }
    buildNameInputs(count);
    switchStep('step-player-count', 'step-player-names');
});

document.getElementById('btn-names-next').addEventListener('click', () => {
    const inputs = document.querySelectorAll('.player-name-input');
    players = Array.from(inputs)
        .map((inp) => ({ name: inp.value.trim() }))
        .filter((p) => p.name !== '');

    if (players.length < 2) {
        alert('Bitte alle Namen ausfüllen.');
        return;
    }

    assignCelebrities();
    currentPlayerIndex = 0;
    turnsCompleted = 0;
    showCurrentPlayer();
    switchStep('step-player-names', 'step-show-player');
});

document.getElementById('btn-next-player').addEventListener('click', nextPlayer);

// -----------------------------
// Hilfsfunktionen – Setup
// -----------------------------
function buildNameInputs(count) {
    const form = document.getElementById('name-form');
    form.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const label = document.createElement('label');
        label.textContent = `Spieler ${i + 1}: `;

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Name von Spieler ${i + 1}`;
        input.className = 'player-name-input';
        input.required = true;

        form.appendChild(label);
        form.appendChild(input);
        form.appendChild(document.createElement('br'));
    }
}

function assignCelebrities() {
    // Mische Kopie der Persönlichkeiten und nimm so viele wie benötigt
    const shuffledCelebs = [...celebrities].sort(() => 0.5 - Math.random());

    players.forEach((player, idx) => {
        player.celeb = shuffledCelebs[idx % shuffledCelebs.length]; // falls mehr Spieler als Celebs
    });
}

// -----------------------------
// Hauptanzeige pro Spieler
// -----------------------------
function buildOthersGrid(container) {
    container.innerHTML = '';

    players.forEach((p, idx) => {
        if (idx === currentPlayerIndex) return; // eigenen Eintrag auslassen

        const div = document.createElement('div');
        div.className = 'grid-item';
        div.innerHTML = `
            <img src="img/${p.celeb.image}" alt="${p.celeb.name}">
            <span class="grid-caption">${p.name}: ${p.celeb.name}</span>
        `;
        container.appendChild(div);
    });
}

function showCurrentPlayer() {
    const player = players[currentPlayerIndex];
    document.getElementById('current-player-heading').textContent = `${player.name}!`;

    const container = document.getElementById('others-container');
    container.style.display = 'none'; // erst ausblenden
    container.style.justifyContent = 'center'; // Zentrierung der Items

    // Button zum Anzeigen der Personen (pro Spieler neu sichtbar machen)
    let showBtn = document.getElementById('btn-show-persons');
    if (!showBtn) {
        showBtn = document.createElement('button');
        showBtn.id = 'btn-show-persons';
        showBtn.className = 'show-persons-btn';
        showBtn.textContent = 'Personen anzeigen';
        document.getElementById('step-show-player').insertBefore(showBtn, container);
    }
    showBtn.style.display = 'inline-block';
    showBtn.onclick = () => {
        showBtn.style.display = 'none';
        buildOthersGrid(container);
        container.style.display = 'grid';
    };
}

// -----------------------------
// Weiter zum nächsten Spieler oder Ergebnisse
// -----------------------------
function nextPlayer() {
    turnsCompleted++;

    // Alle Spieler hatten ihren Zug → Ergebnisse-Phase
    if (turnsCompleted >= players.length) {
        showResultsIntro();
        return;
    }

    // Ansonsten nächster Spieler
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    showCurrentPlayer();
}

// -----------------------------
// Ergebnisse
// -----------------------------
function buildResultsGrid(container) {
    container.innerHTML = '';
    players.forEach((p) => {
        const div = document.createElement('div');
        div.className = 'grid-item';
        div.innerHTML = `
            <img src="img/${p.celeb.image}" alt="${p.celeb.name}">
            <span class="grid-caption">${p.name}: ${p.celeb.name}</span>
        `;
        container.appendChild(div);
    });
}

function showResultsIntro() {
    // Überschrift anpassen
    document.getElementById('current-player-heading').textContent = 'Ergebnisse';

    const container = document.getElementById('others-container');
    container.style.display = 'none';

    // vorhandene Buttons ausblenden
    const nextBtn = document.getElementById('btn-next-player');
    if (nextBtn) nextBtn.style.display = 'none';

    const showPersonsBtn = document.getElementById('btn-show-persons');
    if (showPersonsBtn) showPersonsBtn.style.display = 'none';

    // Button „Ergebnisse anzeigen“
    let resBtn = document.getElementById('btn-show-results');
    if (!resBtn) {
        resBtn = document.createElement('button');
        resBtn.id = 'btn-show-results';
        resBtn.className = 'show-persons-btn';
        resBtn.textContent = 'Ergebnisse anzeigen';
        document.getElementById('step-show-player').insertBefore(resBtn, container);
    }
    resBtn.style.display = 'inline-block';

    resBtn.onclick = () => {
        resBtn.style.display = 'none';
        buildResultsGrid(container);
        container.style.display = 'grid';
    };
}

// -----------------------------
// Anzeige-Wechsel (Setup‑Schritte)
// -----------------------------
function switchStep(hideId, showId) {
    document.getElementById(hideId).style.display = 'none';
    document.getElementById(showId).style.display = 'block';
}
