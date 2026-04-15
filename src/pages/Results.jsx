import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import MetricCard from '../components/MetricCard'
import AISummary from '../components/AISummary'
import ComparisonChart from '../components/ComparisonChart'
import MapView from '../components/MapView'
import {
  getBetterValue,
  formatCurrency,
  formatNumber,
  formatPercent,
} from '../utils/formatData'

const METRICS = [
  { key: 'medianSalePrice', label: 'Median Home Price', formatFn: formatCurrency },
  { key: 'medianRent', label: 'Median Rent/mo', formatFn: formatCurrency },
  { key: 'medianIncome', label: 'Median Income', formatFn: formatCurrency },
  { key: 'population', label: 'Population', formatFn: formatNumber },
  { key: 'unemploymentRate', label: 'Unemployment Rate', formatFn: formatPercent },
]

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state

  if (state == null) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="mb-4 text-gray-500">No comparison data found.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="font-medium text-primary hover:underline"
        >
          ← Go back home
        </button>
      </div>
    )
  }

  const { locationA, locationB, aiSummary, loading = false } = state

  useEffect(() => {
    if (locationA && locationB) {
      document.title = `ZIP ${locationA.zip} vs ${locationB.zip} | Kansas RE Comparator`
    }
  }, [locationA?.zip, locationB?.zip])

  const dateLabel = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mb-6 flex items-center gap-1 text-sm text-gray-500 hover:text-primary"
      >
        ← New Comparison
      </button>

      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          ZIP {locationA.zip} vs ZIP {locationB.zip}
        </h1>
        <span className="text-sm text-gray-500">{dateLabel}</span>
      </div>

      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100 mb-8 -mx-4 px-4">
        <nav className="flex gap-6 overflow-x-auto text-sm font-medium text-gray-500">
          {[
            { label: 'Overview', id: 'overview-section' },
            { label: 'Charts', id: 'charts-section' },
            { label: 'Map', id: 'map-section' },
            { label: 'AI Summary', id: 'ai-section' },
          ].map(({ label, id }) => (
            <button
              key={id}
              type="button"
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
              className="whitespace-nowrap py-3 hover:text-primary transition-colors"
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      <section id="overview-section">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Overview</h2>
        <div className="mb-2 grid grid-cols-2 gap-3">
          <div className="px-1 text-sm font-semibold text-gray-700">ZIP {locationA.zip}</div>
          <div className="px-1 text-sm font-semibold text-gray-700">ZIP {locationB.zip}</div>
        </div>
        {METRICS.map((metric) => (
          <div key={metric.key} className="mb-3 grid grid-cols-2 gap-3">
            <MetricCard
              label={metric.label}
              value={metric.formatFn(locationA[metric.key])}
              isBetter={
                getBetterValue(locationA[metric.key], locationB[metric.key], metric.key) === 'A'
              }
              loading={loading}
            />
            <MetricCard
              label={metric.label}
              value={metric.formatFn(locationB[metric.key])}
              isBetter={
                getBetterValue(locationA[metric.key], locationB[metric.key], metric.key) === 'B'
              }
              loading={loading}
            />
          </div>
        ))}
      </section>

      <div id="ai-section" className="mt-10">
        <AISummary summary={locationA && aiSummary} loading={loading} />
      </div>

      <div id="charts-section" className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Charts</h2>
        <ComparisonChart locationA={locationA} locationB={locationB} loading={loading} />
      </div>

      <div id="map-section" className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Map</h2>
        <MapView locationA={locationA} locationB={locationB} loading={loading} />
      </div>
    </div>
  )
}
