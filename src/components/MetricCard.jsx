export default function MetricCard({ label, value, isBetter, loading }) {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="mb-3 h-3 w-20 rounded bg-gray-200" />
        <div className="h-6 w-28 rounded bg-gray-200" />
      </div>
    )
  }

  return (
    <div
      className={`flex flex-col gap-1 rounded-xl bg-gray-100 p-4 ${
        isBetter ? 'bg-green-50 ring-2 ring-green-400' : ''
      }`}
    >
      <span className="text-[13px] font-medium uppercase tracking-wide text-gray-500">{label}</span>
      <span className={`text-2xl font-bold text-gray-900 ${isBetter ? 'text-green-700' : ''}`}>
        {value}
      </span>
      {isBetter ? (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-600">
          ✓ Better
        </span>
      ) : null}
    </div>
  )
}
