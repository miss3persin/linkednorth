'use client'

import { X, Mail, Copy, ExternalLink, CheckCircle2, AlertCircle, Info } from 'lucide-react'

export default function JobApplicationModal({
    isOpen,
    onClose,
    type = 'success', // 'success', 'already_applied', 'already_saved', 'error', 'email'
    title,
    message,
    emailAddress,
    externalLink,
    onPrimaryAction,
    onSecondaryAction
}) {
    if (!isOpen) return null

    const getIcon = () => {
        switch (type) {
            case 'email':
                return <Mail size={32} className="text-blue-600" />
            case 'already_applied':
            case 'already_saved':
                return <Info size={32} className="text-amber-600" />
            case 'error':
                return <AlertCircle size={32} className="text-red-600" />
            default:
                return <CheckCircle2 size={32} className="text-emerald-600" />
        }
    }

    const getIconBg = () => {
        switch (type) {
            case 'email': return 'bg-blue-100'
            case 'already_applied':
            case 'already_saved': return 'bg-amber-100'
            case 'error': return 'bg-red-100'
            default: return 'bg-emerald-100'
        }
    }

    const getDefaultTitle = () => {
        switch (type) {
            case 'email': return 'Send Your Application'
            case 'already_applied': return 'Already Applied'
            case 'already_saved': return 'Already Saved'
            case 'error': return 'Oops! Something went wrong'
            default: return 'Application Recorded!'
        }
    }

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

                {/* Status icon */}
                <div className={`w-16 h-16 ${getIconBg()} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {getIcon()}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-center mb-2">{title || getDefaultTitle()}</h2>
                <p className="text-gray-600 text-center text-sm mb-6 whitespace-pre-line">
                    {message}
                </p>

                {/* Email display for email type */}
                {type === 'email' && emailAddress && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                        <p className="text-center font-mono text-sm text-gray-800 break-all">
                            {emailAddress}
                        </p>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-col gap-3">
                    {type === 'email' ? (
                        <>
                            <button
                                onClick={onPrimaryAction}
                                className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                            >
                                <ExternalLink size={18} />
                                Open Email Client
                            </button>
                            <button
                                onClick={onSecondaryAction}
                                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <Copy size={18} />
                                Copy Email Address
                            </button>
                        </>
                    ) : type === 'success' && externalLink ? (
                        <button
                            onClick={() => {
                                window.open(externalLink, '_blank');
                                onClose();
                            }}
                            className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                        >
                            <ExternalLink size={18} />
                            Continue to External Site
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                            Got it, thanks!
                        </button>
                    )}
                </div>

                {type === 'email' && (
                    <p className="text-xs text-gray-400 text-center mt-4">
                        Choose the option that works best for your device
                    </p>
                )}
            </div>
        </div>
    )
}
