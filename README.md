# Italy Tourism Dashboard

Interactive dashboard for analyzing Italian tourism, built with React + Vite. View ISTAT data on tourist presence by region, monthly seasonality, and ranking of major cities.
## Getting Started

```bash
git clone https://github.com/kalos9750/italy-tourism-dashboard.git
cd italy-tourism-dashboard
npm install
npm run dev
```

The application will be available on `http://localhost:5173`.

## Features

### US-01 — Mappa choropleth interattiva
Map of Italy colored in blue based on total tourist presences by region (2024 data). Hover tooltip showing total presences, Italian/foreigner ratio, and 2023-24 variation.

### US-02 — Region detail panel
Clicking on a region opens a dedicated panel in the sidebar with: total presences formatted in millions, share of the national total, visual bar Italians/foreigners, percentage change 2023-24 with green/red indicator.

### US-03 — Grafico stagionalità mensile
Line chart (Chart.js) with monthly arrival trends for the years 2011, 2012 and 2013. X-axis with month names in Italian, contextual tooltip.

### US-04 — Italian/Foreign Filter
Three toggle buttons above the chart — **All**, **Italians**, **Foreigners** — to filter the series displayed in real time.

### US-05 — Top 15 Cities Ranking
Always visible sidebar panel with the ranking of the 15 Italian cities by attendance. Each row displays rank, name, CSS proportional bar, value in millions, and national percentage share.

### US-06 — Side-by-side comparison between regions
This panel can be activated by clicking the **Compare regions** button below the seasonality graph. It allows you to select two regions via a dropdown menu and displays their key statistics (visits, % Italian/foreign, % change) alongside a proportional CSS bar chart and a winner label.
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

The data used comes from **ISTAT** (National Institute of Statistics), released under the **CC BY 3.0 IT** license.

- Source: [istat.it](https://www.istat.it)
- Reference data: number of guests in accommodation establishments, year 2024
- Seasonality data: monthly arrivals in hotels and other accommodation establishments, years 2011-2013
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
