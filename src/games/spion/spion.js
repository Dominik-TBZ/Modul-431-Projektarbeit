let orte = [];

let spielerZahl = 0;
let spioneZahl = 0;
let spielerListe = [];
let aktuelleRolle = 0;
let zufallsOrt = "";

document.addEventListener("DOMContentLoaded", () => {
  // Orte aus JSON laden
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
});

function setupSpiel(e) {
  e.preventDefault();

  if (orte.length === 0) {
    alert("Orte sind noch nicht geladen, bitte warte einen Moment und versuche es erneut.");
    return;
  }

  spielerZahl = parseInt(document.getElementById('spielerAnzahl').value);
  spioneZahl = parseInt(document.getElementById('spionAnzahl').value);

  if (spioneZahl >= spielerZahl) {
    alert("Es müssen weniger Spione als Spieler sein.");
    return;
  }

  zufallsOrt = orte[Math.floor(Math.random() * orte.length)];

  // Rollen mischen
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

function zeigeSpielerTitel() {
  document.getElementById('spielerTitel').textContent = `Spieler ${aktuelleRolle + 1}, bitte Rolle aufdecken`;
  const rolleTextEl = document.getElementById('rolleText');
  rolleTextEl.textContent = 'Karte ist verdeckt, bitte auf „Rolle aufdecken“ tippen.';
  rolleTextEl.style.color = 'white';

  document.getElementById('naechsterSpieler').textContent =
    aktuelleRolle === spielerListe.length - 1 ? '🎬 Spiel starten' : '➡️ Nächster Spieler';

  document.getElementById('naechsterSpieler').style.display = 'none';
  document.getElementById('rolleAnzeigen').style.display = 'inline-block';
}

function rolleZeigen() {
  const rolle = spielerListe[aktuelleRolle];
  const text = rolle === "Spion" ? "🕵️ Du bist der SPION!" : `📍 Der Ort ist: ${rolle}`;
  const rolleTextEl = document.getElementById('rolleText');
  rolleTextEl.textContent = text;
  rolleTextEl.style.color = 'white';

  document.getElementById('rolleAnzeigen').style.display = 'none';
  document.getElementById('naechsterSpieler').style.display = 'inline-block';
}

function naechsterSpieler() {
  aktuelleRolle++;
  if (aktuelleRolle >= spielerListe.length) {
    document.getElementById('rollenAnzeige').style.display = 'none';
    document.getElementById('spielBeenden').style.display = 'inline-block';
  } else {
    zeigeSpielerTitel();
  }
}

function spielBeenden() {
  const btnBeenden = document.getElementById('spielBeenden');
  btnBeenden.style.display = 'none';

  const container = document.getElementById('spielStart');
  container.innerHTML = '';

  // Ort anzeigen
  const ortHeading = document.createElement('h2');
  ortHeading.textContent = `📍 Der Ort ist: ${zufallsOrt}`;
  ortHeading.style.color = 'white';
  container.appendChild(ortHeading);

  // Rollenliste
  const ul = document.createElement('ul');
  ul.style.color = 'white';

  for (let i = 0; i < spielerListe.length; i++) {
    const li = document.createElement('li');
    li.textContent = spielerListe[i] === "Spion"
      ? `Spieler ${i + 1}: 🕵️ Spion`
      : `Spieler ${i + 1}: 📍 Ort`;
    ul.appendChild(li);
  }

  container.appendChild(ul);

  // Zurück-Button am Ende
  const zurueckBtn = document.createElement('button');
  zurueckBtn.textContent = '⬅️ Zurück zur Startseite';
  zurueckBtn.className = 'link-box';
  zurueckBtn.style.marginTop = '30px';
  zurueckBtn.addEventListener('click', () => {
    window.location.href = '../../index.html'; // ggf. Pfad anpassen
  });

  container.appendChild(zurueckBtn);
  container.style.display = 'block';
}
