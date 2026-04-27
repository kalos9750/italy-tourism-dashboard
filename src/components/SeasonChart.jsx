import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import monthlyData from '../data/monthly.json'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

const labels = monthlyData.map(m => m.mese)

const YEARS = [
  { key: '2011', color: '#3b82f6', fill: 'rgba(59,130,246,0.08)' },
  { key: '2012', color: '#10b981', fill: 'rgba(16,185,129,0.08)' },
  { key: '2013', color: '#f97316', fill: 'rgba(249,115,22,0.08)' },
]

function getValue(monthEntry, yearKey, filter) {
  const y = monthEntry[yearKey]
  if (filter === 'italiani') return y.italianiAlb + y.italianiExtra
  if (filter === 'stranieri') return y.stranieriAlb + y.stranieriExtra
  return y.totale
}

function buildData(filter) {
  return {
    labels,
    datasets: YEARS.map(({ key, color, fill }) => ({
      label: key,
      data: monthlyData.map(m => getValue(m, key, filter)),
      borderColor: color,
      backgroundColor: fill,
      pointBackgroundColor: color,
      pointRadius: 3,
      pointHoverRadius: 5,
      borderWidth: 2,
      tension: 0.35,
      fill: false,
    })),
  }
}

const numFmt = new Intl.NumberFormat('it-IT')

const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        boxWidth: 12,
        boxHeight: 2,
        padding: 16,
        font: { size: 12 },
        color: '#475569',
      },
    },
    tooltip: {
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      borderWidth: 1,
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8',
      padding: 10,
      callbacks: {
        label: ctx => ` ${ctx.dataset.label}: ${numFmt.format(ctx.parsed.y)} arrivi`,
      },
    },
  },
  scales: {
    x: {
      grid: { color: '#e2e8f0' },
      ticks: {
        color: '#64748b',
        font: { size: 11 },
        maxRotation: 0,
      },
      border: { color: '#e2e8f0' },
    },
    y: {
      grid: { color: '#e2e8f0' },
      ticks: {
        color: '#64748b',
        font: { size: 11 },
        callback: v => `${(v / 1000).toLocaleString('it-IT')}k`,
      },
      border: { color: '#e2e8f0', dash: [4, 4] },
    },
  },
}

export default function SeasonChart({ filter = 'totale' }) {
  return <Line data={buildData(filter)} options={options} />
}
