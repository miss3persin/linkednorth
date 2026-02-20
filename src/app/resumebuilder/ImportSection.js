'use client'

import { useState } from 'react'

export default function ImportSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="hidden sm:flex bg-blue-600 text-white rounded-md h-7 w-7 flex items-center justify-center text-sm font-semibold">
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

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white text-xs px-3 sm:px-4 py-2 rounded-md w-full sm:w-auto skip-squared"
        >
          Import from LinkedIn
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 blur-[1px]" />
          <div className="relative z-10 w-full max-w-md rounded-[32px] border border-white/30 bg-white/90 px-6 py-8 sm:px-10 sm:py-10 shadow-2xl backdrop-blur-xl text-center">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-gray-400 uppercase mb-3">
              Update in progress
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Feature Coming Soon
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              We’re polishing our LinkedIn import flow to make sure it feels seamless. Hang tight and come back soon!
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black hover:border hover:border-black"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}
