import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/213ba61d1043759862a00a57eed32c60_zbufwb.png";
import placeholderImg from "../images/placeholder.jpg"; // Placeholder image for profile
import {
  FaPlane,
  FaBed,
  FaUmbrellaBeach,
  FaPassport,
  FaHome,
  FaUser,
  FaComments,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

// Import AuthContext to get profile data
import { useAuthContext } from "../user/Authcontext";

export default function Dashboard() {
  // Access user profile from AuthContext
  const { profile } = useAuthContext();

  // Example states for dynamic data
  const [flightCount, setFlightCount] = useState(0);
  const [hotelCount, setHotelCount] = useState(0);
  const [packageCount, setPackageCount] = useState(0);
  const [visaCount, setVisaCount] = useState(0);

  const navigate = useNavigate();

  // State for mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Track which section is active: "dashboard" or "account"
  const [activeTab, setActiveTab] = useState("dashboard");

  // Sidebar navigation items (now buttons to switch tabs)
  const navLinks = [
    { name: "Dashboard", icon: <FaHome />, tabKey: "dashboard" },
    { name: "Account", icon: <FaUser />, tabKey: "account" },
    { name: "Chat", icon: <FaComments />, tabKey: "chat" }, // Example if you plan to add a Chat tab
  ];

  const handleLogout = () => {
    // Your logout logic here
    console.log("User logged out");
    setSidebarOpen(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-blue-900 text-white flex items-center justify-between p-4">
        <Link to="/" onClick={() => setSidebarOpen(false)}>
          <img src={logo} alt="logo" className="w-32" />
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="focus:outline-none"
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-blue-900 text-white px-4 py-6 fixed lg:relative inset-y-0 left-0 transform transition-transform duration-300 ease-in-out w-64 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="mb-8">
          <Link to="/" onClick={() => setSidebarOpen(false)}>
            <img src={logo} alt="logo" className="w-40" />
          </Link>
        </div>

        {/* Sidebar navigation */}
        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                setActiveTab(link.tabKey);
                setSidebarOpen(false);
              }}
              className="flex items-center gap-2 py-2 px-2 w-full text-left rounded text-white hover:bg-blue-800"
            >
              {link.icon}
              <span>{link.name}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-blue-700 pt-4">
          <button
            onClick={handleLogout}
            className="w-full text-left py-2 px-2 rounded hover:bg-blue-800 focus:outline-none cursor-pointer text-gray-200"
          >
            <FaSignOutAlt className="inline mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:ml-64 mt-4 lg:mt-0">
        {/* Conditionally render Dashboard or Account view */}
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">
              Welcome, {profile?.first_name || "User"}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Flights Card */}
              <div className="bg-white shadow rounded p-4 flex flex-col items-start">
                <div className="flex items-center gap-2 mb-2">
                  <FaPlane className="text-gray-600 text-xl" />
                  <h2 className="text-lg font-bold">Flights Booked</h2>
                </div>
                <p className="text-4xl font-extrabold text-gray-800 mb-4">
                  {flightCount}
                </p>
                <Link
                  to="/book-flight"
                  className="bg-[#FFC107] text-black font-bold py-2 px-4 rounded hover:bg-[#e6ac0c] transition-colors no-underline"
                >
                  Book Flight
                </Link>
                <Link
                  to="/previous-flights"
                  className="mt-2 text-sm text-blue-600 hover:underline no-underline"
                >
                  View previous bookings
                </Link>
              </div>

              {/* Hotels Card */}
              <div className="bg-white shadow rounded p-4 flex flex-col items-start">
                <div className="flex items-center gap-2 mb-2">
                  <FaBed className="text-gray-600 text-xl" />
                  <h2 className="text-lg font-bold">Hotels Booked</h2>
                </div>
                <p className="text-4xl font-extrabold text-gray-800 mb-4">
                  {hotelCount}
                </p>
                <Link
                  to="/book-hotel"
                  className="bg-[#FFC107] text-black font-bold py-2 px-4 rounded hover:bg-[#e6ac0c] transition-colors no-underline"
                >
                  Book Hotels
                </Link>
                <Link
                  to="/previous-hotels"
                  className="mt-2 text-sm text-blue-600 hover:underline no-underline"
                >
                  View previous bookings
                </Link>
              </div>

              {/* Packages Card */}
              <div className="bg-white shadow rounded p-4 flex flex-col items-start">
                <div className="flex items-center gap-2 mb-2">
                  <FaUmbrellaBeach className="text-gray-600 text-xl" />
                  <h2 className="text-lg font-bold">Vacations Booked</h2>
                </div>
                <p className="text-4xl font-extrabold text-gray-800 mb-4">
                  {packageCount}
                </p>
                <Link
                  to="/book-package"
                  className="bg-[#FFC107] text-black font-bold py-2 px-4 rounded hover:bg-[#e6ac0c] transition-colors no-underline"
                >
                  Book Packages
                </Link>
                <Link
                  to="/previous-packages"
                  className="mt-2 text-sm text-blue-600 hover:underline no-underline"
                >
                  View previous bookings
                </Link>
              </div>

              {/* Visa Card */}
              <div className="bg-white shadow rounded p-4 flex flex-col items-start">
                <div className="flex items-center gap-2 mb-2">
                  <FaPassport className="text-gray-600 text-xl" />
                  <h2 className="text-lg font-bold">Visa Applications</h2>
                </div>
                <p className="text-4xl font-extrabold text-gray-800 mb-4">
                  {visaCount}
                </p>
                <Link
                  to="/apply-visa"
                  className="bg-[#FFC107] text-black font-bold py-2 px-4 rounded hover:bg-[#e6ac0c] transition-colors no-underline"
                >
                  Book Visa
                </Link>
                <Link
                  to="/previous-visas"
                  className="mt-2 text-sm text-blue-600 hover:underline no-underline"
                >
                  View previous bookings
                </Link>
              </div>
            </div>
          </div>
        )}

