'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from './supabase'

const SupabaseAuthContext = createContext({
  session: null,
  isLoading: true,
})

async function syncSessionToServer(session) {
  try {
    if (session) {
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at,
        }),
      })
    } else {
      await fetch('/api/auth/session', {
        method: 'DELETE',
      })
    }
  } catch (error) {
    console.error('Failed to sync Supabase session with server cookies:', error)
  }
}

export function SupabaseAuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return
      const currentSession = data?.session ?? null
      setSession(currentSession)
      setIsLoading(false)
      void syncSessionToServer(currentSession)
    })

    const { data: authEvent } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return
      setSession(nextSession)
      void syncSessionToServer(nextSession)
    })

    return () => {
      isMounted = false
      authEvent?.subscription?.unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({ session, isLoading }), [session, isLoading])

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  )
}

export function useSessionContext() {
  return useContext(SupabaseAuthContext)
}

export function useSupabaseClient() {
  return supabase
}
