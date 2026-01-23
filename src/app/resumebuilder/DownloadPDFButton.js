'use client'

import { PDFDownloadLink } from '@react-pdf/renderer'

export default function DownloadPDFButton({ resumeData, template }) {
  if (!resumeData || !template?.pdfComponent) return null

  const PDFComponent = template.pdfComponent

  return (
    <PDFDownloadLink
      document={<PDFComponent resumeData={resumeData} />}
      fileName="resume.pdf"
      className="text-xs px-4 py-2 bg-gray-900 text-white rounded-md text-center"
    >
      {({ loading }) =>
        loading ? 'Preparing PDF...' : 'Download Resume'
      }
    </PDFDownloadLink>
  )
}
