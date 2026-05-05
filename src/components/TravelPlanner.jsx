import { useState } from 'react'
import regionsData from '../data/regions2024.json'

const CITY_MAP = {
  'Veneto': 'Venezia',
  'Lazio': 'Roma',
  'Toscana': 'Firenze',
  'Lombardia': 'Milano',
  'Campania': 'Napoli',
  'Sicilia': 'Palermo',
  'Sardegna': 'Cagliari',
  'Piemonte': 'Torino',
  'Emilia-Romagna': 'Bologna',
  'Liguria': 'Genova',
  'Puglia': 'Bari',
  'Calabria': 'Reggio Calabria',
  'Abruzzo': "L'Aquila",
  'Marche': 'Ancona',
  'Umbria': 'Perugia',
  'Trentino-Alto Adige': 'Trento',
  'Friuli-Venezia Giulia': 'Trieste',
  "Valle d'Aosta": 'Aosta',
  'Basilicata': 'Potenza',
  'Molise': 'Campobasso',
}

const BUDGET_OPTS = [
  { label: '€0-50',    min: 0,   max: 50 },
  { label: '€50-100',  min: 50,  max: 100 },
  { label: '€100-200', min: 100, max: 200 },
  { label: '€200+',    min: 200, max: Infinity },
]

export default function TravelPlanner() {
  const [region, setRegion]   = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [budget, setBudget]   = useState(BUDGET_OPTS[1])

  const regions = regionsData.map(r => r.regione).sort()

  return (
    <div className="tp-container">
      <div className="tp-header">
        <h2 className="tp-title">Pianifica il tuo viaggio in Italia</h2>
      </div>
      <form className="tp-form" onSubmit={e => e.preventDefault()}>
        <div className="tp-field">
          <label className="tp-label">Regione</label>
          <select
            className="tp-select"
            value={region}
            onChange={e => setRegion(e.target.value)}
            required
          >
            <option value="">Seleziona una regione</option>
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="tp-field">
          <label className="tp-label">Check-in</label>
          <input
            className="tp-input"
            type="date"
            value={checkIn}
            onChange={e => setCheckIn(e.target.value)}
            required
          />
        </div>

        <div className="tp-field">
          <label className="tp-label">Check-out</label>
          <input
            className="tp-input"
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={e => setCheckOut(e.target.value)}
            required
          />
        </div>

        <div className="tp-field">
          <label className="tp-label">Budget per notte</label>
          <div className="tp-budget-group">
            {BUDGET_OPTS.map(opt => (
              <button
                key={opt.label}
                type="button"
                className={`filter-btn${budget.label === opt.label ? ' active' : ''}`}
                onClick={() => setBudget(opt)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="tp-submit"
          disabled={!region || !checkIn || !checkOut}
        >
          Cerca hotel
        </button>
      </form>
    </div>
  )
}
