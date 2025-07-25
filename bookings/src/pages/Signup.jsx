import  { React,useState } from "react";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuthContext } from "../user/Authcontext"; // adjust the import path as needed

export default function Signup() {
  // Form states
  const [username, setUsername]       = useState("");
  const [firstName, setFirstName]     = useState("");
  const [lastName, setLastName]       = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [password2, setPassword2]     = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [error, setError]             = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Get the registerUser function from AuthContext
  const { registerUser } = useAuthContext();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate reCAPTCHA
    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA.");
      return;
    }

    // Validate terms acceptance
    if (!acceptTerms) {
      setError("Please accept the Terms & Conditions.");
      return;
    }

    // Clear any previous error message
    setError("");

    // Call the registerUser function from AuthContext
    // Expected parameters: username, password, password2, email, first_name, last_name
    registerUser(username, password, password2, email, firstName, lastName);
  };

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
      
      {/* White card container */}
      <div className="bg-white w-full max-w-md rounded-lg shadow-md p-8">
        <h2 className="text-center text-2xl font-bold uppercase mb-6">
          Create Account
        </h2>

        {/* Display error if any */}
        {error && (
          <p className="text-center text-red-600 mb-4">{error}</p>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
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

          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-1">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
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

          {/* Confirm Password */}
          <div>
            <label htmlFor="password2" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              id="password2"
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Confirm your password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </div>

          {/* reCAPTCHA */}
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey="6LfC-44rAAAAAGJpGPNjgSw1skQHi3bNU550XEQE"
              onChange={(token) => setRecaptchaToken(token)}
              onExpired={() => {
                setRecaptchaToken("");
                setError("reCAPTCHA expired. Please complete it again.");
              }}
            />
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-center text-sm">
            <input
              id="acceptTerms"
              type="checkbox"
              className="h-4 w-4 text-blue-950 border-gray-300 rounded"
              checked={acceptTerms}
              onChange={() => setAcceptTerms(!acceptTerms)}
            />
            <label htmlFor="acceptTerms" className="ml-2 text-gray-700">
              By proceeding, I acknowledge that I have read and accept Travelbeta's Terms & Conditions
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#FFC107] text-black font-bold py-3 rounded mt-2 hover:bg-[#e6ac0c] transition-colors"
          >
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-4 text-sm text-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline no-underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
