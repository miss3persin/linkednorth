export default function Steps({ step, onStepChange }) {
  const labels = [
    'Template',
    'Details',
    'Experience',
    'Review',
    'Download',
  ]

  const handleStepClick = (num) => {
    if (num <= step) {
      onStepChange(num);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-6">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <div
            key={num}
            onClick={() => handleStepClick(num)}
            className={`h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center rounded-full border cursor-pointer ${
              num === step
                ? 'bg-gray-900 text-white'
                : 'border-gray-300 text-gray-500'
            }`}
          >
            {num}
          </div>
        ))}
      </div>

      <span className="text-xs text-gray-400 mt-2 sm:mt-0 ml-0 sm:ml-auto">
        Step {step} of 5: {labels[step - 1]}
      </span>
    </div>
  )
}
