"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/app/components/ui/Loader";
import { validateEmail } from "@/app/lib/formValidators";
import { useSessionContext, useSupabaseClient } from "@/app/lib/supabaseAuthContext";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const { session, isLoading } = useSessionContext();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const runValidation = () => {
    const validationErrors = {};
    const emailError = validateEmail(email);
    if (emailError) validationErrors.email = emailError;
    return validationErrors;
  };

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const { [field]: _omit, ...rest } = prev;
      return rest;
    });
  };

  useEffect(() => {
    if (!isLoading && session) {
      router.push("/dashboard");
    }
  }, [session, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader message="Preparing page" size="md" />
      </div>
    );
  }

  async function create(e) {
    e.preventDefault();
    const validationErrors = runValidation();
    if (Object.keys(validationErrors).length) {
      setFieldErrors(validationErrors);
      setError("");
      return;
    }

    setFieldErrors({});
    setLoading(true);
    setError("");

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`,
      });

      if (resetError) {
        setError(resetError.message || "Failed to send reset link.");
      } else {
        setMessage("Reset instructions have been sent to your inbox.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg p-8 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter your email to receive a password reset link.
        </p>

        <form onSubmit={create} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
              }}
              placeholder="you@example.com"
              required
            />
            {fieldErrors.email && (
              <p className="text-[11px] mt-1 text-rose-500">{fieldErrors.email}</p>
            )}
          </div>

          {message && (
            <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-100 rounded">
              {message}
            </div>
          )}
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Remembered your password?{" "}
          <span
            onClick={() => router.push("/")}
            className="text-blue-600 cursor-pointer hover:underline font-medium"
          >
            Back to Home
          </span>
        </p>
      </div>
    </div>
  );
}
