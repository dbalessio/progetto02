# Istruzioni per Cursor AI (Eco-School Tracker)

**@Project Goal**
Costruire "Eco-School Tracker", una web app chiara e intuitiva per calcolare l'impronta di carbonio (CO2 equivalente) di un utente privato o di una scuola. Il calcolo si basa su 4 aree (Scope 1 Emissioni Dirette, Scope 2 Energia, Scope 3 Rifiuti, Scope 4 Trasporti). L'algoritmo finale deve calcolare un punteggio da 1 a 10 confrontando il totale delle emissioni con un benchmark di riferimento (es. media italiana di 5.000 kg/anno).

**@Tech Stack**
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)

**@Context & Users**
Il software ha uno scopo educativo e di sensibilizzazione ambientale. L'utente target è un "utente qualsiasi" (pubblico generico, studenti, famiglie, personale scolastico). Di conseguenza, l'interfaccia, i testi e i feedback devono essere estremamente accessibili, privi di gergo tecnico complesso e guidare l'utente passo dopo passo.

**@Design References**
- **Risorse Visive:** Fare rigoroso riferimento ai mockup e wireframe presenti nella cartella `Progetto Cursor\Layout` del progetto.
- **Stile:** Pulito, moderno, con palette cromatica "green" (verde, bianco, grigio chiaro).
- **Componenti UI richiesti:** Form organizzato in sezioni espandibili (accordion) per i 4 Scope, pulsante "Calcola" in grande evidenza, e una dashboard finale dei risultati con una progress bar colorata e un commento testuale educativo.

**@Architecture Rules**
Utilizzare una struttura di progetto Vanilla standard con separazione delle responsabilità:
- `index.html` nella root principale.
- `/css` per i fogli di stile personalizzati.
- `/js` per la logica. Separare la logica in moduli se possibile (es. `calculator.js` per gli algoritmi e i fattori di conversione, `app.js` o `ui.js` per la manipolazione del DOM e gli eventi).
- `/assets` (o la cartella Layout indicata) per immagini e icone.

**@Coding Standards**
- **Bootstrap:** Utilizzare Bootstrap (via CDN) come framework CSS principale per il layout a griglia, la responsività, gli accordion (per i 4 Scope) e le progress bar dei risultati.
- **Fattori di Conversione (Hardcoded in JS):** L'algoritmo JS deve utilizzare rigorosamente i seguenti fattori:
  - Gas Metano: 2.02 kg CO2 / mc
  - Energia Elettrica (Mix Nazionale): 0.28 kg CO2 / kWh
  - Energia Rinnovabile: 0 kg CO2 / kWh
  - Auto (Media): 0.