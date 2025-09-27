'use client'
import { useState } from 'react'
import SignInModal from './SignInModal'
import SignUpModal from './SignUpModal'

export default function AuthModals({ open, setOpen }) {
  const [activeModal, setActiveModal] = useState('signin') // default to signin

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
