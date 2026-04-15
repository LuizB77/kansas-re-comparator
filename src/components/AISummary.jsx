export default function AISummary({ summary, loading }) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-5/6 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-4/6 rounded bg-gray-200" />
      </div>
    )
  }

  if (summary == null || summary === '') {
    return null
  }

  const sentences = summary
    .split('. ')
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm text-primary">
          🤖
        </span>
        <h2 className="text-lg font-semibold text-gray-900">AI Market Summary</h2>
      </div>
      {sentences.map((sentence, i) => (
        <p key={i} className="mb-2 text-sm leading-relaxed text-gray-700">
          {sentence}.
        </p>
      ))}
    </div>
  )
}
