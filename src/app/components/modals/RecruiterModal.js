'use client'
import React from 'react'
import Modal from '../ui/Modal'
import { Button } from '../ui/Button'
import { FiBriefcase } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

export default function RecruiterModal({ open, setOpen }) {
    const router = useRouter()

    const handleCreateProfile = () => {
        setOpen(false)
        router.push('/recruiter/setup')
    }

    return (
        <Modal open={open} onClose={() => setOpen(false)} size="max-w-[400px]">
            <div className="flex flex-col items-center text-center py-6 px-2">
                {/* Icon Container */}
                <div className="w-16 h-16 bg-[#F0FDF4] rounded-full flex items-center justify-center mb-6">
                    <div className="w-12 h-12 bg-[#DCFCE7] rounded-full flex items-center justify-center">
                        <FiBriefcase className="text-[#166534] text-2xl" />
                    </div>
                </div>

                {/* Text Content */}
                <h2 className="text-2xl font-bold mb-3 text-gray-900 tracking-tight">Ready to Hire?</h2>
                <p className="text-[#6B7280] text-[14px] leading-relaxed max-w-[300px] mb-8">
                    To post a job, you first need to set up a Recruiter Profile to manage your company brand and applicants.
                </p>

                {/* Action Buttons */}
                <div className="w-full flex flex-col items-center justify-center space-y-4 px-4">
                    <Button
                        text="Create Recruiter Profile"
                        variant="black"
                        className="w-full py-4 text-sm font-bold rounded-lg"
                        onClick={handleCreateProfile}
                    />
                    <button
                        onClick={() => setOpen(false)}
                        className="w-full text-gray-500 text-sm font-medium hover:text-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    )
}
