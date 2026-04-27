import citiesData from '../data/topCities.json'

const MAX_PRESENZE = citiesData[0].presenze // Roma — largest value, drives bar scale

function formatMln(n) {
  return (
    (n / 1_000_000).toLocaleString('it-IT', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + ' Mln'
  )
}

export default function TopCities() {
  return (
    <section className="sidebar-section tc-section">
      <h2 className="section-label">Top 15 città</h2>
      <div className="tc-list">
        {citiesData.map(city => (
          <div key={city.rank} className="tc-row">
            <div className="tc-meta">
              <span className="tc-rank">{String(city.rank).padStart(2, '0')}</span>
              <span className="tc-name" title={city.citta}>{city.citta}</span>
            </div>
            <div className="tc-bar-track">
              <div
                className="tc-bar-fill"
                style={{ width: `${(city.presenze / MAX_PRESENZE) * 100}%` }}
              />
            </div>
            <div className="tc-stats">
              <span>{formatMln(city.presenze)}</span>
              <span className="tc-pct">{city.percentuale}%</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
