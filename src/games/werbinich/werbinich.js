/* Variables */
let celebrities = [];
let players = [];
let currentPlayerIndex = 0;
let turnsCompleted = 0;

/* Load personalities */
fetch('personalities.json')
    .then((r) => r.json())
    .then((data) => {
        celebrities = data.personalities;
    })
    .catch((err) => console.error('Fehler beim Laden der Persönlichkeiten:', err));

/* Event handlers */
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

/* Build name inputs */
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

/* Assign celebrities */
function assignCelebrities() {
    const shuffledCelebs = [...celebrities].sort(() => 0.5 - Math.random());

    players.forEach((player, idx) => {
        player.celeb = shuffledCelebs[idx % shuffledCelebs.length];
    });
}

/* Build others grid */
function buildOthersGrid(container) {
    container.innerHTML = '';

    players.forEach((p, idx) => {
        if (idx === currentPlayerIndex) return;

        const div = document.createElement('div');
        div.className = 'grid-item';
        div.innerHTML = `
            <img src="img/${p.celeb.image}" alt="${p.celeb.name}">
            <span class="grid-caption">${p.name}: ${p.celeb.name}</span>
        `;
        container.appendChild(div);
    });
}

/* Show current player */
function showCurrentPlayer() {
    const player = players[currentPlayerIndex];
    document.getElementById('current-player-heading').textContent = `${player.name}!`;

    const container = document.getElementById('others-container');
    container.style.display = 'none';
    container.style.justifyContent = 'center';
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

/* Next player */
function nextPlayer() {
    turnsCompleted++;

    if (turnsCompleted >= players.length) {
        showResultsIntro();
        return;
    }
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    showCurrentPlayer();
}

/* Build results grid */
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

/* Show results intro */
function showResultsIntro() {
    document.getElementById('current-player-heading').textContent = 'Ergebnisse';

    const container = document.getElementById('others-container');
    container.style.display = 'none';

    const nextBtn = document.getElementById('btn-next-player');
    if (nextBtn) nextBtn.style.display = 'none';

    const showPersonsBtn = document.getElementById('btn-show-persons');
    if (showPersonsBtn) showPersonsBtn.style.display = 'none';

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

/* Switch step */
function switchStep(hideId, showId) {
    document.getElementById(hideId).style.display = 'none';
    document.getElementById(showId).style.display = 'block';
}

/* Help modal */
document.addEventListener('DOMContentLoaded', () => {
  const btn   = document.getElementById('helpBtn');
  const modal = document.getElementById('helpModal');
  const close = document.getElementById('helpClose');

  if(btn && modal && close){
    btn.addEventListener('click', () => modal.style.display = 'flex');
    close.addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', e => { if(e.target === modal) modal.style.display = 'none'; });
  }
});
