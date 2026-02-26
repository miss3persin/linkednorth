'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Loader from '@/app/components/ui/Loader'
import { supabase } from '@/app/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Finishing sign in...')
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const finalize = async () => {
      setStatus('Finalizing sign in...')

      const { data, error: sessionError } = await supabase.auth.getSession()

      if (!isMounted) return

      if (sessionError || !data?.session) {
        setError(sessionError?.message ?? 'Unable to finish sign in.')
        setStatus('Redirecting you back home...')
        router.replace('/')
        return
      }

      setStatus('Redirecting to your dashboard...')
      router.replace('/dashboard')
    }

    finalize()

    return () => {
      isMounted = false
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-3 text-center">
        <Loader variant="redirecting" message={status} />
        {error && <p className="text-sm text-rose-500">{error}</p>}
      </div>
    </div>
  )
}
