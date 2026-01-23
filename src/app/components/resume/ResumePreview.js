export default function ResumePreview({ resumeData, template }) {
  if (!template) {
    return <p className="mt-6 text-sm text-gray-500">No template selected</p>
  }

  const TemplateComponent = template.component

  return (
    <div className="mt-6 flex justify-center">
      {/* A4 printable area */}
      <div
        id="resume-print"
        className="bg-white w-[794px] min-h-[1123px] shadow"
      >
        <TemplateComponent resumeData={resumeData} />
      </div>
    </div>
  )
}
