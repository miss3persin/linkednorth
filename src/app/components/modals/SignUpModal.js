'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Modal from '../ui/Modal'
import {
  validateName,
  validateEmail,
  validatePassword,
  validateCode,
} from '@/app/lib/formValidators'
import { useSessionContext, useSupabaseClient } from '@/app/lib/supabaseAuthContext'
import SocialAuthButtons from '../SocialAuthButtons'

export default function SignUpModal({ open, setOpen, switchToSignIn }) {
  const { session } = useSessionContext()
  const supabase = useSupabaseClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [code, setCode] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const { [field]: _omit, ...rest } = prev
      return rest
    })
  }

  const runSignUpValidation = () => {
    const validationErrors = {}
    const firstNameError = validateName(firstName, 'First name')
    const lastNameError = validateName(lastName, 'Last name')
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    if (firstNameError) validationErrors.firstName = firstNameError
    if (lastNameError) validationErrors.lastName = lastNameError
    if (emailError) validationErrors.email = emailError
    if (passwordError) validationErrors.password = passwordError

    return validationErrors
  }

  const runVerifyValidation = () => {
    const validationErrors = {}
    const codeError = validateCode(code)
    if (codeError) validationErrors.code = codeError
    return validationErrors
  }

  useEffect(() => {
    if (!session || !open) return

    setOpen(false)
    router.push('/dashboard')
  }, [session, open, router, setOpen])

  useEffect(() => {
    if (open) return
    setVerifying(false)
    setCode('')
    setFieldErrors({})
    setError(null)
    setStatusMessage('')
    setLoading(false)
  }, [open])

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = runSignUpValidation()
    if (Object.keys(validationErrors).length) {
      setFieldErrors(validationErrors)
      setError(null)
      return
    }

    setFieldErrors({})
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/email-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(payload.error || 'Unable to create your account right now.')
        setStatusMessage('')
      } else {
        setStatusMessage(
          payload.message || 'A 6-digit code was sent to your email. Enter it below to finish signing up.'
        )
        setVerifying(true)
      }
    } catch (err) {
      console.error('Sign up error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    const validationErrors = runVerifyValidation()
    if (Object.keys(validationErrors).length) {
      setFieldErrors(validationErrors)
      setError(null)
      return
    }

    setFieldErrors({})
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/email-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          code: code.trim(),
        }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(payload.error || 'Invalid verification code.')
        return
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        console.error('Post-verification sign in error:', signInError)
        setError('Verified but could not sign in. Try signing in manually.')
      }
    } catch (err) {
      console.error('Verification error:', err)
      setError('Invalid verification code.')
    } finally {
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <Modal open={open} onClose={() => setOpen(false)} size="max-w-sm sm:max-w-md">
        <div className="text-left px-1 sm:px-0 py-1 sm:py-2">
          <h2 className="text-lg sm:text-xl font-bold mb-1">Verify your email</h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
            We sent a 6-digit code to {email}. Enter it below to finish setting up your account.
          </p>
          {statusMessage && (
            <p className="text-[11px] my-2 text-gray-500 leading-tight">{statusMessage}</p>
          )}
          <p className="text-[11px] text-gray-400">
            Check your inbox (and spam folder) for the code—it can land anywhere.
          </p>

          <form onSubmit={handleVerify} className="space-y-2 sm:space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  clearFieldError('code')
                }}
                className="w-full border rounded px-3 py-2 text-xs sm:text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter 6-digit code if you received one"
              />
              {fieldErrors.code && (
                <p className="text-[11px] mt-1 text-rose-500">{fieldErrors.code}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-xs sm:text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed skip-squared"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>

            <button
              type="button"
              onClick={() => {
                setVerifying(false)
                setFieldErrors({})
                setStatusMessage('')
              }}
              className="w-full text-blue-600 text-xs sm:text-sm hover:underline skip-squared"
            >
              Back to sign up
            </button>
          </form>
        </div>
      </Modal>
    )
  }

  return (
    <Modal open={open} onClose={() => setOpen(false)} size="max-w-sm sm:max-w-md">
      <div className="text-left px-1 sm:px-0 py-1 sm:py-2">
        <h2 className="text-lg sm:text-xl font-bold mb-1">Join LinkedNorth</h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
          Make the most of your professional life
        </p>
        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                  clearFieldError('firstName')
                }}
                className="w-full border rounded px-3 py-2 text-xs sm:text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {fieldErrors.firstName && (
                <p className="text-[11px] mt-1 text-rose-500">{fieldErrors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                  clearFieldError('lastName')
                }}
                className="w-full border rounded px-3 py-2 text-xs sm:text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {fieldErrors.lastName && (
                <p className="text-[11px] mt-1 text-rose-500">{fieldErrors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
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
              Password (8+ characters)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                clearFieldError('password')
              }}
              className="w-full border rounded px-3 py-2 text-xs sm:text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              minLength={8}
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

          <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed">
            By clicking Agree & Join, you agree to the LinkedNorth{' '}
            <a href="/terms" className="text-blue-600 hover:underline">
              User Agreement
            </a>
            ,{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
            , and{' '}
            <a href="/cookie-policy" className="text-blue-600 hover:underline">
              Cookie Policy
            </a>
            .
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed skip-squared"
          >
            {loading ? 'Creating account...' : 'Agree & Join'}
          </button>
        </form>
        <div className="flex items-center my-3 sm:my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-2 text-xs sm:text-sm text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <SocialAuthButtons setError={setError} />
        <p className="text-xs sm:text-sm text-center mt-4 mb-5 sm:mb-6 text-gray-500">
          Already on LinkedNorth?
          <span
            onClick={switchToSignIn}
            className="text-blue-600 cursor-pointer hover:underline font-medium pl-2"
          >
            Sign in
          </span>
        </p>
      </div>
    </Modal>
  )
}
