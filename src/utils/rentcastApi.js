const RENTCAST_MARKETS = 'https://api.rentcast.io/v1/markets'

export async function fetchRentcastData(zip) {
  const apiKey = import.meta.env.VITE_RENTCAST_KEY
  const params = new URLSearchParams({
    zipCode: String(zip),
    historyMonths: '12',
  })
  const url = `${RENTCAST_MARKETS}?${params.toString()}`

  try {
    const res = await fetch(url, {
      headers: {
        'X-Api-Key': apiKey,
      },
    })
    if (!res.ok) {
      const body = await res.text()
      throw new Error(
        body ? `${res.status} ${res.statusText}: ${body}` : res.statusText || `HTTP ${res.status}`,
      )
    }
    const response = await res.json()

    const medianSalePrice =
      response.averageSalePrice !== undefined && response.averageSalePrice !== null
        ? Number(response.averageSalePrice)
        : null
    const medianRent =
      response.averageRent !== undefined && response.averageRent !== null
        ? Number(response.averageRent)
        : null

    const rawHistory = response.saleData?.history
    let priceHistory = []
    if (rawHistory && typeof rawHistory === 'object' && !Array.isArray(rawHistory)) {
      priceHistory = Object.entries(rawHistory).map(([date, entry]) => {
        const value =
          entry && typeof entry === 'object' && 'value' in entry ? Number(entry.value) : NaN
        return { date, price: value }
      })
      priceHistory = priceHistory.filter((item) => Number.isFinite(item.price))
      priceHistory.sort((a, b) => a.date.localeCompare(b.date))
    }

    return {
      medianSalePrice: Number.isFinite(medianSalePrice) ? medianSalePrice : null,
      medianRent: Number.isFinite(medianRent) ? medianRent : null,
      priceHistory,
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    throw new Error(`RentCast API error for ZIP ${zip}: ${message}`)
  }
}
