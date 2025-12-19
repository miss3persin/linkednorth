'use client'
import { useState } from 'react'
import SignInModal from './SignInModal'
import SignUpModal from './SignUpModal'

export default function AuthModals({ open, setOpen }) {
  const [isSignIn, setIsSignIn] = useState(true)

  const switchToSignUp = () => setIsSignIn(false)
  const switchToSignIn = () => setIsSignIn(true)

  if (isSignIn) {
    return (
      <SignInModal
        open={open}
        setOpen={setOpen}
        switchToSignUp={switchToSignUp}
      />
    )
  }

  return (
    <SignUpModal
      open={open}
      setOpen={setOpen}
      switchToSignIn={switchToSignIn}
    />
  )
}