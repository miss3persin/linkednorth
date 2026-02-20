export default function Loading() {
  return (
    <div className="min-h-screen flex bg-gray-50 mt-[72px]">
      <div className="hidden lg:block w-60" />
      <main className="flex-1 px-6 py-10 space-y-6">
        <div className="space-y-4 max-w-6xl">
          <div className="h-10 w-60 bg-gray-100 rounded-full animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-32 rounded-2xl bg-white border border-gray-100 animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="h-56 rounded-2xl bg-white border border-gray-100 animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
