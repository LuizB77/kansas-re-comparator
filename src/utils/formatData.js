export function formatCurrency(value) {
  if (value === null || value === undefined) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value) {
  if (value === null || value === undefined) return 'N/A'
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatPercent(value) {
  if (value === null || value === undefined) return 'N/A'
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value)}%`
}

export function getBetterValue(valueA, valueB, metric) {
  if (valueA === null || valueA === undefined || valueB === null || valueB === undefined) {
    return null
  }
  if (valueA === valueB) return null

  if (metric === 'unemploymentRate') {
    if (valueA < valueB) return 'A'
    if (valueB < valueA) return 'B'
    return null
  }

  if (valueA > valueB) return 'A'
  if (valueB > valueA) return 'B'
  return null
}
