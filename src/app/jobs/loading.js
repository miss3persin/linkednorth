import { Loader } from '@/app/components/ui/Loader'

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-white mt-[72px]">
      <div className="flex-1 py-10 px-4 sm:px-8">
        <div className="space-y-6 max-w-6xl mx-auto">
          <div className="h-12 w-60 bg-gray-100 rounded-full animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="h-40 bg-gray-50 border border-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-6">
        <Loader size="md" message="Preparing job board" />
      </div>
    </div>
  )
}
