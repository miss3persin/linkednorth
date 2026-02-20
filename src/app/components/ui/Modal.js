'use client'
'use client'
import { Inter, Open_Sans } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export default function Modal({ open = false, onClose = () => {}, children, size = "max-w-md" }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6">
      <div className={`bg-white rounded-lg shadow-lg w-full max-w-full ${size}`}>
        <div className="max-h-[90vh] overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 float-right skip-squared"
            aria-label="Close modal"
            type="button"
          >
            ×
          </button>
          <div className="clear-both" />
          <div className={`${inter.variable} -mt-4`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
