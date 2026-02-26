import { Suspense } from 'react'
import PublicNavbar from './PublicNavbar'
import NavbarClient from './NavbarClient'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

export default async function NavbarWrapper() {
  let user = null

  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('sb-access-token')?.value

    if (accessToken) {
      const { data } = await supabaseAdmin.auth.getUser(accessToken)
      user = data?.user ?? null
    }
  } catch (err) {
    console.error('Failed to load Supabase session for Navbar:', err)
  }

  const userMetadata = user?.user_metadata || {}
  const initialUserData = user
    ? {
        firstName: userMetadata.first_name || userMetadata.firstName || '',
        lastName: userMetadata.last_name || userMetadata.lastName || '',
        imageUrl: userMetadata.avatar_url || userMetadata.imageUrl || '',
        username: userMetadata.username || '',
        email: user.email || '',
        id: user.id,
      }
    : null

  return (
    <Suspense fallback={<div />}>
      <NavbarClient initialUserData={initialUserData} fallbackPublic={<PublicNavbar />} />
    </Suspense>
  )
}
