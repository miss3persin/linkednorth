import { Loader } from "@/app/components/ui/Loader";

const stepPlaceholders = Array.from({ length: 3 });

export default function Loading() {
  return (
    <div className="min-h-screen flex justify-center bg-[#F8F9FB] mt-[72px] py-10 px-4 sm:px-6">
      <div className="w-full max-w-5xl space-y-6">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="h-4 w-40 bg-gray-200 rounded-full animate-pulse" />
              <div className="mt-1 h-2 w-32 bg-gray-100 rounded-full animate-pulse" />
            </div>
            <Loader size="sm" spinnerColor="#e5e7eb" accentColor="#111" showMessage={false} />
          </div>
          <div className="flex gap-3">
            {stepPlaceholders.map((_, idx) => (
              <div key={idx} className="flex-1 h-2 rounded-full bg-gray-200 animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((_, idx) => (
              <div key={idx} className="space-y-2">
                <div className="h-3 w-1/2 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-12 rounded-xl bg-gray-100 animate-pulse" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((_, idx) => (
              <div key={idx} className="space-y-2">
                <div className="h-3 w-2/3 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-32 rounded-2xl bg-gray-100 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-gray-100 bg-white p-6 space-y-4 shadow-lg">
          <div className="h-4 w-28 bg-gray-200 rounded-full animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((_, idx) => (
              <div key={idx} className="h-10 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
          <div className="h-12 rounded-2xl bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
