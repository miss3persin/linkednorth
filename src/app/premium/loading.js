import { Loader } from "@/app/components/ui/Loader";

const featureRows = Array.from({ length: 4 });

export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-72px)] flex bg-white mt-[72px] px-4 sm:px-6 md:px-8 py-6 gap-6">
      <div className="hidden xl:flex flex-col gap-4 w-40 shrink-0">
        <div className="h-12 rounded-xl bg-gray-100 animate-pulse" />
        <div className="h-12 rounded-xl bg-gray-100 animate-pulse" />
        <div className="h-12 rounded-xl bg-gray-100 animate-pulse" />
        <div className="h-12 rounded-xl bg-gray-100 animate-pulse" />
      </div>

      <main className="flex-1 space-y-6">
        <div className="rounded-2xl bg-gradient-to-r from-[#E5E7EB] to-[#F8FAFC] p-6 text-gray-900 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-6 w-32 bg-white/80 rounded-full animate-pulse" />
              <div className="mt-2 h-3 w-40 bg-white/70 rounded-full animate-pulse" />
            </div>
            <Loader size="sm" spinnerColor="#e5e7eb" accentColor="#ffffff" showMessage={false} />
          </div>
          <div className="space-y-2">
            {featureRows.map((_, idx) => (
              <div key={idx} className="h-3 w-full bg-white/60 rounded-full animate-pulse" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featureRows.map((_, idx) => (
            <div key={idx} className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 space-y-3">
              <div className="h-4 w-28 bg-gray-100 rounded-full animate-pulse" />
              <div className="h-3 w-20 bg-gray-200 rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="h-2 w-full bg-gray-100 rounded-full animate-pulse" />
                <div className="h-2 w-5/6 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-2 w-3/4 bg-gray-100 rounded-full animate-pulse" />
              </div>
              <div className="h-10 rounded-lg bg-gray-50 animate-pulse" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 space-y-4">
            <div className="h-4 w-32 bg-gray-200 rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-100 rounded-full animate-pulse" />
              <div className="h-3 bg-gray-100 rounded-full animate-pulse" />
              <div className="h-3 w-3/4 bg-gray-100 rounded-full animate-pulse" />
            </div>
            <div className="h-10 rounded-lg bg-gray-50 animate-pulse" />
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 space-y-4">
            <div className="h-4 w-32 bg-gray-200 rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-100 rounded-full animate-pulse" />
              <div className="h-3 bg-gray-100 rounded-full animate-pulse" />
              <div className="h-3 w-3/4 bg-gray-100 rounded-full animate-pulse" />
            </div>
            <div className="h-10 rounded-lg bg-gray-50 animate-pulse" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-3">
          <div className="h-5 w-32 bg-gray-200 rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-3 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-3 bg-gray-100 rounded-full animate-pulse" />
          </div>
          <div className="h-10 rounded-lg bg-gray-50 animate-pulse" />
        </div>
      </main>
    </div>
  );
}
