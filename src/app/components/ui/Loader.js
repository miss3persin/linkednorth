export function Loader({
  variant = 'loading',
  message,
  subtext,
  size = 'md',
  inline = false,
  showMessage = true,
  className = '',
  spinnerColor = '#e5e7eb',
  accentColor = '#0f172a',
}) {
  const variantLabels = {
    loading: 'Loading',
    redirecting: 'Redirecting',
    saving: 'Saving',
    publishing: 'Publishing',
    processing: 'Processing',
    idle: 'Starting up',
  }

  const label = message ?? variantLabels[variant] ?? 'Working'

  const sizeMap = {
    xs: 'w-6 h-6 border-[2px]',
    sm: 'w-8 h-8 border-[2px]',
    md: 'w-10 h-10 border-[3px]',
    lg: 'w-14 h-14 border-[4px]',
  }

  return (
    <div
      className={`flex ${inline ? 'flex-row gap-2' : 'flex-col gap-3'} items-center justify-center text-center text-gray-500 ${className}`}
    >
      <span
        role="status"
        aria-live="polite"
        className={`inline-flex items-center justify-center rounded-full border-2 animate-spin ${sizeMap[size] ?? sizeMap.md}`}
        style={{
          borderColor: spinnerColor,
          borderTopColor: accentColor,
          borderBottomColor: spinnerColor,
        }}
      >
        <span className="sr-only">{label}</span>
      </span>
      {showMessage && (
        <p className="text-[11px] sm:text-[12px] uppercase tracking-[0.35em] font-semibold">
          {label}
        </p>
      )}
      {subtext && <p className="text-[10px] text-gray-400">{subtext}</p>}
    </div>
  )
}

export default Loader
