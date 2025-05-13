"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  function onChange(e) {
    setEmail(e.target.value);
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset password link sent to your email");
    } catch (error) {
      toast.error("Could not send reset email");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg">
        <div className="w-1/2 h-auto">
          <img
            src="https://via.placeholder.com/600x800"
            alt="Forgot Password"
            className="object-cover w-full h-full rounded-l-lg"
          />
        </div>
        <div className="w-1/2 p-8">
          <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">
            Forgot your password?
          </h2>
          <p className="mb-6 text-sm text-center text-gray-600">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={onChange}
                className="w-full h-12 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email address"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full h-12 bg-blue-600 text-white rounded-full font-medium text-sm transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Send reset link
              </button>
            </div>
          </form>
          <div className="mt-6 text-center text-sm">
            <Link
              to="/sign-in"
              className="font-medium text-blue-700 hover:text-blue-900"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
