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

- 🗺️ **US-01** — Interactive choropleth map of Italy showing tourist presences by region (ISTAT 2024 data)
- 📍 **US-02** — Region detail panel on click (total presences, Italian vs foreign split, YoY variation 2023-24)
- 📊 **US-03** — Monthly seasonality line chart of tourist arrivals (2011-2013)
- 🔍 **US-04** — Filter toggle on the monthly chart: All / Italians / Foreigners
- 🏆 **US-05** — Top 15 Italian cities ranked by tourist presences
- ⚖️ **US-06** — Side-by-side comparison between two regions
- 🧭 **US-07** — Travel Planner with real hotel prices from Booking.com API (via RapidAPI)
- 🔎 **US-10** — Region zoom with markers for the top 2 cities and their tourism data popups
- 🏨 **US-10b** — "Find hotels here" button in city popup that opens the Travel Planner pre-filled with the selected region

## Environment Variables

Create a `.env.local` file in the root directory:

```
VITE_RAPIDAPI_KEY=your_rapidapi_key_here
```

Get your free API key at [RapidAPI — Booking COM](https://rapidapi.com/DataCrawler/api/booking-com15)

## Tech Stack

| Libreria | Versione | Utilizzo |
|----------|----------|----------|
| React | 19 | UI |
| Vite | 8 | Build tool |
| react-leaflet | 5 | Mappa interattiva |
| Leaflet | 1.9 | Engine cartografico |
| Chart.js | 4 | Grafico stagionalità |
| react-chartjs-2 | 5 | Wrapper React per Chart.js |

## Dataset

The data used comes from ISTAT (National Institute of Statistics), released under the CC BY 3.0 IT license.

- Source: istat.it
- Reference data: number of guests in accommodation establishments, year 2024
- Seasonality data: monthly arrivals in hotels and other accommodation establishments, years 2011-2013
- citiesData.json — Top 2 cities per region with coordinates and tourism data

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
