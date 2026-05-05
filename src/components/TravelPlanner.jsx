import { useState } from 'react'
import regionsData from '../data/regions2024.json'
import monthlyData from '../data/monthly.json'

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

const RAPIDAPI_HOST = 'booking-com15.p.rapidapi.com'

async function fetchDestId(city) {
  const res = await fetch(
    `https://${RAPIDAPI_HOST}/api/v1/hotels/searchDestination?query=${encodeURIComponent(city)}`,
    {
      headers: {
        'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
    }
  )
  const json = await res.json()
  const dest_id = json.data?.[0]?.dest_id
  if (!dest_id) throw new Error('Destinazione non trovata')
  return dest_id
}

async function fetchHotels(dest_id, checkIn, checkOut) {
  const res = await fetch(
    `https://${RAPIDAPI_HOST}/api/v1/hotels/searchHotels?dest_id=${dest_id}&search_type=CITY&arrival_date=${checkIn}&departure_date=${checkOut}&adults=2&room_qty=1&units=metric&currency_code=EUR`,
    {
      headers: {
        'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
    }
  )
  const json = await res.json()
  return json.data?.hotels ?? []
}

export default function TravelPlanner() {
  const [region, setRegion]   = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [budget, setBudget]   = useState(BUDGET_OPTS[1])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [hotels, setHotels]   = useState(null)
  const [affollamento, setAffollamento] = useState(null)

  const regions = regionsData.map(r => r.regione).sort()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setHotels(null)
    setAffollamento(null)
    try {
      const city = CITY_MAP[region]
      const dest_id = await fetchDestId(city)
      const all = await fetchHotels(dest_id, checkIn, checkOut)
      const filtered = all
        .filter(h => {
          const price = h.property?.priceBreakdown?.grossPrice?.value ?? 0
          return price >= budget.min && (budget.max === Infinity || price <= budget.max)
        })
        .slice(0, 5)
      setHotels(filtered)
    } catch (err) {
      setError(err.message || 'Errore durante la ricerca. Riprova.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tp-container">
      <div className="tp-header">
        <h2 className="tp-title">Pianifica il tuo viaggio in Italia</h2>
      </div>
      <form className="tp-form" onSubmit={handleSubmit}>
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
          disabled={!region || !checkIn || !checkOut || loading}
        >
          Cerca hotel
        </button>
      </form>
    </div>
  )
}
