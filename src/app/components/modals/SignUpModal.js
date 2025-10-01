'use client'
import { useState } from 'react'
import { useSignUp } from '@clerk/nextjs'
import Modal from '../ui/Modal'

export default function SignUpModal({ open, setOpen, switchToSignIn }) {
  const { isLoaded, signUp, setActive } = useSignUp()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  if (!open) return null
  if (!isLoaded) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      await setActive({ session: signUp.createdSessionId })
      window.location.href = '/dashboard'
    } catch (err) {
      setError(err.errors ? err.errors[0].message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={() => setOpen(false)} size="max-w-md">
      <div className="text-left p-2">
        {/* Header */}
        <h2 className="text-xl font-semibold mb-2">Join LinkedNorth</h2>
        <p className="text-sm text-gray-500 mb-4">
          Make the most of your professional life
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-1/2 border rounded px-3 py-2 text-sm border-gray-300"
              required
            />
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-1/2 border rounded px-3 py-2 text-sm border-gray-300"
              required
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm border-gray-300"
            required
          />

          <input
            type="password"
            placeholder="Password (6 or more characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm border-gray-300"
            required
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Clerk CAPTCHA placeholder */}
          <div id="clerk-captcha" className='flex item-center' />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded text-sm font-medium hover:bg-gray-800 transition"
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

        {/* Social logins (direct Clerk calls) */}
        <div className="space-y-2">
          <button
            onClick={() =>
              signUp.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/dashboard',
              })
            }
            className="w-full border rounded py-2 flex items-center justify-center gap-3 text-sm"
          >
            <img src="/icons/google.svg" alt="Google" className="w-4 h-4" />
            Continue with Google
          </button>

          <button
            onClick={() =>
              signUp.authenticateWithRedirect({
                strategy: 'oauth_facebook',
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/dashboard',
              })
            }
            className="w-full border rounded py-2 flex items-center justify-center gap-3 text-sm"
          >
            <img src="/icons/facebook.svg" alt="Facebook" className="w-4 h-4" />
            Continue with Facebook
          </button>

          <button
            onClick={() =>
              signUp.authenticateWithRedirect({
                strategy: 'oauth_apple',
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/dashboard',
              })
            }
            className="w-full border rounded py-2 flex items-center justify-center gap-3 text-sm"
          >
            <img src="/icons/apple.svg" alt="Apple" className="w-4 h-4" />
            Continue with Apple
          </button>
        </div>

        {/* Footer */}
        <p className="text-sm text-center mt-4 text-gray-500">
          Already on LinkedNorth?{' '}
          <span
            onClick={switchToSignIn}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>
      </div>
    </Modal>
  )
}
