import { useEffect, useState } from 'react'
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

const YEARS = ['2011', '2012', '2013']

function getAffollamento(checkInDate) {
  const monthNum = new Date(checkInDate).getMonth() + 1
  const monthlyAvgs = monthlyData.map(m => {
    const avg = YEARS.reduce((s, y) => s + m[y].totale, 0) / YEARS.length
    return { meseNum: m.meseNum, avg }
  })
  const annualAvg = monthlyAvgs.reduce((s, m) => s + m.avg, 0) / 12
  const { avg: monthAvg } = monthlyAvgs.find(m => m.meseNum === monthNum)
  const ratio = monthAvg / annualAvg
  if (ratio > 1.30) return { label: '🔴 Alta stagione',  color: '#dc2626' }
  if (ratio < 0.70) return { label: '🟢 Bassa stagione', color: '#16a34a' }
  return                   { label: '🟡 Media stagione', color: '#ca8a04' }
}

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

export default function TravelPlanner({ defaultRegion = '' }) {
  const [region, setRegion]   = useState(defaultRegion)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [budget, setBudget]   = useState(BUDGET_OPTS[1])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [hotels, setHotels]   = useState(null)
  const [affollamento, setAffollamento] = useState(null)

  const regions = regionsData.map(r => r.regione).sort()

  useEffect(() => {
    if (defaultRegion) setRegion(defaultRegion)
  }, [defaultRegion])

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
      // Booking.com grossPrice is the TOTAL stay price — divide by nights for per-night value
      const nights = Math.max(
        1,
        Math.round((new Date(checkOut) - new Date(checkIn)) / 86_400_000)
      )
      const filtered = all
        .map(h => {
          const total = h.property?.priceBreakdown?.grossPrice?.value ?? 0
          return { ...h, _perNight: total / nights }
        })
        .filter(h =>
          h._perNight >= budget.min &&
          (budget.max === Infinity || h._perNight <= budget.max)
        )
        .slice(0, 5)
      setHotels(filtered)
      setAffollamento(getAffollamento(checkIn))
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

      {loading && (
        <div className="tp-spinner-wrap">
          <div className="tp-spinner" />
          <span className="tp-spinner-label">Ricerca hotel in corso…</span>
        </div>
      )}

      {error && (
        <p className="tp-error">⚠ {error}</p>
      )}

      {!loading && hotels !== null && (
        <div className="tp-results">
          {affollamento && (
            <div className="tp-affollamento" style={{ color: affollamento.color }}>
              {affollamento.label}
            </div>
          )}
          {hotels.length === 0 ? (
            <p className="tp-empty">Nessun hotel trovato per questo budget. Prova un range diverso.</p>
          ) : (
            <div className="tp-hotel-list">
              {hotels.map((h, i) => {
                const prop  = h.property ?? {}
                const price = h._perNight
                const stars = Math.min(5, Math.max(0, Math.round(prop.propertyClass ?? 0)))
                const score = prop.reviewScore
                return (
                  <div key={prop.id ?? i} className="tp-hotel-card">
                    <span className="tp-hotel-name">{prop.name ?? '—'}</span>
                    <div className="tp-hotel-meta">
                      {stars > 0 && (
                        <span className="tp-hotel-stars">{'★'.repeat(stars)}</span>
                      )}
                      {score != null && (
                        <span className="tp-hotel-score">{score.toFixed(1)}</span>
                      )}
                      {price != null && (
                        <span className="tp-hotel-price">{Math.round(price)} €/notte</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
