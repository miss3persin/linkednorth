import { Loader } from '@/app/components/ui/Loader';
import { openSans } from '@/lib/fonts';

const statusMessages = [
  'Checking your profile',
  'Aligning career resources',
  'Warming up the job board',
  'Gathering insights from the network',
];

const loadingMessage =
  statusMessages[Math.floor(Math.random() * statusMessages.length)];

export default function Loading() {

  return (
    <div
      className={`${openSans.className} fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-white text-center`}
    >
      <Loader
        variant="loading"
        size="lg"
        spinnerColor="#e5e7eb"
        accentColor="#1a1354"
        showMessage={false}
        className="animate-pulse"
      />
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.35em] text-gray-500">LinkedNorth</p>
        <p className="text-lg font-semibold text-slate-900">{loadingMessage}</p>
        <p className="text-xs text-gray-400">
          Thanks for your patience — we&apos;ll be ready in a moment.
        </p>
      </div>
    </div>
  );
}
