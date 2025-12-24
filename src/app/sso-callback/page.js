'use client'

import { AuthenticateWithRedirectCallback, useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SSOCallback() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()
  const [redirected, setRedirected] = useState(false)

  useEffect(() => {
    if (!isLoaded || !isSignedIn || redirected) return

    const redirectTo = localStorage.getItem('redirectAfterLogin') || '/'
    localStorage.removeItem('redirectAfterLogin')

    // Delay a tick to ensure Clerk finishes processing
    setTimeout(() => {
      router.replace(redirectTo)
      setRedirected(true)
    }, 50)
  }, [isLoaded, isSignedIn, router, redirected])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
        </div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>

      <AuthenticateWithRedirectCallback />
    </div>
  )
}
