'use client'

import { X, Mail, Copy, ExternalLink } from 'lucide-react'

export default function EmailApplicationModal({ isOpen, onClose, emailAddress, onOpenEmail, onCopyEmail }) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in zoom-in duration-200">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Success icon */}
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail size={32} className="text-green-600" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-center mb-2">Application Submitted!</h2>
                <p className="text-gray-600 text-center text-sm mb-6">
                    Your application has been recorded. Send your resume to:
                </p>

                {/* Email display */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <p className="text-center font-mono text-sm text-gray-800 break-all">
                        {emailAddress}
                    </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onOpenEmail}
                        className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                        <ExternalLink size={18} />
                        Open Email Client
                    </button>

                    <button
                        onClick={onCopyEmail}
                        className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <Copy size={18} />
                        Copy Email Address
                    </button>
                </div>

                <p className="text-xs text-gray-400 text-center mt-4">
                    Choose the option that works best for your device
                </p>
            </div>
        </div>
    )
}
