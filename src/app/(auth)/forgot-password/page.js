"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { Loader } from "@/app/components/ui/Loader";
import {
  validateEmail,
  validatePassword,
  validateCode,
} from "@/app/lib/formValidators";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const { [field]: _omit, ...rest } = prev;
      return rest;
    });
  };

  const runSendValidation = () => {
    const validationErrors = {};
    const emailError = validateEmail(email);
    if (emailError) validationErrors.email = emailError;
    return validationErrors;
  };

  const runResetValidation = () => {
    const validationErrors = {};
    const codeError = validateCode(code);
    const passwordError = validatePassword(password);
    if (codeError) validationErrors.code = codeError;
    if (passwordError) validationErrors.password = passwordError;
    return validationErrors;
  };

  const formatClerkError = (err) => {
    const rawMessage = err?.errors?.[0]?.longMessage || err?.message || "";
    if (rawMessage.toLowerCase().includes("rate exceeded")) {
      return "Too many requests. Please wait a moment and try again.";
    }
    return rawMessage || "Something went wrong. Please try again.";
  };

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader message="Preparing page" size="md" />
      </div>
    );
  }

  async function create(e) {
    e.preventDefault();
    const validationErrors = runSendValidation();
    if (Object.keys(validationErrors).length) {
      setFieldErrors(validationErrors);
      setError("");
      return;
    }

    setFieldErrors({});
    setLoading(true);
    setError("");

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setSuccessfulCreation(true);
      setFieldErrors({});
    } catch (err) {
      console.error("Error:", err);
      setError(formatClerkError(err));
    } finally {
      setLoading(false);
    }
  }

  async function reset(e) {
    e.preventDefault();
    const validationErrors = runResetValidation();
    if (Object.keys(validationErrors).length) {
      setFieldErrors(validationErrors);
      setError("");
      return;
    }

    setFieldErrors({});
    setLoading(true);
    setError("");

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result.status === "needs_second_factor") {
        setSecondFactor(true);
      } else if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(formatClerkError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg p-8 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
        <p className="text-sm text-gray-600 mb-6">
          {!successfulCreation
            ? "Enter your email to receive a password reset code"
            : "Enter the code sent to your email and your new password"}
        </p>

        <form onSubmit={!successfulCreation ? create : reset} className="space-y-4">
          {!successfulCreation ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                type="email"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  clearFieldError('email')
                }}
                placeholder="you@example.com"
                required
              />
              {fieldErrors.email && (
                <p className="text-[11px] mt-1 text-rose-500">{fieldErrors.email}</p>
              )}
            </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>

              <div className="mt-3 flex justify-center">
                <div id="clerk-captcha" className="w-full max-w-xs" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reset Code
                </label>
                <input
                  type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  clearFieldError('code')
                }}
                placeholder="Enter 6-digit code"
                required
              />
              {fieldErrors.code && (
                <p className="text-[11px] mt-1 text-rose-500">{fieldErrors.code}</p>
              )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  clearFieldError('password')
                }}
                placeholder="Enter new password (8+ characters)"
                minLength={8}
                required
              />
              {fieldErrors.password && (
                <p className="text-[11px] mt-1 text-rose-500">{fieldErrors.password}</p>
              )}
            </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSuccessfulCreation(false);
                  setCode("");
                  setPassword("");
                  setError("");
                  setFieldErrors({});
                }}
                className="w-full text-sm text-blue-600 hover:underline"
              >
                Didn’t receive code? Send again
              </button>
            </>
          )}
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {secondFactor && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded">
            <p className="text-orange-600 text-sm">
              Two-factor authentication is required. Please check your authenticator app.
            </p>
          </div>
        )}

        {successfulCreation && !error && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-600 text-sm">
              ✓ Reset code sent to {email}. Check your inbox!
            </p>
          </div>
        )}
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
