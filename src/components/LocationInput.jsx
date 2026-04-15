export default function LocationInput({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
}) {
  return (
    <div className="w-full">
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        maxLength={5}
        placeholder={placeholder ?? 'e.g. 66606'}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  )
}
