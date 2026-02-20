import { Loader } from '@/app/components/ui/Loader'

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-white mt-[72px] gap-8 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="h-10 w-40 bg-gray-100 rounded-full animate-pulse" />
        <div className="h-6 w-72 bg-gradient-to-r from-[#E2E8F0] to-[#c5cbe0] rounded-full animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="h-40 bg-gray-50 border border-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Loader size="lg" message="Loading job listings" />
      </div>
    </div>
  )
}
