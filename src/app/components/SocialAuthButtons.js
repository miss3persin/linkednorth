'use client'

import Image from 'next/image'
import { useSupabaseClient } from '@/app/lib/supabaseAuthContext'
import { startSocialOAuth } from '@/app/lib/socialOAuth'

const buttonClasses =
  'w-full border border-gray-300 rounded py-2 flex items-center justify-center gap-3 text-xs sm:text-sm font-medium hover:bg-gray-50 transition skip-squared'

export default function SocialAuthButtons({ setError = () => {} }) {
  const supabase = useSupabaseClient()

  const handleSocialClick = async (provider) => {
    if (!supabase) return

    setError(null)

    try {
      const { error } = await startSocialOAuth({ supabase, provider })

      if (error) {
        throw error
      }
    } catch (err) {
      console.error('OAuth error:', err)
      setError('Failed to authenticate with social provider')
    }
  }

  return (
    <div className="space-y-2">
      <button onClick={() => handleSocialClick('google')} className={buttonClasses}>
        <Image src="/google.svg" alt="Google" width={16} height={16} unoptimized />
        Continue with Google
      </button>
      <button onClick={() => handleSocialClick('facebook')} className={buttonClasses}>
        <Image src="/facebook.svg" alt="Facebook" width={16} height={16} unoptimized />
        Continue with Facebook
      </button>
      <button onClick={() => handleSocialClick('apple')} className={buttonClasses}>
        <Image src="/apple.svg" alt="Apple" width={16} height={16} unoptimized />
        Continue with Apple
      </button>
    </div>
  )
}
