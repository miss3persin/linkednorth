import { Loader } from '@/app/components/ui/Loader'

export default function Loading() {
  return (
    <div className="min-h-screen flex bg-gray-50 mt-[72px]">
      <div className="hidden lg:block w-60" />
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-3xl mx-auto px-4 py-10 space-y-6">
          <div className="h-10 w-40 bg-gray-100 rounded-full animate-pulse" />
          <div className="space-y-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-32 rounded-xl bg-white border border-gray-100 animate-pulse" />
            ))}
          </div>
          <Loader size="lg" message="Loading job details" />
        </div>
      </main>
    </div>
  )
}
