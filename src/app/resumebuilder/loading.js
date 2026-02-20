export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white mt-[72px]">
      <div className="space-y-4 text-center">
        <div className="h-12 w-44 mx-auto bg-gradient-to-r from-[#DFE2EB] to-[#F5F6FA] rounded-full animate-pulse" />
        <div className="h-3 w-72 bg-gray-100 rounded-full animate-pulse" />
        <div className="h-3 w-56 bg-gray-100 rounded-full animate-pulse" />
        <p className="text-sm text-gray-500">Preparing your resume builder...</p>
      </div>
    </div>
  )
}
