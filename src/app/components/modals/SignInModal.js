'use client'
import Modal from '../ui/Modal'
import { useState } from 'react'

export default function SignInModal({ open, setOpen }) {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')

  return (
    <Modal open={open} onClose={() => setOpen(false)} size="max-w-md">
      <div className="text-left">
        <h2 className="text-xl font-semibold">Sign in</h2>
        <p className="text-sm text-gray-500 mt-2">Stay updated on your professional world</p>

        <div className="mt-4 space-y-3">
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full border px-3 py-2 rounded" />
          <input value={pass} onChange={(e)=>setPass(e.target.value)} placeholder="Password" type="password" className="w-full border px-3 py-2 rounded" />
        </div>

        <div className="flex items-center justify-between mt-3">
          <label className="text-sm text-gray-600">
            <input type="checkbox" className="mr-2" /> Remember me
          </label>
          <a href="#" className="text-sm text-blue-600">Forgot password?</a>
        </div>

        <div className="mt-4">
          <button className="w-full bg-black text-white py-2 rounded">Sign in</button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">or</div>

        <div className="mt-4 space-y-3">
          <button className="w-full border rounded py-2 flex items-center justify-center gap-3">
            <img src="/placeholder.png" className="w-5 h-5" /> Continue with Google
          </button>
          <button className="w-full border rounded py-2 flex items-center justify-center gap-3">
            <img src="/placeholder.png" className="w-5 h-5" /> Continue with Facebook
          </button>
          <button className="w-full border rounded py-2 flex items-center justify-center gap-3">
            <img src="/placeholder.png" className="w-5 h-5" /> Continue with Apple
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">New to LinkedNorth? <a href="/auth/signup" className="text-blue-600">Join now</a></p>
      </div>
    </Modal>
  )
}
