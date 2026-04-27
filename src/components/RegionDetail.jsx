import regionsData from '../data/regions2024.json'

const totalNazionale = regionsData.reduce((s, r) => s + r.totale, 0)

function formatMln(n) {
  return (
    (n / 1_000_000).toLocaleString('it-IT', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + ' Mln'
  )
}

export default function RegionDetail({ region, onBack }) {
  const pctIt = (region.residenti / region.totale) * 100
  const pctStr = (region.stranieri / region.totale) * 100
  const quotaNaz = ((region.totale / totalNazionale) * 100).toFixed(1)
  const varUp = region.var2324 >= 0
  const varSign = varUp ? '+' : ''

  return (
    <div className="region-detail">
      <button className="back-btn" onClick={onBack}>
        ← Torna alla mappa
      </button>

      <div className="rd-name">{region.regione}</div>
      <div className="rd-totale">{formatMln(region.totale)}</div>
      <div className="rd-quota">
        presenze totali &middot; {quotaNaz}% del totale nazionale
      </div>

      <div className="rd-bar-block">
        <div className="rd-bar-header">
          <span className="rd-bar-lbl lbl-it">Italiani</span>
          <span className="rd-bar-lbl lbl-str">Stranieri</span>
        </div>
        <div className="rd-bar">
          <div className="rd-bar-it" style={{ width: `${pctIt}%` }} />
          <div className="rd-bar-str" style={{ width: `${pctStr}%` }} />
        </div>
        <div className="rd-bar-pcts">
          <span>{pctIt.toFixed(1)}%</span>
          <span>{pctStr.toFixed(1)}%</span>
        </div>
      </div>

      <div className={`rd-var ${varUp ? 'pos' : 'neg'}`}>
        <span className="rd-var-arrow">{varUp ? '↑' : '↓'}</span>
        <span className="rd-var-value">
          {varSign}{region.var2324}%
        </span>
        <span className="rd-var-label">variazione 2023–24</span>
      </div>
    </div>
  )
}
