'use client'

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function SSOCallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        </div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  )
}