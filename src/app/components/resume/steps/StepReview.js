export default function StepReview({ resumeData, template, onBack }) {
  const TemplateComponent = template.component

  return (
    <div className="mt-6">
      <div className="border rounded-lg p-6 bg-gray-50">
        <TemplateComponent data={resumeData} />
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="text-xs px-4 py-2 border rounded"
        >
          Back
        </button>
        <button className="text-xs px-4 py-2 bg-gray-900 text-white rounded">
          Download PDF
        </button>
      </div>
    </div>
  )
}
