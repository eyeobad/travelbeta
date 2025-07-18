import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../user/Authcontext"; // Adjust path as needed

export default function Login() {
  // Use username instead of email if your backend expects username.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  // Get the loginUser function from the AuthContext
  const { loginUser } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Call the loginUser function from context
    try {
      await loginUser(username, password);
    } catch (err) {
      // Optionally set a local error if needed.
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
      {/* White card container */}
      <div className="bg-white w-full max-w-md rounded-lg shadow-md p-8">
        <h2 className="text-center text-2xl font-bold uppercase mb-6">Log In</h2>

        {/* Display error if any */}
        {error && <p className="text-center text-red-600 mb-4">{error}</p>}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="rememberMe" className="ml-2 text-gray-700">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#FFC107] text-black font-bold py-3 rounded mt-2 hover:bg-[#e6ac0c] transition-colors"
          >
            Login &rarr;
          </button>
        </form>

        {/* Create Account Link */}
        <p className="text-center mt-4 text-sm text-gray-700">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-950 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
