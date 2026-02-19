'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function PremiumComingSoonOverlay() {
  const router = useRouter()

  const handleReturn = useCallback(() => {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push('/dashboard')
  }, [router])

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-20 max-w-sm w-full bg-white rounded-3xl border border-white/30 shadow-2xl p-8 sm:p-10 space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
          Premium coming soon
        </p>
        <h2 className="text-2xl font-bold text-gray-900">More Premium Features Coming Soon</h2>
        <p className="text-sm text-gray-600">
          We’re putting the finishing touches on the premium experience. Check back later to unlock exclusive tools.
        </p>
        <button
          type="button"
          onClick={handleReturn}
          className="w-full rounded-full bg-black text-white text-xs sm:text-sm font-semibold py-3 px-5 hover:bg-gray-800 transition"
        >
          Go back
        </button>
      </div>
    </div>
  )
}
