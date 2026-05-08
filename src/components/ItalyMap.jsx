import { useCallback, useEffect, useRef, useState } from 'react'
import { MapContainer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import regionsData from '../data/regions2024.json'
import citiesData from '../data/citiesData.json'

const cityIcon = L.divIcon({
  className: 'city-marker-icon',
  html: '<div class="city-marker-dot"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -10],
})

const formatMln = n =>
  (n / 1_000_000).toLocaleString('it-IT', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }) + ' Mln'

const DEFAULT_CENTER = [41.8719, 12.5674]
const DEFAULT_ZOOM = 6
const REGION_ZOOM = 8

const citiesByRegion = Object.fromEntries(citiesData.map(r => [r.regione, r.cities]))

function MapController({ selectedRegion }) {
  const map = useMap()
  useEffect(() => {
    if (selectedRegion) {
      const cities = citiesByRegion[selectedRegion.regione]
      if (cities && cities.length > 0) {
        const lat = cities.reduce((s, c) => s + c.lat, 0) / cities.length
        const lng = cities.reduce((s, c) => s + c.lng, 0) / cities.length
        map.flyTo([lat, lng], REGION_ZOOM)
      }
    } else {
      map.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM)
    }
  }, [selectedRegion, map])
  return null
}

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

export default function ItalyMap({ onRegionClick, selectedRegion, onCityHotelSearch }) {
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
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      zoomControl
      scrollWheelZoom
      style={{ height: '100%', width: '100%', background: '#f1f5f9' }}
    >
      <MapController selectedRegion={selectedRegion} />
      {geoJson && (
        <GeoJSON
          key="italy-regions"
          data={geoJson}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      )}
      {selectedRegion &&
        (citiesByRegion[selectedRegion.regione] ?? []).map(city => (
          <Marker
            key={city.name}
            position={[city.lat, city.lng]}
            icon={cityIcon}
          >
            <Popup className="city-popup">
              <div className="cm-title">{city.name}</div>
              <div className="cm-row">
                <span>Presenze</span>
                <strong>{formatMln(city.presenze)}</strong>
              </div>
              <div className="cm-row">
                <span>Mese più affollato</span>
                <strong>{city.mese_top}</strong>
              </div>
              <div className="cm-bar-block">
                <div className="cm-bar">
                  <div
                    className="cm-bar-it"
                    style={{ width: `${city.pct_italiani}%` }}
                  />
                  <div className="cm-bar-str" />
                </div>
                <div className="cm-bar-pcts">
                  <span className="lbl-it">{city.pct_italiani}% IT</span>
                  <span className="lbl-str">{city.pct_stranieri}% STR</span>
                </div>
              </div>
              <button
                type="button"
                className="cm-hotel-btn"
                onClick={() => onCityHotelSearch?.(selectedRegion.regione)}
              >
                🏨 Cerca hotel qui
              </button>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  )
}
