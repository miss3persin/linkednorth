"use client";

import { useState, useEffect } from "react";
import { useAuth, useSignIn, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, router]);

  if (!isLoaded) return null;

  async function create(e) {
    e.preventDefault();
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setSuccessfulCreation(true);
      setError("");
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || "Something went wrong.");
    }
  }

  async function reset(e) {
    e.preventDefault();
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result.status === "needs_second_factor") {
        setSecondFactor(true);
        setError("");
      } else if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || "Reset failed.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow p-6 rounded">
        <h1 className="text-xl font-bold mb-4">Forgot Password?</h1>

        <form onSubmit={!successfulCreation ? create : reset} className="space-y-4">
          {!successfulCreation ? (
            <>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded"
              >
                Send reset code
              </button>
            </>
          ) : (
            <>
              <label className="block text-sm font-medium">New Password</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <label className="block text-sm font-medium">Reset Code</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded"
              >
                Reset password
              </button>
            </>
          )}
        </form>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        {secondFactor && <p className="text-orange-500 text-sm mt-3">2FA is required.</p>}

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Remembered your password?{" "}
          <span
            onClick={() => router.push("/")}
            className="text-blue-600 cursor-pointer hover:underline font-medium pl-4"
          >
            Back to Home
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
