export default function ImportSection() {
  return (
    <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-start sm:items-center gap-3">
        <div className="bg-blue-600 text-white rounded-md h-7 w-7 flex items-center justify-center text-sm font-semibold">
          N
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">
            Import from LinkedIn
          </p>
          <p className="text-xs text-gray-500">
            Save time by importing your professional information directly from LinkedIn
          </p>
        </div>
      </div>

      <button className="bg-blue-600 text-white text-xs px-3 sm:px-4 py-2 rounded-md w-full sm:w-auto skip-squared">
        Import from LinkedIn
      </button>
    </div>
  )
}
