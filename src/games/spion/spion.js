/* Variables */
let orte = [];

let spielerZahl = 0;
let spioneZahl = 0;
let spielerListe = [];
let aktuelleRolle = 0;
let zufallsOrt = "";

let spionenAnzahlIntern = null;

/* Initialize game */
document.addEventListener("DOMContentLoaded", () => {
  fetch('orte.json')
    .then(response => response.json())
    .then(data => {
      orte = data.orte;
    })
    .catch(err => {
      console.error("Fehler beim Laden der Orte:", err);
      alert("Fehler beim Laden der Orte. Bitte versuche es erneut.");
    });

  document.getElementById('setup-form').addEventListener('submit', setupSpiel);
  document.getElementById('rolleAnzeigen').addEventListener('click', rolleZeigen);
  document.getElementById('naechsterSpieler').addEventListener('click', naechsterSpieler);

  const btnBeenden = document.getElementById('spielBeenden');
  btnBeenden.classList.add('link-box'); // Styling wie zurück-Button
  btnBeenden.style.display = 'none';
  btnBeenden.addEventListener('click', spielBeenden);

  document.getElementById('zufallSpioneBtn').addEventListener('click', zufallsSpioneSetzen);
});

/* Set random spy count */
function zufallsSpioneSetzen() {
  const spielerInput = document.getElementById('spielerAnzahl');
  const spionInput = document.getElementById('spionAnzahl');

  const spielerWert = parseInt(spielerInput.value);

  if (isNaN(spielerWert) || spielerWert < 2) {
    alert("Bitte gib zuerst eine gültige Spieleranzahl (mind. 2) ein.");
    return;
  }

  const maxSpione = spielerWert - 1;
  spionenAnzahlIntern = Math.floor(Math.random() * maxSpione) + 1;

  spionInput.disabled = true;
  spionInput.type = 'text';
  spionInput.classList.add('disabled-input');

  setTimeout(() => {
    spionInput.value = 'x';
  }, 10);
}

/* Setup game */
function setupSpiel(e) {
  e.preventDefault();

  if (orte.length === 0) {
    alert("Orte sind noch nicht geladen, bitte warte einen Moment und versuche es erneut.");
    return;
  }

  spielerZahl = parseInt(document.getElementById('spielerAnzahl').value);

  const spionInput = document.getElementById('spionAnzahl');
  let spionWert;

  if (spionInput.value === 'x') {
    if (spionenAnzahlIntern === null) {
      alert("Bitte benutze den Zufallsbutton erneut oder gib eine Zahl ein.");
      return;
    }
    spionWert = spionenAnzahlIntern;
  } else {
    spionWert = parseInt(spionInput.value);

    if (isNaN(spionWert)) {
      alert("Bitte gib eine gültige Anzahl an Spionen ein.");
      return;
    }

    spionenAnzahlIntern = null;
  }

  if (spionWert < 1) {
    alert("Die Anzahl der Spione muss mindestens 1 sein.");
    return;
  }

  if (spionWert >= spielerZahl) {
    alert("Es müssen weniger Spione als Spieler sein.");
    return;
  }

  spioneZahl = spionWert;

  spionInput.type = 'number';
  spionInput.disabled = false;
  spionInput.classList.remove('disabled-input');

  zufallsOrt = orte[Math.floor(Math.random() * orte.length)];

  const rollen = [];
  for (let i = 0; i < spioneZahl; i++) rollen.push("Spion");
  for (let i = 0; i < spielerZahl - spioneZahl; i++) rollen.push(zufallsOrt);

  for (let i = rollen.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rollen[i], rollen[j]] = [rollen[j], rollen[i]];
  }

  spielerListe = rollen;
  aktuelleRolle = 0;

  document.getElementById('setup-form').style.display = 'none';
  document.getElementById('rollenAnzeige').style.display = 'block';

  zeigeSpielerTitel();
}

/* Show player title */
function zeigeSpielerTitel() {
  document.getElementById('spielerTitel').textContent = `Spieler ${aktuelleRolle + 1}, bitte Rolle aufdecken`;
  const rolleTextEl = document.getElementById('rolleText');
  rolleTextEl.textContent = 'Karte ist verdeckt, bitte auf „Rolle aufdecken“ tippen.';
  rolleTextEl.style.color = 'white';

  document.getElementById('naechsterSpieler').textContent =
    aktuelleRolle === spielerListe.length - 1 ? 'Spiel starten' : 'Nächster Spieler';

  document.getElementById('naechsterSpieler').style.display = 'none';
  document.getElementById('rolleAnzeigen').style.display = 'inline-block';
}

/* Show role */
function rolleZeigen() {
  const rolle = spielerListe[aktuelleRolle];
  const text = rolle === "Spion" ? "🕵️ Du bist der SPION!" : `📍 Der Ort ist: ${rolle}`;
  const rolleTextEl = document.getElementById('rolleText');
  rolleTextEl.textContent = text;
  rolleTextEl.style.color = 'white';

  document.getElementById('rolleAnzeigen').style.display = 'none';
  document.getElementById('naechsterSpieler').style.display = 'inline-block';
}

/* Next player */
function naechsterSpieler() {
  aktuelleRolle++;
  if (aktuelleRolle >= spielerListe.length) {
    document.getElementById('rollenAnzeige').style.display = 'none';
    document.getElementById('spielBeenden').style.display = 'inline-block';
  } else {
    zeigeSpielerTitel();
  }
}

/* End game */
function spielBeenden() {
  const btnBeenden = document.getElementById('spielBeenden');
  btnBeenden.style.display = 'none';

  const container = document.getElementById('spielStart');
  container.innerHTML = '';

  const ortHeading = document.createElement('h2');
  ortHeading.textContent = `Der Ort ist: ${zufallsOrt}`;
  ortHeading.style.color = 'white';
  container.appendChild(ortHeading);

  const ul = document.createElement('ul');
  ul.style.color = 'white';

  for (let i = 0; i < spielerListe.length; i++) {
    const li = document.createElement('li');
    li.textContent = spielerListe[i] === "Spion"
      ? `Spieler ${i + 1}: Spion`
      : `Spieler ${i + 1}: Ort`;
    ul.appendChild(li);
  }

  container.appendChild(ul);

  const zurueckBtn = document.createElement('button');
  zurueckBtn.textContent = 'Zurück zur Startseite';
  zurueckBtn.className = 'link-box';
  zurueckBtn.style.marginTop = '30px';
  zurueckBtn.addEventListener('click', () => {
    window.location.href = '../../index.html';
  });

  container.appendChild(zurueckBtn);
  container.style.display = 'block';
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
