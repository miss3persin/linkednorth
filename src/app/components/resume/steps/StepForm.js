export default function StepForm({ resumeData, setResumeData, onNext, onBack }) {
  const updatePersonal = (field, value) => {
    setResumeData({
      ...resumeData,
      personal: {
        ...resumeData.personal,
        [field]: value,
      },
    })
  }

  return (
    <div className="mt-6 max-w-xl">
      <h2 className="text-sm font-semibold text-gray-700">
        Personal Information
      </h2>

      <input
        className="mt-2 w-full border rounded px-3 py-2 text-sm"
        placeholder="Full Name"
        value={resumeData.personal.fullName}
        onChange={(e) => updatePersonal('fullName', e.target.value)}
      />

      <input
        className="mt-2 w-full border rounded px-3 py-2 text-sm"
        placeholder="Email"
        value={resumeData.personal.email}
        onChange={(e) => updatePersonal('email', e.target.value)}
      />

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="text-xs px-4 py-2 border rounded"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="text-xs px-4 py-2 bg-gray-900 text-white rounded"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