{activeTab === "account" && (
  <div className="p-4 md:p-6">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">Account</h2>

    <div className="flex flex-col md:flex-row items-center md:items-start bg-white shadow-md rounded-lg p-6">
      {profile?.image ? (
        <img
          src={profile.image}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mr-4 border-4 border-gray-200"
        />
      ) : (
        <img
          src={placeholderImg}
          alt="Placeholder"
          className="w-24 h-24 rounded-full object-cover mr-4 border-4 border-gray-200"
        />
      )}

      <div className="text-center md:text-left">
        <p className="text-xl font-semibold text-gray-900">
          {profile?.first_name} {profile?.last_name}
        </p>
        <p className="text-gray-600">{profile?.email}</p>
      </div>
    </div>

    <div className="bg-white border border-blue-100 rounded-lg p-6 mt-6">
      <h3 className="text-lg font-bold text-blue-900 mb-2">Traveler's Information</h3>
      <p className="text-gray-400 ">Passengers details must be entered as it appears on the passport or ID.</p>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">First Name</label>
        <p className="border rounded px-3 py-2 bg-white text-gray-800">{profile?.first_name}</p>
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">Last Name</label>
        <p className="border rounded px-3 py-2 bg-white text-gray-800">{profile?.last_name}</p>
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <p className="border rounded px-3 py-2 bg-gray-100 text-gray-600">{profile?.email}</p>
      </div>
      <button className="w-full md:w-auto bg-gray-300 text-black font-bold py-2 px-4 rounded-lg hover:bg-[#e6ac0c] transition mt-2">
        Submit
      </button>
    </div>
  </div>
)}


        {/* If you add a "chat" tab in future, you can handle it like this: */}
        {activeTab === "chat" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Chat</h2>
            <p>Chat content goes here...</p>
          </div>
        )}
      </main>
    </div>
  );
}
