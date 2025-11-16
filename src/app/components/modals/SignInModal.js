'use client'
import { useState } from 'react'
import { useSignIn } from '@clerk/nextjs'
import Modal from '../ui/Modal'

export default function SignInModal({ open, setOpen, switchToSignUp }) {
  const { isLoaded, signIn, setActive } = useSignIn()

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
      const result = await signIn.create({
        identifier: email,
        password,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        // === 🔥 Redirect Logic Starts Here ===
        const redirectUrl = localStorage.getItem('redirectAfterLogin')

        if (redirectUrl) {
          const url = new URL(redirectUrl)
          const queryString = url.search // e.g. ?search=developer&location=london
          const newUrl = '/joblistings' + queryString

          localStorage.removeItem('redirectAfterLogin')
          window.location.href = newUrl
        } else {
          window.location.href = '/joblistings'
        }
        // === 🔥 Redirect Logic Ends Here ===
      }
    } catch (err) {
      setError(err.errors ? err.errors[0].message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={() => setOpen(false)} size="max-w-md">
      <div className="text-left">
        {/* Header */}
        <h2 className="text-xl font-bold mb-1">Sign in</h2>
        <p className="text-sm text-gray-500 mb-4">
          Stay updated on your professional world
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm border-gray-300"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Clerk CAPTCHA placeholder */}
          <div id="clerk-captcha" className="flex items-center" />

          <div className="flex flex-col gap-4 justify-between text-sm">
            <a
              href="/forgot-password"
              className="text-blue-600 hover:underline font-medium"
            >
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
            className="w-full bg-black text-white py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
          >
            {loading ? 'Signing in...' : 'Sign in'}
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
            onClick={() => {
              // 🔹 Add this block first
              const redirectAfterLogin = localStorage.getItem('redirectAfterLogin')
              const url = new URL(redirectAfterLogin || window.location.href)
              const queryString = url.search
              const redirectUrlComplete = '/joblistings' + queryString

              signIn.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/sso-callback',
                redirectUrlComplete,
              })
            }}
            className="w-full border border-gray-300 rounded py-2 flex items-center justify-center gap-3 text-sm font-medium"
          >
            <img src="/google.svg" alt="Google" className="w-4 h-4" />
            Continue with Google
          </button>

          <button
            onClick={() => {
              const redirectAfterLogin = localStorage.getItem('redirectAfterLogin')
              const url = new URL(redirectAfterLogin || window.location.href)
              const queryString = url.search
              const redirectUrlComplete = '/joblistings' + queryString

              signIn.authenticateWithRedirect({
                strategy: 'oauth_facebook',
                redirectUrl: '/sso-callback',
                redirectUrlComplete,
              })
            }}
            className="w-full border border-gray-300 rounded py-2 flex items-center justify-center gap-3 text-sm font-medium"
          >
            <img src="/facebook.svg" alt="Facebook" className="w-4 h-4" />
            Continue with Facebook
          </button>

          <button
            onClick={() => {
              const redirectAfterLogin = localStorage.getItem('redirectAfterLogin')
              const url = new URL(redirectAfterLogin || window.location.href)
              const queryString = url.search
              const redirectUrlComplete = '/joblistings' + queryString

              signIn.authenticateWithRedirect({
                strategy: 'oauth_apple',
                redirectUrl: '/sso-callback',
                redirectUrlComplete,
              })
            }}
            className="w-full border border-gray-300 rounded py-2 flex items-center justify-center gap-3 text-sm font-medium"
          >
            <img src="/apple.svg" alt="Apple" className="w-4 h-4" />
            Continue with Apple
          </button>
        </div>

        {/* Footer */}
        <p className="text-sm text-center mt-4 mb-6 text-gray-500">
          New to LinkedNorth?{' '}
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
