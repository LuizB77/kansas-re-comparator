import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts'

const COLOR_A = '#7F77DD'
const COLOR_B = '#34D399'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm shadow-md">
      <p className="mb-1 font-semibold text-gray-800">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}:{' '}
          {label === 'Unemp. %'
            ? `${entry.value}%`
            : new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              }).format(entry.value)}
        </p>
      ))}
    </div>
  )
}

export default function ComparisonChart({ locationA, locationB, loading }) {
  if (loading) {
    return (
      <div className="animate-pulse grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="h-64 rounded-2xl bg-gray-100" />
        <div className="h-64 rounded-2xl bg-gray-100" />
      </div>
    )
  }

  const barDataRaw = [
    { name: 'Home Price', A: locationA.medianSalePrice, B: locationB.medianSalePrice },
    { name: 'Median Rent', A: locationA.medianRent, B: locationB.medianRent },
    { name: 'Income', A: locationA.medianIncome, B: locationB.medianIncome },
    { name: 'Population', A: locationA.population, B: locationB.population },
    {
      name: 'Unemp. %',
      A: locationA.unemploymentRate,
      B: locationB.unemploymentRate,
    },
  ]

  const barData = barDataRaw.filter(
    (row) =>
      !(
        (row.A === null || row.A === undefined) &&
        (row.B === null || row.B === undefined)
      ),
  )

  const showLineChart = locationA.priceHistory?.length > 0
  const lineData =
    showLineChart &&
    locationA.priceHistory.map((item) => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      price: item.price,
    }))

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-base font-semibold text-gray-800">Metrics Comparison</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => {
                if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
                if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`
                return String(v)
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="A" name={`ZIP ${locationA.zip}`} fill={COLOR_A} radius={[4, 4, 0, 0]} />
            <Bar dataKey="B" name={`ZIP ${locationB.zip}`} fill={COLOR_B} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {showLineChart ? (
        <div>
          <h3 className="mb-3 text-base font-semibold text-gray-800">
            12-Month Sale Price Trend (ZIP {locationA.zip})
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={lineData} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                formatter={(v) => [
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0,
                  }).format(v),
                  'Median Sale Price',
                ]}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={COLOR_A}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </div>
  )
}
