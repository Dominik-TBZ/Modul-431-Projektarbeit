/* =======================================================
 * Zahlensalat – komplette Spiel-Logik
 * =======================================================
 * Features
 * • Spielername wird angezeigt
 * • Rating ist zunächst versteckt und wird per Button gezeigt
 * • Zwischenstand erscheint EINMAL (nach letztem Spieler) als
 *   Ausgangslage, dann direkt zu den Ergebnissen
 * ======================================================= */

/* ---------- Globale Variablen ---------- */
let categories        = [];           // Kategorien­liste aus JSON
let players           = [];           // { name, rating, word }
let commonRating      = 0;            // Rating für alle außer Impostor
let impostorRating    = 0;            // Abweichendes Rating
let impostorIndex     = -1;           // Index des Impostors im Array
let currentPlayerIndex = 0;
let wordsSubmitted     = 0;

/* ---------- Kategorien laden ---------- */
fetch('categories.json')
  .then(r => r.json())
  .then(d => categories = d.categories)
  .catch(err => console.error('Fehler beim Laden der Kategorien:', err));

/* ---------- Schritt 1: Spieleranzahl ---------- */
document.getElementById('btn-player-count-next')
        .addEventListener('click', () => {
  const count = parseInt(document.getElementById('player-count').value, 10);
  if (isNaN(count) || count < 2) {
    alert('Bitte mindestens zwei Personen angeben.');
    return;
  }
  buildNameInputs(count);
  switchStep('step-player-count', 'step-player-names');
});

/* ---------- Schritt 2: Namen eingeben ---------- */
document.getElementById('btn-names-next')
        .addEventListener('click', () => {
  const inputs = document.querySelectorAll('.player-name-input');
  players = Array.from(inputs)
           .map(inp => ({ name: inp.value.trim() }))
           .filter(p => p.name !== '');

  if (players.length < 2) {
    alert('Bitte alle Namen ausfüllen.');
    return;
  }

  startGame();
  switchStep('step-player-names', 'step-player-turn');
});

/* ---------- Schritt 3: Spieler gibt Begriff ab ---------- */
document.getElementById('btn-submit-word')
        .addEventListener('click', () => {
  const inp  = document.getElementById('player-word');
  const word = inp.value.trim();
  if (!word) {
    alert('Bitte einen Begriff eingeben.');
    return;
  }

  players[currentPlayerIndex].word = word;
  wordsSubmitted++;
  inp.value = '';

  if (wordsSubmitted >= players.length) {
    // Alle fertig → einmaliger Zwischenstand
    buildProgressGrid();
    switchStep('step-player-turn', 'step-progress');
  } else {
    // Nächster Spieler, KEIN Zwischenstand
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    showCurrentPlayer();
  }
});

/* ---------- Zwischenstand: Weiter ---------- */
document.getElementById('btn-continue')
        .addEventListener('click', () => {
  prepareResults();    // direkt zu den Ergebnissen
});

/* ---------- Button „Rating anzeigen“ ---------- */
const btnShowRating = document.getElementById('btn-show-rating');
btnShowRating.addEventListener('click', () => {
  document.getElementById('rating-heading').style.display = 'block';
  btnShowRating.style.display = 'none';
});

/* ---------- Neustart ---------- */
document.getElementById('btn-restart')
        .addEventListener('click', () => location.reload());

/* =======================================================
 * Hilfsfunktionen
 * ======================================================= */

function buildNameInputs(count) {
  const form = document.getElementById('name-form');
  form.innerHTML = '';
  for (let i = 0; i < count; i++) {
    form.insertAdjacentHTML('beforeend', `
      <label class="block-label">Spieler ${i + 1}:
        <input type="text"
               class="player-name-input"
               placeholder="Name von Spieler ${i + 1}"
               required />
      </label>
    `);
  }
}

function startGame() {
  /* Kategorie wählen */
  const category = categories[Math.floor(Math.random() * categories.length)];
  document.getElementById('category-heading').textContent = `Kategorie: ${category}`;

  /* Ratings bestimmen */
  commonRating = randomRating();
  do { impostorRating = randomRating(); } while (impostorRating === commonRating);
  impostorIndex = Math.floor(Math.random() * players.length);

  players.forEach((p, i) => {
    p.rating = (i === impostorIndex) ? impostorRating : commonRating;
    p.word   = '';  // Platzhalter
  });

  currentPlayerIndex = 0;
  wordsSubmitted     = 0;
  showCurrentPlayer();
}

const randomRating = () => Math.floor(Math.random() * 10) + 1;

function showCurrentPlayer() {
  const p = players[currentPlayerIndex];

  /* Spielername & Rating vorbereiten */
  document.getElementById('player-name-heading').textContent = `Du bist: ${p.name}`;
  document.getElementById('rating-heading').textContent       = `Dein Rating: ${p.rating}`;

  /* Rating verstecken, Button anzeigen */
  document.getElementById('rating-heading').style.display = 'none';
  btnShowRating.style.display                              = 'inline-block';

  document.getElementById('player-word').focus();
}

function buildProgressGrid() {
  const c = document.getElementById('progress-container');
  c.innerHTML = '';
  players.forEach(p => {
    c.insertAdjacentHTML('beforeend', `
      <div class="grid-item">
        <div class="player-name">${p.name}</div>
        <div>Begriff: ${p.word || '—'}</div>
      </div>
    `);
  });
}

function prepareResults() {
  const c = document.getElementById('results-container');
  c.innerHTML = '';
  players.forEach((p, i) => {
    c.insertAdjacentHTML('beforeend', `
      <div class="grid-item">
        <div class="player-name">${p.name}</div>
        <div>Rating: ${p.rating}</div>
        <div>Begriff: ${p.word}</div>
        ${i === impostorIndex
          ? '<div style="color:#d32f2f;font-weight:bold;">Impostor!</div>'
          : ''}
      </div>
    `);
  });

  document.getElementById('btn-restart').style.display = 'inline-block';
  switchStep('step-progress', 'step-results');
}

/* Utility: Schrittwechsel */
function switchStep(hideId, showId) {
  document.getElementById(hideId).style.display = 'none';
  document.getElementById(showId).style.display = 'block';
}
