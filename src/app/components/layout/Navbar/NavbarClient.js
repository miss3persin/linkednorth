'use client'

import { useMemo } from 'react'
import { useSessionContext } from '@/app/lib/supabaseAuthContext'
import AuthNavbar from './AuthNavbar'
import PublicNavbar from './PublicNavbar'

export default function NavbarClient({ initialUserData, fallbackPublic }) {
  const { session, isLoading } = useSessionContext()
  const serverUserData = useMemo(() => {
    return !isLoading && !session?.user ? null : initialUserData
  }, [isLoading, session, initialUserData])

  const activeUser = session?.user
  const displayUserData = useMemo(() => {
    if (activeUser) {
      const metadata = activeUser.user_metadata || {}
      return {
        firstName: metadata.first_name || metadata.firstName || '',
        lastName: metadata.last_name || metadata.lastName || '',
        imageUrl: metadata.avatar_url || metadata.imageUrl || '',
        username: metadata.username || '',
        email: activeUser.email || serverUserData?.email || '',
        id: activeUser.id,
      }
    }
    return serverUserData
  }, [activeUser, serverUserData])

  if (activeUser || displayUserData) {
    return <AuthNavbar userData={displayUserData} />
  }

  return fallbackPublic ?? <PublicNavbar />
}
