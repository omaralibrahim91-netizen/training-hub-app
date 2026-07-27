# NPL — Training Hub (app pubblicata)

Questo repo **pubblico** contiene solo il codice dell'app, servito via GitHub Pages. **Nessun dato personale**: gli allenamenti vivono nel browser del telefono e i backup vanno nel repo privato `training-hub` tramite la funzione integrata (il token non è mai incluso nei file).

- `index.html` — l'app (single file)
- `sw.js` — service worker: offline + aggiornamento automatico

## Aggiornare l'app

Carica il nuovo `index.html` (Add file → Upload files). Il telefono riceve la nuova versione da solo alla prima apertura con rete: niente da reinstallare.

## Installazione su iPhone

Apri l'URL Pages in Safari → Condividi → **Aggiungi alla schermata Home**. Poi, nell'app: Loads & data → GitHub backup → repo privato + token → **Restore from GitHub** per riportare i dati.
