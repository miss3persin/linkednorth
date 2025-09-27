'use client'
import Modal from '../ui/Modal'
import { SignUp } from '@clerk/nextjs'

export default function SignUpModal({ open, setOpen, switchToSignIn }) {
  return (
    <Modal open={open} onClose={() => setOpen(false)} size="max-w-md">
      <div className="text-left p-2">
        <h2 className="text-xl font-semibold mb-2">Join LinkedNorth</h2>
        <p className="text-sm text-gray-500 mb-4">
          Make the most of your professional life
        </p>

        <SignUp
          appearance={{
            layout: {
              logoImageUrl: null,
              socialButtonsPlacement: 'bottom',
              socialButtonsVariant: 'blockButton',
            },
            variables: {
              colorPrimary: 'black',
              borderRadius: '6px',
            },
            elements: {
              card: 'shadow-none border border-gray-200 rounded-lg',
              header: 'hidden',
              footer: 'hidden',
              formFieldInput:
                'w-full border rounded px-3 py-2 text-sm border-gray-300',
              formButtonPrimary:
                'w-full bg-black text-white py-2 rounded text-sm',
              socialButtonsBlockButton:
                'w-full border rounded py-2 flex items-center justify-center gap-3',
            },
          }}
          routing="hash"
          afterSignUpUrl="/dashboard"
          signInUrl="/auth/signin"
        />

        {/* Footer link to Sign In */}
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
