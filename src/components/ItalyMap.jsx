import { useCallback, useEffect, useRef, useState } from 'react'
import { MapContainer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import regionsData from '../data/regions2024.json'

const GEOJSON_URL =
  'https://raw.githubusercontent.com/openpolis/geojson-italy/master/geojson/limits_IT_regions.geojson'

const dataByRegion = Object.fromEntries(regionsData.map(r => [r.regione, r]))

const totals = regionsData.map(r => r.totale)
const LOG_MIN = Math.log(Math.min(...totals))
const LOG_MAX = Math.log(Math.max(...totals))

// 5-step sequential blue scale (light → dark)
const COLORS = ['#dbeafe', '#93c5fd', '#3b82f6', '#1d4ed8', '#1e3a8a']

function getColor(totale) {
  const t = (Math.log(totale) - LOG_MIN) / (LOG_MAX - LOG_MIN)
  return COLORS[Math.min(Math.floor(t * COLORS.length), COLORS.length - 1)]
}

// Normalise GeoJSON region names to match our dataset
function normalizeName(name) {
  if (!name) return ''
  if (name.startsWith("Valle d'Aosta") || name.includes("Vallée")) return "Valle d'Aosta"
  if (name.startsWith('Trentino')) return 'Trentino-Alto Adige'
  return name
}

const numFmt = new Intl.NumberFormat('it-IT')

function styleFeature(feature) {
  const region = dataByRegion[normalizeName(feature.properties.reg_name)]
  return {
    fillColor: region ? getColor(region.totale) : '#e2e8f0',
    fillOpacity: 0.85,
    color: '#ffffff',
    weight: 1.5,
  }
}

// clickRef lets the handler always call the latest onRegionClick without
// remounting the GeoJSON layer when the prop reference changes.
function makeOnEachFeature(clickRef) {
  return function onEachFeature(feature, layer) {
    const name = normalizeName(feature.properties.reg_name)
    const region = dataByRegion[name]
    if (!region) return

    const pctIt = ((region.residenti / region.totale) * 100).toFixed(1)
    const pctStr = ((region.stranieri / region.totale) * 100).toFixed(1)
    const varSign = region.var2324 >= 0 ? '+' : ''
    const varClass = region.var2324 >= 0 ? 'pos' : 'neg'

    layer.bindTooltip(
      `<div class="map-tooltip">
        <div class="tt-title">${region.regione}</div>
        <div class="tt-row"><span>Presenze totali</span><span>${numFmt.format(region.totale)}</span></div>
        <div class="tt-row"><span>Italiani</span><span>${pctIt}%</span></div>
        <div class="tt-row"><span>Stranieri</span><span>${pctStr}%</span></div>
        <div class="tt-row tt-var ${varClass}"><span>Var. 2023–24</span><span>${varSign}${region.var2324}%</span></div>
      </div>`,
      { className: 'tooltip-dark', sticky: true, opacity: 1 }
    )

    layer.on({
      mouseover(e) {
        e.target.setStyle({ fillOpacity: 1, weight: 2.5, color: '#93c5fd' })
        e.target.bringToFront()
      },
      mouseout(e) {
        e.target.setStyle({
          fillOpacity: 0.85,
          weight: 1.5,
          color: '#ffffff',
          fillColor: getColor(region.totale),
        })
      },
      click() {
        clickRef.current?.(region)
      },
    })
  }
}

export default function ItalyMap({ onRegionClick }) {
  const [geoJson, setGeoJson] = useState(null)
  const clickRef = useRef(onRegionClick)

  useEffect(() => {
    clickRef.current = onRegionClick
  }, [onRegionClick])

  const onEachFeature = useCallback(makeOnEachFeature(clickRef), [])

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then(r => r.json())
      .then(setGeoJson)
      .catch(console.error)
  }, [])

  return (
    <MapContainer
      center={[42.2, 12.5]}
      zoom={6}
      zoomControl
      scrollWheelZoom
      style={{ height: '100%', width: '100%', background: '#f1f5f9' }}
    >
      {geoJson && (
        <GeoJSON
          key="italy-regions"
          data={geoJson}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  )
}
