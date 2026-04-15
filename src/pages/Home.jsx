import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LocationInput from '../components/LocationInput'
import useComparison from '../hooks/useComparison'

const STORAGE_KEY = 'recentComparisons'

function loadRecentFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveRecentComparison(zipA, zipB) {
  const entry = { zipA, zipB, timestamp: Date.now() }
  const prev = loadRecentFromStorage()
  const filtered = prev.filter((e) => !(e.zipA === entry.zipA && e.zipB === entry.zipB))
  const next = [entry, ...filtered].slice(0, 5)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export default function Home() {
  const navigate = useNavigate()
  const { loading, error, compare } = useComparison()

  const [zipA, setZipA] = useState('')
  const [zipB, setZipB] = useState('')
  const [recent, setRecent] = useState([])

  useEffect(() => {
    setRecent(loadRecentFromStorage())
  }, [])

  useEffect(() => {
    document.title = 'Kansas RE Comparator'
  }, [])

  const isValid =
    zipA.length === 5 &&
    zipB.length === 5 &&
    /^\d+$/.test(zipA) &&
    /^\d+$/.test(zipB) &&
    zipA !== zipB

  const handleCompare = async (a = zipA, b = zipB) => {
    const result = await compare(a, b)
    if (result) {
      setRecent(saveRecentComparison(a, b))
      navigate('/results', { state: result })
    }
  }

  const handleClearRecent = () => {
    localStorage.removeItem(STORAGE_KEY)
    setRecent([])
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <section>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Compare Kansas Real Estate</h1>
        <p className="mb-8 text-gray-500">
          Enter two ZIP codes to get side-by-side market data, charts, a map, and an AI-powered
          summary.
        </p>
      </section>

      <section className="mb-8 rounded-2xl bg-white p-6 shadow-md">
        <LocationInput
          label="Location A"
          value={zipA}
          onChange={setZipA}
          disabled={loading}
        />
        <div className="mt-4">
          <LocationInput
            label="Location B"
            value={zipB}
            onChange={setZipB}
            disabled={loading}
          />
        </div>
        <button
          type="button"
          disabled={!isValid || loading}
          className={`mt-4 w-full rounded-lg bg-primary py-2 font-semibold text-white ${
            !isValid || loading ? 'cursor-not-allowed opacity-50' : ''
          }`}
          onClick={() => void handleCompare()}
        >
          {loading ? 'Comparing...' : 'Compare Locations'}
        </button>
        {error != null ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
      </section>

      {recent.length > 0 ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-800">Recent Comparisons</h2>
          <ul className="mb-2">
            {recent.slice(0, 5).map((item) => (
              <li
                key={`${item.zipA}-${item.zipB}-${item.timestamp}`}
                className="mb-2 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
              >
                <span className="font-medium text-gray-800">
                  {item.zipA} → {item.zipB}
                </span>
                <button
                  type="button"
                  className="text-sm font-medium text-primary hover:underline"
                  onClick={() => {
                    setZipA(item.zipA)
                    setZipB(item.zipB)
                    void handleCompare(item.zipA, item.zipB)
                  }}
                >
                  Compare Again
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="text-xs text-gray-400 hover:text-gray-600"
            onClick={handleClearRecent}
          >
            Clear
          </button>
        </section>
      ) : null}
    </div>
  )
}
