'use client'
import { useState } from 'react'
import { useSignUp } from "@clerk/nextjs"
import Modal from '../ui/Modal'
import {
  validateName,
  validateEmail,
  validatePassword,
  validateCode,
} from '@/app/lib/formValidators'

export default function SignUpModal({ open, setOpen, switchToSignIn }) {
  const { isLoaded, signUp, setActive } = useSignUp()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [code, setCode] = useState('')
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

  if (!open) return null
  if (!isLoaded) return null

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
      await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setVerifying(true)
    } catch (err) {
      setError(err.errors ? err.errors[0].message : 'Something went wrong.')
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
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code })

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })

        const redirectTo = localStorage.getItem('redirectAfterLogin')
        if (redirectTo) {
          localStorage.removeItem('redirectAfterLogin')
          window.location.href = redirectTo
        } else {
          window.location.href = '/dashboard'
        }
      }
    } catch (err) {
      setError(err.errors ? err.errors[0].message : 'Invalid verification code.')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignUp = async (strategy) => {
    try {
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: '/sso-callback',
      })
    } catch (err) {
      console.error('OAuth error:', err)
      setError('Failed to sign up with social provider')
    }
  }

  
  if (verifying) {
    return (
      <Modal open={open} onClose={() => setOpen(false)} size="max-w-sm sm:max-w-md">
        <div className="text-left px-1 sm:px-0">
          <h2 className="text-lg sm:text-xl font-bold mb-1">Verify your email</h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            We sent a code to {email}
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
                placeholder="Enter 6-digit code"
                required
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
      <div className="text-left px-1 sm:px-0">
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
        <div className="space-y-2">
          <button
            onClick={() => handleOAuthSignUp('oauth_google')}
            className="w-full border border-gray-300 rounded py-2 flex items-center justify-center gap-3 text-xs sm:text-sm font-medium hover:bg-gray-50 transition skip-squared"
          >
            <img src="/google.svg" alt="Google" className="w-4 h-4" />
            Continue with Google
          </button>

          <button
            onClick={() => handleOAuthSignUp('oauth_facebook')}
            className="w-full border border-gray-300 rounded py-2 flex items-center justify-center gap-3 text-xs sm:text-sm font-medium hover:bg-gray-50 transition skip-squared"
          >
            <img src="/facebook.svg" alt="Facebook" className="w-4 h-4" />
            Continue with Facebook
          </button>

          <button
            onClick={() => handleOAuthSignUp('oauth_apple')}
            className="w-full border border-gray-300 rounded py-2 flex items-center justify-center gap-3 text-xs sm:text-sm font-medium hover:bg-gray-50 transition skip-squared"
          >
            <img src="/apple.svg" alt="Apple" className="w-4 h-4" />
            Continue with Apple
          </button>
        </div>
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
