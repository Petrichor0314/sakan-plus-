"use client";

import { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { email, password } = formData;
  const navigate = useNavigate();

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      userCredential.user && navigate("/");
    } catch (error) {
      toast.error("Invalid credentials");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg">
        <div className="w-1/2 h-auto">
          <img
            src="https://via.placeholder.com/600x800"
            alt="Sign In"
            className="object-cover w-full h-full rounded-l-lg"
          />
        </div>
        <div className="w-1/2 p-8">
          <h2 className="mb-8 text-3xl font-bold text-start text-gray-800">
            Login
          </h2>
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Name*
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
                placeholder="Email or user name"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password*
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={onChange}
                  className="w-full h-12 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="Password"
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <AiFillEyeInvisible className="text-gray-500" />
                  ) : (
                    <AiFillEye className="text-gray-500" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-700 hover:text-blue-900"
              >
                Forgot password?
              </Link>
            </div>
            <div>
              <button
                type="submit"
                className="w-full h-12 bg-blue-600 text-white rounded-full font-medium text-sm transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Login
              </button>
            </div>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">or sign up with</span>
          </div>
          <div className="mt-6">
            <OAuth />
          </div>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Not registered yet?</span>
            <Link
              to="/sign-up"
              className="font-medium text-blue-700 hover:text-blue-900 ml-1"
            >
              Sign Up.
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
