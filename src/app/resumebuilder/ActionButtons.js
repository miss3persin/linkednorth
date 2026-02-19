export default function ActionButtons({ step, onBack, onNext }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between mt-6 gap-2 sm:gap-0">
      <button
        disabled={step === 1}
        onClick={onBack}
        className="text-xs px-4 py-2 border rounded w-full sm:w-auto disabled:opacity-50 skip-squared"
      >
        Back
      </button>

      {step < 5 && (
        <button
          onClick={onNext}
          className="text-xs px-4 py-2 bg-gray-900 text-white rounded w-full sm:w-auto skip-squared"
        >
          Next →
        </button>
      )}
    </div>
  )
}
