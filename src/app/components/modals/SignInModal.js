'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Modal from '../ui/Modal'
import { validateEmail } from '@/app/lib/formValidators'
import { useSessionContext, useSupabaseClient } from '@/app/lib/supabaseAuthContext'
import SocialAuthButtons from '../SocialAuthButtons'

export default function SignInModal({ open, setOpen, switchToSignUp }) {
  const { session } = useSessionContext()
  const supabase = useSupabaseClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const { [field]: _omit, ...rest } = prev
      return rest
    })
  }

  const runSignInValidation = () => {
    const validationErrors = {}
    const emailError = validateEmail(email)
    const passwordError = password?.trim() ? '' : 'Password is required.'

    if (emailError) validationErrors.email = emailError
    if (passwordError) validationErrors.password = passwordError

    return validationErrors
  }

  useEffect(() => {
    if (!session || !open) return

    setOpen(false)
    router.push('/dashboard')
  }, [session, open, router, setOpen])

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = runSignInValidation()
    if (Object.keys(validationErrors).length) {
      setFieldErrors(validationErrors)
      setError(null)
      return
    }

    setFieldErrors({})
    setLoading(true)
    setError(null)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      const user = data?.user
      if (user && !user.user_metadata?.is_verified) {
        await supabase.auth.signOut()
        setError(
          'Please verify your account before signing in. Check your inbox for the 6-digit code.'
        )
      }
    } catch (err) {
      console.error('Sign in error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={() => setOpen(false)} size="max-w-sm sm:max-w-md">
      <div className="text-left px-1 sm:px-0">
        <h2 className="text-lg sm:text-xl font-bold mb-1">Sign in</h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
          Stay updated on your professional world
        </p>
        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                clearFieldError('email')
              }}
              className="w-full border rounded px-3 py-2 text-xs sm:text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {fieldErrors.email && (
              <p className="text-[11px] mt-1 text-rose-500">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                clearFieldError('password')
              }}
              className="w-full border rounded px-3 py-2 text-xs sm:text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {fieldErrors.password && (
              <p className="text-[11px] mt-1 text-rose-500">{fieldErrors.password}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-xs sm:text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:gap-4 justify-between text-xs sm:text-sm">
            <a href="/forgot-password" className="text-blue-600 hover:underline font-medium">
              Forgot password?
            </a>
            <label className="flex items-center space-x-2 text-gray-600">
              <input type="checkbox" className="h-4 w-4" />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed skip-squared"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="flex items-center my-3 sm:my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-2 text-xs sm:text-sm text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <SocialAuthButtons setError={setError} />
        <p className="text-xs sm:text-sm text-center mt-4 mb-5 sm:mb-6 text-gray-500">
          New to LinkedNorth?
          <span
            onClick={switchToSignUp}
            className="text-blue-600 cursor-pointer hover:underline font-medium pl-2"
          >
            Join now
          </span>
        </p>
      </div>
    </Modal>
  )
}
