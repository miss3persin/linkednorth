'use client'
import { useState, useEffect } from 'react'
import SignInModal from './SignInModal'
import SignUpModal from './SignUpModal'

export default function AuthModals({ open, setOpen }) {
  const [activeModal, setActiveModal] = useState('signin') // default to signin

  useEffect(() => {
    if (open) {
      // Store current URL only when the auth modal is opened
      const currentUrl = window.location.href
      localStorage.setItem('redirectAfterLogin', currentUrl)
    }
  }, [open])

  return (
    <>
      <SignInModal
        open={open && activeModal === 'signin'}
        setOpen={(val) => {
          if (!val) setOpen(false)
          else setActiveModal('signin')
        }}
        switchToSignUp={() => setActiveModal('signup')}
      />

      <SignUpModal
        open={open && activeModal === 'signup'}
        setOpen={(val) => {
          if (!val) setOpen(false)
          else setActiveModal('signup')
        }}
        switchToSignIn={() => setActiveModal('signin')}
      />
    </>
  )
}
