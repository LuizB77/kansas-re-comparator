import { useState } from 'react'
import { fetchCensusData } from '../utils/censusApi'
import { fetchRentcastData } from '../utils/rentcastApi'
import { fetchAISummary } from '../utils/claudeApi'

export default function useComparison() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  async function compare(zipA, zipB) {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const [censusA, censusB, rentA, rentB] = await Promise.all([
        fetchCensusData(zipA),
        fetchCensusData(zipB),
        fetchRentcastData(zipA),
        fetchRentcastData(zipB),
      ])

      const locationA = { zip: zipA, ...censusA, ...rentA }
      const locationB = { zip: zipB, ...censusB, ...rentB }

      const aiSummary = await fetchAISummary(locationA, locationB)

      const next = { locationA, locationB, aiSummary }
      setData(next)
      return next
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
      setData(null)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, data, compare }
}
