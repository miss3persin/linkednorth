'use client'
export default function Modal({ open = false, onClose = ()=>{}, children, size = 'max-w-md' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`bg-white rounded shadow-lg ${size} w-full mx-4`}>
        <div className="p-6">
          <button onClick={onClose} className="text-gray-400 float-right">✕</button>
          <div className="clear-both" />
          <div>{children}</div>
        </div>
      </div>
    </div>
  )
}
