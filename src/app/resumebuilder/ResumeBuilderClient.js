'use client'

import { useState } from 'react'
import { templates } from '../lib/templates'
import { emptyResume } from '../lib/resumeSchema'
import ImportSection from '../resumebuilder/ImportSection'
import TemplatesGrid from '../resumebuilder/TemplatesGrid'
import ResumeForm from '../components/resume/ResumeForm'
import ResumePreview from '../components/resume/ResumePreview'
import Steps from './Steps.js'
import ActionButtons from '../resumebuilder/ActionButtons'
import DownloadPDFButton from './DownloadPDFButton'
import { PDFViewer } from '@react-pdf/renderer'



export default function ResumeBuilderClient() {
  const [step, setStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [resumeData, setResumeData] = useState(emptyResume)
  const TOTAL_STEPS = 5
  const handleStepChange = (num) => {
    setStep(num);
  };

  return (
    <div className="mt-6 w-full">
      {/* Import Section (always visible) */}
      <ImportSection />

      {/* Steps */}
      <Steps step={step} onStepChange={handleStepChange} />

      {/* Step Content */}
      {step === 1 && (
        <>
          <p className="mt-6 text-sm font-medium text-gray-700">
            Choose a Resume Template
          </p>

          <TemplatesGrid
            templates={templates}
            onSelect={(tpl) => {
              setSelectedTemplate(tpl);
              setStep(2); // Move to the next step after selecting a template
            }}
          />
        </>
      )}

      {step === 2 && (
        <ResumeForm
          resumeData={resumeData}
          setResumeData={setResumeData}
        />
      )}

      {step === 3 && selectedTemplate && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Preview Your Resume</h2>
          <p className="text-gray-500 mb-4">
            This is how your resume will look.
          </p>

          <PDFViewer style={{ width: '100%', height: '500px' }}>
            <selectedTemplate.pdfComponent resumeData={resumeData} />
          </PDFViewer>
        </div>
      )}

      {step === 4 && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Download Your Resume</h2>
          <p className="text-gray-500 mb-4">
            Your resume is ready to download as a PDF.
          </p>

          <DownloadPDFButton
            resumeData={resumeData}
            template={selectedTemplate}
          />
        </div>
      )}


      {step === 5 && (
        <div className="mt-6 text-sm text-gray-700">
          <h2 className="font-semibold mb-2">All Set 🎉</h2>
          <p className="text-gray-500">
            Your resume has been created successfully.
          </p>
        </div>
      )}


      {/* Action Buttons */}
      <ActionButtons
        step={step}
        onBack={() => setStep((prev) => Math.max(1, prev - 1))}
        onNext={() => setStep((prev) => Math.min(TOTAL_STEPS, prev + 1))}
      />

    </div>
  )
}
