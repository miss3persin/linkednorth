'use client'

import { useCallback } from 'react'
import { useSessionContext } from './supabaseAuthContext'

function getCookieToken(name) {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
  if (!match) return null
  return match.split('=')[1] || null
}

export function useAuthFetch() {
  const { session } = useSessionContext()

  return useCallback(
    async (input, init = {}) => {
      const headers = new Headers(init.headers || {})
      const token = session?.access_token || getCookieToken('sb-access-token')

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      return fetch(input, {
        ...init,
        headers,
      })
    },
    [session],
  )
}
