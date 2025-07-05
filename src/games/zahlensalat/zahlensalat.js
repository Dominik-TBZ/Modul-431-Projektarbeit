/* Variables */
let categories        = [];
let players           = [];
let commonRating      = 0;
let impostorRating    = 0;
let impostorIndex     = -1;
let currentPlayerIndex = 0;
let wordsSubmitted     = 0;

/* Load categories */
fetch('categories.json')
  .then(r => r.json())
  .then(d => categories = d.categories)
  .catch(err => console.error('Fehler beim Laden der Kategorien:', err));

/* Player count */
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

/* Name input */
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

/* Submit word */
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
    buildProgressGrid();
    switchStep('step-player-turn', 'step-progress');
  } else {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    showCurrentPlayer();
  }
});

/* Continue button */
document.getElementById('btn-continue')
        .addEventListener('click', () => {
  prepareResults();
});

/* Show rating button */
const btnShowRating = document.getElementById('btn-show-rating');
btnShowRating.addEventListener('click', () => {
  document.getElementById('rating-heading').style.display = 'block';
  btnShowRating.style.display = 'none';
});

/* Restart button */
document.getElementById('btn-restart')
        .addEventListener('click', () => location.reload());

/* Build name inputs */
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

/* Start game */
function startGame() {
  const category = categories[Math.floor(Math.random() * categories.length)];
  document.getElementById('category-heading').textContent = `Kategorie: ${category}`;
  commonRating = randomRating();
  do { impostorRating = randomRating(); } while (impostorRating === commonRating);
  impostorIndex = Math.floor(Math.random() * players.length);

  players.forEach((p, i) => {
    p.rating = (i === impostorIndex) ? impostorRating : commonRating;
    p.word   = '';
  });

  currentPlayerIndex = 0;
  wordsSubmitted     = 0;
  showCurrentPlayer();
}

const randomRating = () => Math.floor(Math.random() * 10) + 1;

/* Show current player */
function showCurrentPlayer() {
  const p = players[currentPlayerIndex];
  document.getElementById('player-name-heading').textContent = `Du bist: ${p.name}`;
  document.getElementById('rating-heading').textContent       = `Dein Rating: ${p.rating}`;
  document.getElementById('rating-heading').style.display = 'none';
  btnShowRating.style.display                              = 'inline-block';

  document.getElementById('player-word').focus();
}

/* Build progress grid */
function buildProgressGrid() {
  const c = document.getElementById('progress-container');
  c.innerHTML = '';
  players.forEach(p => {
    c.insertAdjacentHTML('beforeend', `
      <div class="grid-item">
        <div class="player-name">${p.name}</div>
        <div>Begriff: ${p.word || '-'}</div>
      </div>
    `);
  });
}

/* Prepare results */
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
