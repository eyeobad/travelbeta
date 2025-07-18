import React, { useState } from "react";
import { useProductContext } from "../user/Produuctcontext"; // Adjust the path as needed
import flightBanner from "../images/Flight_deal.png"; // Replace with your flight banner image
import { Link } from "react-router-dom";

export default function FlightDeals() {
  // Assuming your context provides "flights" and "loading"
  const { flights, loading } = useProductContext();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Adjust as needed

  if (loading) {
    return <div className="text-center py-8">Loading flight deals...</div>;
  }

  const totalFlights = flights.length;
  const totalPages = Math.ceil(totalFlights / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentFlights = flights.slice(indexOfFirst, indexOfLast);

  return (
    <div className="w-full">
      {/* Top banner */}
      <div
        className="bg-cover bg-center h-56 flex items-center justify-center"
        style={{ backgroundImage: `url(${flightBanner})` }}
      >
        <h1 className="text-3xl font-bold text-white">Flight Deals</h1>
      </div>

      {/* Flight Deals Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentFlights.map((flight, idx) => {
            // Extract a unique identifier
            const id =
              flight?.id ||
              flight?._id ||
              flight?.flight_name ||
              flight?.created_at ||
              `flight-${idx}`;

            // Warn if no valid id is present
            if (!flight?.id && !flight?._id) {
              console.warn("Flight object is missing a valid 'id':", flight);
            }

            // Build the link path if a valid id exists
            const linkPath = (flight?.id || flight?._id)
              ? `/flight/${flight.id || flight._id}`
              : "#";

            return (
              <div key={id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                <img
                  src={flight.cover_image || flight.image}
                  alt={flight.flight_name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-800 mb-1">
                    {flight.flight_name || "Flight Deal"}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    {flight.route || "Route information"}
                  </p>
                  <p className="text-xl font-extrabold text-gray-900 mb-3">
                    ₦{Number(flight.price).toLocaleString()}
                  </p>
                  <Link
                    to={linkPath}
                    className="block text-center bg-[#FFC107] text-black font-bold py-2 px-4 rounded hover:bg-[#e6ac0c] transition-colors no-underline"
                  >
                    Book Flight
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === idx + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
