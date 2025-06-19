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

- **Kein JSON ohne Server:**  
  Aufgrund von Einschränkungen bei lokalem Zugriff (z. B. ohne Python-Server) können keine `.json`-Dateien direkt im Browser eingelesen werden. Stattdessen werden notwendige Daten direkt im JavaScript als Array hinterlegt.

- **Design:**  
  Ein durchgängiges Design sorgt für Wiedererkennung. Alle Spiele verwenden:
  - dasselbe Hintergrundbild,
  - die gleiche Schriftart,
  - ähnliche UI-Elemente (Buttons, Farben, Layout).

---

## 🎮 Spiel-Dokumentation

### 🕵️ Spion

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

*(Noch nicht dokumentiert)*

---

### 🎭 Fake Fragen

*(Noch nicht dokumentiert)*

---

### 👾 Imposter

*(Noch nicht dokumentiert)*

---

### 🔢 Zahlensalat

*(Noch nicht dokumentiert)*

---
