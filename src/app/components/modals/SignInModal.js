'use client'

import { useState } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { X } from 'lucide-react' // icon for close button

export default function SignInModal({ open, setOpen, switchToSignUp }) {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (!open) return null // 👈 don't render at all if closed
  if (!isLoaded) return null

  const handleSignIn = async (e) => {
    e.preventDefault()
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        window.location.href = '/dashboard'
      }
    } catch (err) {
      setError(err.errors ? err.errors[0].message : 'Something went wrong')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Card */}
      <div className="relative max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold mb-2">Sign in</h2>
        <p className="text-sm text-gray-500 mb-4">
          Stay updated on your professional world
        </p>

        <form onSubmit={handleSignIn} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <a href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="h-4 w-4" />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded text-sm"
          >
            Sign in
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-2 text-sm text-gray-400">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Clerk social login buttons */}
        <button
          onClick={() =>
            signIn.authenticateWithRedirect({
              strategy: 'oauth_google',
              redirectUrl: '/dashboard',
              redirectUrlComplete: '/dashboard',
            })
          }
          className="w-full border rounded py-2 flex items-center justify-center gap-2 mb-2"
        >
          <img src="/google.svg" alt="Google" className="h-4 w-4" />
          Continue with Google
        </button>

        <button
          onClick={() =>
            signIn.authenticateWithRedirect({
              strategy: 'oauth_facebook',
              redirectUrl: '/dashboard',
              redirectUrlComplete: '/dashboard',
            })
          }
          className="w-full border rounded py-2 flex items-center justify-center gap-2 mb-2"
        >
          <img src="/facebook.svg" alt="Facebook" className="h-4 w-4" />
          Continue with Facebook
        </button>

        <button
          onClick={() =>
            signIn.authenticateWithRedirect({
              strategy: 'oauth_apple',
              redirectUrl: '/dashboard',
              redirectUrlComplete: '/dashboard',
            })
          }
          className="w-full border rounded py-2 flex items-center justify-center gap-2"
        >
          <img src="/apple.svg" alt="Apple" className="h-4 w-4" />
          Continue with Apple
        </button>

        <p className="text-sm text-center mt-6 text-gray-500">
          New to LinkedNorth?{' '}
          <span
            onClick={switchToSignUp}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Join now
          </span>
        </p>
      </div>
    </div>
  )
}
