'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { templates } from '../lib/templates'
import { emptyResume } from '../lib/resumeSchema'
import { Loader } from '@/app/components/ui/Loader'
import { PDFViewer } from '@react-pdf/renderer'

const ImportSection = dynamic(() => import('../resumebuilder/ImportSection'), {
  ssr: false,
  loading: () => <div className="h-16 rounded-2xl bg-gray-100 animate-pulse" />,
})
const Steps = dynamic(() => import('./Steps'), {
  ssr: false,
  loading: () => <div className="h-12 rounded-xl bg-gray-100 animate-pulse w-full mt-6" />,
})
const TemplatesGrid = dynamic(() => import('../resumebuilder/TemplatesGrid'), {
  ssr: false,
  loading: () => (
    <div className="mt-6 space-y-2">
      {[...Array(3)].map((_, idx) => (
        <div key={idx} className="h-24 rounded-xl bg-gray-100 animate-pulse" />
      ))}
    </div>
  ),
})
const ResumeForm = dynamic(() => import('../components/resume/ResumeForm'), {
  ssr: false,
  loading: () => <div className="h-64 rounded-2xl bg-gray-100 animate-pulse mt-6" />,
})
const ActionButtons = dynamic(() => import('../resumebuilder/ActionButtons'), {
  ssr: false,
  loading: () => <div className="h-12 rounded-full bg-gray-100 animate-pulse mt-6" />,
})
const DownloadPDFButton = dynamic(() => import('./DownloadPDFButton'), {
  ssr: false,
  loading: () => <div className="h-12 rounded-2xl bg-gray-100 animate-pulse" />,
})

export default function ResumeBuilderClient() {
  const [step, setStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [selectedTemplatePdfComponent, setSelectedTemplatePdfComponent] = useState(null)
  const [isPdfLoading, setIsPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState(null)
  const [resumeData, setResumeData] = useState(emptyResume)
  const TOTAL_STEPS = 5

  const handleStepChange = (num) => {
    setStep(num)
  }

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
    setSelectedTemplatePdfComponent(null)
    setPdfError(null)
    setStep(2)
  }

  useEffect(() => {
    if (!selectedTemplate || step < 3) return

    let isActive = true
    queueMicrotask(() => {
      if (!isActive) return
      setIsPdfLoading(true)
      setPdfError(null)
    })

    selectedTemplate
      .loadPdfComponent()
      .then((component) => {
        if (!isActive) return
        setSelectedTemplatePdfComponent(() => component)
      })
      .catch(() => {
        if (!isActive) return
        setPdfError(
          'Unable to render the selected template right now. Please try again.'
        )
      })
      .finally(() => {
        if (isActive) setIsPdfLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [selectedTemplate, step])

  const templateWithPdf = selectedTemplate
    ? { ...selectedTemplate, pdfComponent: selectedTemplatePdfComponent }
    : null

  return (
    <div className="mt-6 w-full">
      <ImportSection />
      <Steps step={step} onStepChange={handleStepChange} />
      {step === 1 && (
        <>
          <p className="mt-6 text-sm font-medium text-gray-700">Choose a Resume Template</p>

          <TemplatesGrid
            templates={templates}
            onSelect={handleTemplateSelect}
          />
        </>
      )}

      {step === 2 && (
        <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
      )}

      {step === 3 && selectedTemplate && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Preview Your Resume</h2>
          <p className="text-gray-500 mb-4">
            This is how your resume will look.
          </p>

          {isPdfLoading && (
            <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-gray-200 rounded-2xl py-10">
              <Loader size="sm" message="Rendering preview" showMessage={false} />
              <p className="text-xs text-gray-500">Rendering preview...</p>
            </div>
          )}

          {pdfError && (
            <p className="text-sm text-rose-500 mb-4">{pdfError}</p>
          )}

          {!isPdfLoading && templateWithPdf?.pdfComponent && (
            <PDFViewer style={{ width: '100%', height: '500px' }}>
              <templateWithPdf.pdfComponent resumeData={resumeData} />
            </PDFViewer>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Download Your Resume</h2>
          <p className="text-gray-500 mb-4">
            Your resume is ready to download as a PDF.
          </p>

          {templateWithPdf?.pdfComponent ? (
            <DownloadPDFButton resumeData={resumeData} template={templateWithPdf} />
          ) : isPdfLoading ? (
            <p className="text-xs text-gray-500">Preview is still loading; download will become available shortly.</p>
          ) : (
            <p className="text-xs text-gray-500">Choose a template to enable the download.</p>
          )}
        </div>
      )}

      {step === 5 && (
        <div className="mt-6 text-sm text-gray-700">
          <h2 className="font-semibold mb-2">All Set 🎉</h2>
          <p className="text-gray-500">Your resume has been created successfully.</p>
        </div>
      )}

      <ActionButtons
        step={step}
        onBack={() => setStep((prev) => Math.max(1, prev - 1))}
        onNext={() => setStep((prev) => Math.min(TOTAL_STEPS, prev + 1))}
      />
    </div>
  )
}
