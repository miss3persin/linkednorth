'use client'
import { Inter, Open_Sans } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })


export default function Modal({ open = false, onClose = ()=>{}, children, size = 'max-w-md' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`bg-white rounded-lg shadow-lg ${size} w-full mx-4`}>
        <div className="py-4 px-6">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 float-right">✕</button>
          <div className="clear-both" />
          <div className={`${inter.variable} -mt-4`}>{children}</div>
        </div>
      </div>
    </div>
  )
}
