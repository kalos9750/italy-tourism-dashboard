import { useState } from 'react'
import regionsData from '../data/regions2024.json'

function formatMln(n) {
  return (
    (n / 1_000_000).toLocaleString('it-IT', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + ' Mln'
  )
}

const pctIt  = r => ((r.residenti / r.totale) * 100).toFixed(1)
const pctStr = r => ((r.stranieri / r.totale) * 100).toFixed(1)

function StatCol({ region, colorClass }) {
  const varPos = region.var2324 >= 0
  return (
    <div className={`rc-col ${colorClass}`}>
      <div className="rc-col-name" title={region.regione}>{region.regione}</div>
      <div className="rc-stat">
        <span>Presenze</span><strong>{formatMln(region.totale)}</strong>
      </div>
      <div className="rc-stat">
        <span>Italiani</span><strong>{pctIt(region)}%</strong>
      </div>
      <div className="rc-stat">
        <span>Stranieri</span><strong>{pctStr(region)}%</strong>
      </div>
      <div className={`rc-stat ${varPos ? 'pos' : 'neg'}`}>
        <span>Var. 23–24</span>
        <strong>{varPos ? '+' : ''}{region.var2324}%</strong>
      </div>
    </div>
  )
}

function BarRow({ label, value, width, fillClass }) {
  return (
    <div className="rc-bar-row">
      <span className="rc-bar-label" title={label}>{label}</span>
      <div className="rc-bar-track">
        <div className={`rc-bar-fill ${fillClass}`} style={{ width: `${width}%` }} />
      </div>
      <span className="rc-bar-value">{formatMln(value)}</span>
    </div>
  )
}

const DEFAULT_A = regionsData.find(r => r.regione === 'Veneto')    ?? regionsData[0]
const DEFAULT_B = regionsData.find(r => r.regione === 'Lombardia') ?? regionsData[1]

export default function RegionCompare() {
  const [regionA, setRegionA] = useState(DEFAULT_A)
  const [regionB, setRegionB] = useState(DEFAULT_B)

  const maxTotal = Math.max(regionA.totale, regionB.totale)
  const barWidthA = (regionA.totale / maxTotal) * 100
  const barWidthB = (regionB.totale / maxTotal) * 100
  const winner = regionA.totale >= regionB.totale ? regionA : regionB

  const handleSelect = setter => e => {
    const found = regionsData.find(r => r.regione === e.target.value)
    if (found) setter(found)
  }

  return (
    <div className="rc-panel">
      <div className="rc-selects">
        <select className="rc-select" value={regionA.regione} onChange={handleSelect(setRegionA)}>
          {regionsData.map(r => (
            <option key={r.regione} value={r.regione}>{r.regione}</option>
          ))}
        </select>
        <span className="rc-vs">vs</span>
        <select className="rc-select" value={regionB.regione} onChange={handleSelect(setRegionB)}>
          {regionsData.map(r => (
            <option key={r.regione} value={r.regione}>{r.regione}</option>
          ))}
        </select>
      </div>

      <div className="rc-grid">
        <StatCol region={regionA} colorClass="rc-col-a" />
        <div className="rc-divider" />
        <StatCol region={regionB} colorClass="rc-col-b" />
      </div>

      <div className="rc-bars">
        <BarRow label={regionA.regione} value={regionA.totale} width={barWidthA} fillClass="rc-fill-a" />
        <BarRow label={regionB.regione} value={regionB.totale} width={barWidthB} fillClass="rc-fill-b" />
      </div>

      <div className="rc-winner">
        📍 Regione con più presenze: <strong>{winner.regione}</strong>
      </div>
    </div>
  )
}
