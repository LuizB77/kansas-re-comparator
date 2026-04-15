const CENSUS_BASE = 'https://api.census.gov/data/2022/acs/acs5'

function parseCensusNumber(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return null
  // Census uses large negative sentinels for N/A
  if (n < 0) return null
  return n
}

export async function fetchCensusData(zip) {
  const zipStr = String(zip).padStart(5, '0')
  const vars = 'B01003_001E,B19013_001E,B23025_005E,B23025_002E'
  const url = `${CENSUS_BASE}?get=${vars}&for=zip+code+tabulation+area:${zipStr}`

  try {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(res.statusText || `HTTP ${res.status}`)
    }
    const data = await res.json()
    if (!Array.isArray(data) || data.length < 2) {
      throw new Error('Unexpected response shape')
    }
    const headers = data[0]
    const row = data[1]
    if (!Array.isArray(headers) || !Array.isArray(row)) {
      throw new Error('Unexpected response shape')
    }

    const idx = (name) => headers.indexOf(name)
    const pop = parseCensusNumber(row[idx('B01003_001E')])
    const income = parseCensusNumber(row[idx('B19013_001E')])
    const unemployed = parseCensusNumber(row[idx('B23025_005E')])
    const laborForce = parseCensusNumber(row[idx('B23025_002E')])

    if (pop === null || income === null || unemployed === null || laborForce === null) {
      throw new Error('Missing or invalid census values')
    }

    let unemploymentRate = 0
    if (laborForce > 0) {
      unemploymentRate = Math.round((unemployed / laborForce) * 1000) / 10
    }

    return {
      population: pop,
      medianIncome: income,
      unemploymentRate,
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    throw new Error(`Census API error for ZIP ${zip}: ${message}`)
  }
}
