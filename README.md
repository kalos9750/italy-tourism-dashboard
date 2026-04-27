# Italy Tourism Dashboard

Dashboard interattiva per l'analisi del turismo italiano, costruita con React + Vite. Visualizza dati ISTAT sulle presenze turistiche per regione, stagionalità mensile e classifica delle principali città.

## Getting Started

```bash
git clone https://github.com/kalos9750/italy-tourism-dashboard.git
cd italy-tourism-dashboard
npm install
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`.

## Features

### US-01 — Mappa choropleth interattiva
Mappa dell'Italia colorata in scala di blu in base alle presenze turistiche totali per regione (dati 2024). Tooltip al passaggio del cursore con presenze totali, quota italiani/stranieri e variazione 2023-24.

### US-02 — Pannello dettaglio regione
Click su una regione apre nel sidebar un pannello dedicato con: presenze totali formattate in Mln, quota sul totale nazionale, barra visiva italiani/stranieri, variazione percentuale 2023-24 con indicatore verde/rosso.

### US-03 — Grafico stagionalità mensile
Grafico a linee (Chart.js) con andamento mensile degli arrivi per gli anni 2011, 2012 e 2013. Asse X con nomi dei mesi in italiano, tooltip contestuale.

### US-04 — Filtro italiani / stranieri
Tre pulsanti toggle sopra il grafico — **Tutti**, **Italiani**, **Stranieri** — per filtrare le serie visualizzate in tempo reale.

### US-05 — Classifica top 15 città
Pannello nel sidebar sempre visibile con la graduatoria delle 15 città italiane per presenze. Ogni riga mostra rank, nome, barra proporzionale CSS, valore in Mln e quota percentuale nazionale.

### US-06 — Confronto side-by-side tra regioni
Pannello attivabile con il pulsante **Confronta regioni** sotto il grafico di stagionalità. Permette di scegliere due regioni tramite dropdown e ne affianca le statistiche principali (presenze, % italiani/stranieri, var%) con un grafico a barre CSS proporzionali e un'etichetta del vincitore.

## Tech Stack

| Libreria | Versione | Utilizzo |
|---|---|---|
| React | 19 | UI |
| Vite | 8 | Build tool |
| react-leaflet | 5 | Mappa interattiva |
| Leaflet | 1.9 | Engine cartografico |
| Chart.js | 4 | Grafico stagionalità |
| react-chartjs-2 | 5 | Wrapper React per Chart.js |

## Dataset

I dati utilizzati provengono dall'**ISTAT** (Istituto Nazionale di Statistica), rilasciati con licenza **CC BY 3.0 IT**.

- Fonte: [istat.it](https://www.istat.it)
- Dati di riferimento: presenze negli esercizi ricettivi, anno 2024
- Dati di stagionalità: arrivi mensili negli esercizi alberghieri ed extra-alberghieri, anni 2011-2013

## Project Structure

```
src/
├── components/
│   ├── ItalyMap.jsx        # Mappa choropleth Leaflet (US-01, US-02)
│   ├── RegionDetail.jsx    # Pannello dettaglio regione (US-02)
│   ├── SeasonChart.jsx     # Grafico stagionalità mensile (US-03, US-04)
│   ├── TopCities.jsx       # Classifica top 15 città (US-05)
│   └── RegionCompare.jsx   # Confronto side-by-side (US-06)
├── data/
│   ├── regions2024.json    # Presenze per regione, ISTAT 2024
│   ├── monthly.json        # Arrivi mensili 2011-2013
│   └── topCities.json      # Top 15 città per presenze
├── App.jsx                 # Layout principale, stato globale
├── App.css                 # Stili dashboard
├── main.jsx                # Entry point
└── index.css               # Reset e variabili CSS
```

## License

MIT
