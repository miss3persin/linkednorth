"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Loader */}
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mb-6"></div>

      {/* Message */}
      <h1 className="text-lg font-semibold text-gray-800 mb-2">
        Redirecting you to your dashboard...
      </h1>
      <p className="text-sm text-gray-500">
        Please hold on while we finish signing you in.
      </p>

      {/* Clerk Callback (hidden but required) */}
      <div className="hidden">
        <AuthenticateWithRedirectCallback />
      </div>
    </div>
  );
}
