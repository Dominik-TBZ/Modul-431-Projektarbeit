# 📄 Dokumentation – **Play.TBZ**

## 📁 Ordnerstruktur

- **`doc/`**  
  Enthält die Dokumentation der gesamten Website (diese Datei).

- **`src/`**  
  Hauptordner mit allen Spieldateien und der Hauptwebsite.
  
  - **`index.html`**  
    Einstiegspunkt zur Spielauswahl (Startseite).
  
  - **`img/`**  
    Einheitliches Hintergrundbild und weitere Bildressourcen.

  - **`games/`**  
    Enthält alle Spiele, jeweils in einem eigenen Unterordner:
    - `spion/`
    - `wer-bin-ich/`
    - `fake-fragen/`
    - `imposter/`
    - `zahlensalat/`
    
    Jedes Spiel beinhaltet:
    - `index.html`
    - `style.css`
    - `script.js`

---

## ⚙️ Generelles

- **JSON verwenden:**  
  - vorgegebene Daten werden in einem Json File gespeichert und in die JavaScript Datei eingelesen.

- **Design:**  
  Ein durchgängiges Design sorgt für Wiedererkennung. Alle Spiele verwenden:
  - dasselbe Hintergrundbild,
  - die gleiche Schriftart,
  - ähnliche UI-Elemente (Buttons, Farben, Layout).

- **Navigaion:**  
  - Bei jedem Spiel gibt es oben rechts eine Spielanleitung, welche man zu jeder Zeit aufklappen (und wieder einklappen) kann.
  - Bei jedem Spiel kommt man durch den zurück Button zur Startseite.

- **Copyright:**  
  - Jede HTML Website hat zu jederzeit das Copyright "play-tbz" im fotter sichtbar.

---

## 🎮 Spiel-Dokumentation

### 🕵️ Spion
**Author:** Dominik

- **Spielidee:**  
  Die Spieler erhalten geheime Rollen. Einer ist der Spion, alle anderen kennen den Ort. Der Spion muss herausfinden, wo sich die anderen befinden – ohne aufzufliegen.

- **Features:**
  - Zufälliger Ort aus fester Liste
  - Zufällige Rollenzuteilung
  - Spieler decken ihre Rollen nacheinander auf
  - Auflösung am Ende mit Ort & Rollenübersicht
  - Zurück-Button zur Hauptseite

---

### ❓ Wer bin Ich
**Author:** Len

*(Noch nicht dokumentiert)*

---

### 🎭 Fake Fragen
**Author:** Len

*(Noch nicht dokumentiert)*

---

### 👾 Imposter
**Author:** Len

*(Noch nicht dokumentiert)*

---

### 🔢 Zahlensalat
**Author:** Len

*(Noch nicht dokumentiert)*

---
