'use client'

import { SupabaseAuthProvider } from '@/app/lib/supabaseAuthContext'

export default function SupabaseProvider({ children }) {
  return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>
}
