import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../user/Authcontext";
import { FaChevronDown } from "react-icons/fa"; // Added for dropdown icon
import logo from "../images/213ba61d1043759862a00a57eed32c60_zbufwb.png";
import smalllogo from "../images/213ba61d1043759862a00a57eed32c60_zbufwb.png";
import placeholderImg from "../images/placeholder.jpg"; // Static placeholder image

const Header = () => {
  const { user, profile, logoutUser } = useAuthContext();
  const navigate = useNavigate();
  const [showMobile, setShowMobile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logoutUser();
    // Close dropdown or mobile menu as needed
    setShowDropdown(false);
    setShowMobile(false);
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setShowMobile((prev) => !prev);
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <div className="w-full">
      {/* Emergency Banner */}
      <div className="bg-blue-900 text-white w-full py-2 overflow-hidden relative">
        <div className="whitespace-nowrap animate-marquee">
          For emergency, kindly contact 07037744475 – an immediate response is assured.
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>

      {/* Main Header */}
      <header className="relative">
        <div className="bg-white shadow-sm h-20 flex items-center">
          <div className="container mx-auto px-4">
            {/* Mobile Header */}
            <div className="flex items-center justify-between lg:hidden px-4 w-full">
              <Link to="/" className="flex-1" onClick={() => setShowMobile(false)}>
                <img
                  src={smalllogo}
                  alt="TravelBeta"
                  className="max-h-10 w-auto"
                />
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="focus:outline-none ml-6"
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="w-8 h-8 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between">
              <Link to="/">
                <img src={logo} alt="TravelBeta" className="max-h-12" />
              </Link>

              <nav className="flex space-x-8">
                <Link
                  to="/?tab=hotels"
                  className="text-gray-600 hover:text-gray-900 no-underline"
                >
                  Hotel
                </Link>
                <Link
                  to="/Rental"
                  className="text-gray-600 hover:text-gray-900 no-underline"
                >
                  Car rental
                </Link>
                <Link
                  to="/vacation"
                  className="text-gray-600 hover:text-gray-900 no-underline"
                >
                  Vacation Packages
                </Link>
                <Link
                  to="/?tab=shortlets"
                  className="text-gray-600 hover:text-gray-900 no-underline"
                >
                  Shortlet
                </Link>
              </nav>

              {/* Account Actions */}
              <div className="flex items-center space-x-4 relative">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={toggleDropdown}
                      className="flex items-center focus:outline-none"
                    >
                      <img
                        src={profile?.image || placeholderImg}
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover border border-gray-300"
                      />
                      <FaChevronDown className="ml-1 text-gray-600" />
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 no-underline"
                          onClick={() => setShowDropdown(false)}
                        >
                          Profile
                        </Link>
                        <div className="border-t"></div>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none cursor-pointer"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/login"
                      className="text-gray-600 hover:text-gray-900 no-underline"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="bg-[#FFC107] text-white px-4 py-2 rounded no-underline"
                    >
                      Create account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobile && (
          <div className="fixed inset-0 bg-white z-50">
            <div className="flex items-center justify-between px-4 h-20">
              <Link to="/" onClick={toggleMobileMenu}>
                <img
                  src={smalllogo}
                  alt="TravelBeta"
                  className="max-h-12 w-auto"
                />
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="focus:outline-none"
                aria-label="Close mobile menu"
              >
                <svg
                  className="w-8 h-8 text-gray-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col mt-4 space-y-4 px-4">
              <Link
                to="/?tab=hotels"
                onClick={toggleMobileMenu}
                className="text-gray-600 hover:text-gray-900 no-underline"
              >
                Hotel
              </Link>
              <Link
                to="/vacation"
                onClick={toggleMobileMenu}
                className="text-gray-600 hover:text-gray-900 no-underline"
              >
                Vacation Packages
              </Link>
              <Link
                  to="/Rental"
                  className="text-gray-600 hover:text-gray-900 no-underline"
                >
                  Car rental
                </Link>
                <Link
                  to="/?tab=hotels"
                  className="text-gray-600 hover:text-gray-900 no-underline"
                >
                  Shortlet
                </Link>

              {/* Account Actions in Mobile Menu */}
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={toggleMobileMenu}
                    className="text-gray-600 hover:text-gray-900 no-underline"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900 text-left focus:outline-none cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={toggleMobileMenu}
                    className="text-gray-600 hover:text-gray-900 no-underline"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={toggleMobileMenu}
                    className="text-gray-600 hover:text-gray-900 no-underline"
                  >
                    Create account
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
