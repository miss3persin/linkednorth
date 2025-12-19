'use client'
import { useState } from 'react'
import { useSignUp } from "@clerk/nextjs"
import Modal from '../ui/Modal'

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

  if (!open) return null
  if (!isLoaded) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      })

      // Send verification email
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
    setLoading(true)
    setError(null)

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        
        // Simple redirect - just go to dashboard
        window.location.href = '/dashboard'
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
        redirectUrlComplete: '/dashboard',
      })
    } catch (err) {
      console.error('OAuth error:', err)
      setError('Failed to sign up with social provider')
    }
  }

  if (verifying) {
    return (
      <Modal open={open} onClose={() => setOpen(false)} size="max-w-md">
        <div className="text-left">
          <h2 className="text-xl font-bold mb-1">Verify your email</h2>
          <p className="text-sm text-gray-500 mb-4">
            We sent a code to {email}
          </p>

          <form onSubmit={handleVerify} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter 6-digit code"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>

            <button
              type="button"
              onClick={() => setVerifying(false)}
              className="w-full text-blue-600 text-sm hover:underline"
            >
              Back to sign up
            </button>
          </form>
        </div>
      </Modal>
    )
  }

  return (
    <Modal open={open} onClose={() => setOpen(false)} size="max-w-md">
      <div className="text-left">
        {/* Header */}
        <h2 className="text-xl font-bold mb-1">Join LinkedNorth</h2>
        <p className="text-sm text-gray-500 mb-4">
          Make the most of your professional life
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Password (8+ characters)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              minLength={8}
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <p className="text-xs text-gray-500">
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
            className="w-full bg-black text-white py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Agree & Join'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-2 text-sm text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Social logins */}
        <div className="space-y-2">
          <button
            onClick={() => handleOAuthSignUp('oauth_google')}
            className="w-full border border-gray-300 rounded py-2 flex items-center justify-center gap-3 text-sm font-medium hover:bg-gray-50 transition"
          >
            <img src="/google.svg" alt="Google" className="w-4 h-4" />
            Continue with Google
          </button>

          <button
            onClick={() => handleOAuthSignUp('oauth_facebook')}
            className="w-full border border-gray-300 rounded py-2 flex items-center justify-center gap-3 text-sm font-medium hover:bg-gray-50 transition"
          >
            <img src="/facebook.svg" alt="Facebook" className="w-4 h-4" />
            Continue with Facebook
          </button>

          <button
            onClick={() => handleOAuthSignUp('oauth_apple')}
            className="w-full border border-gray-300 rounded py-2 flex items-center justify-center gap-3 text-sm font-medium hover:bg-gray-50 transition"
          >
            <img src="/apple.svg" alt="Apple" className="w-4 h-4" />
            Continue with Apple
          </button>
        </div>

        {/* Footer */}
        <p className="text-sm text-center mt-4 mb-6 text-gray-500">
          Already on LinkedNorth?{' '}
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