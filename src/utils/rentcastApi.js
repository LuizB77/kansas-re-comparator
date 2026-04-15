const MOCK_DATA = {
  '66606': { medianSalePrice: 142000, medianRent: 895 },
  '66614': { medianSalePrice: 198000, medianRent: 1050 },
  '66044': { medianSalePrice: 187000, medianRent: 975 },
  '67202': { medianSalePrice: 165000, medianRent: 920 },
  '67212': { medianSalePrice: 210000, medianRent: 1100 },
  '66101': { medianSalePrice: 125000, medianRent: 780 },
  '66062': { medianSalePrice: 285000, medianRent: 1350 },
  '66213': { medianSalePrice: 320000, medianRent: 1475 },
  '66502': { medianSalePrice: 155000, medianRent: 850 },
  '67401': { medianSalePrice: 148000, medianRent: 870 },
}

function buildPriceHistory(medianSalePrice) {
  const basePrice = medianSalePrice * 0.94
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const priceHistory = []
  for (let i = 0; i < 12; i++) {
    const price = Math.round(basePrice + (i * (medianSalePrice - basePrice)) / 11)
    const date = new Date(year, month - (11 - i), 1).toISOString().split('T')[0]
    priceHistory.push({ date, price })
  }
  return priceHistory
}

export async function fetchRentcastData(zip) {
  await Promise.resolve()

  const zipKey = String(zip).padStart(5, '0')
  const mock = MOCK_DATA[zipKey]

  let medianSalePrice
  let medianRent

  if (mock) {
    medianSalePrice = mock.medianSalePrice
    medianRent = mock.medianRent
  } else {
    const digits = parseInt(String(zip).replace(/\D/g, ''), 10)
    const seed = Number.isFinite(digits) ? digits % 1000 : 0
    medianSalePrice = 120000 + seed * 180
    medianRent = Math.round(700 + seed * 0.6)
  }

  const priceHistory = buildPriceHistory(medianSalePrice)

  return {
    medianSalePrice,
    medianRent,
    priceHistory,
  }
}
