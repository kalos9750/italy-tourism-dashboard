import { useCallback, useState } from 'react'
import ItalyMap from './components/ItalyMap'
import RegionDetail from './components/RegionDetail'
import regionsData from './data/regions2024.json'
import './App.css'

const COLORS = ['#dbeafe', '#93c5fd', '#3b82f6', '#1d4ed8', '#1e3a8a']
const LEGEND_LABELS = ['< 1,3 M', '1,3 – 3,5 M', '3,5 – 10 M', '10 – 27 M', '> 27 M']

const totalPresenze = regionsData.reduce((s, r) => s + r.totale, 0)
const totalStranieri = regionsData.reduce((s, r) => s + r.stranieri, 0)
const quotaStranieri = ((totalStranieri / totalPresenze) * 100).toFixed(1)
const topRegione = regionsData.reduce((best, r) => (r.totale > best.totale ? r : best))

const numFmt = new Intl.NumberFormat('it-IT', { notation: 'compact', maximumFractionDigits: 0 })

export default function App() {
  const [selectedRegion, setSelectedRegion] = useState(null)

  const handleRegionClick = useCallback(region => setSelectedRegion(region), [])
  const handleBack = useCallback(() => setSelectedRegion(null), [])

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">IT</div>
          <div>
            <h1>Turismo in Italia</h1>
            <p className="sidebar-subtitle">Presenze turistiche · ISTAT 2024</p>
          </div>
        </div>

        <section className="sidebar-section">
          <h2 className="section-label">Legenda — presenze totali</h2>
          <div className="legend">
            {COLORS.map((color, i) => (
              <div key={i} className="legend-item">
                <span className="legend-swatch" style={{ background: color }} />
                <span>{LEGEND_LABELS[i]}</span>
              </div>
            ))}
          </div>
        </section>

        {selectedRegion ? (
          <RegionDetail region={selectedRegion} onBack={handleBack} />
        ) : (
          <>
            <section className="sidebar-section">
              <h2 className="section-label">Statistiche nazionali</h2>
              <div className="stat-list">
                <div className="stat">
                  <span className="stat-label">Presenze totali</span>
                  <span className="stat-value">{numFmt.format(totalPresenze)}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Quota stranieri</span>
                  <span className="stat-value">{quotaStranieri}%</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Prima regione</span>
                  <span className="stat-value">{topRegione.regione}</span>
                </div>
              </div>
            </section>

            <section className="sidebar-section sidebar-hint">
              <p>Clicca su una regione per i dettagli.</p>
            </section>
          </>
        )}
      </aside>

      <main className="main-content">
        <ItalyMap onRegionClick={handleRegionClick} />
      </main>
    </div>
  )
}
