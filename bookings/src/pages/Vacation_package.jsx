import React, { useState } from "react";
import { useProductContext } from "../user/Produuctcontext"; // Adjust the path as needed
import vacationBanner from "../images/vacation.png";
import { Link } from "react-router-dom";

export default function VacationPackages() {
  const { vacations, loading } = useProductContext();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  if (loading) {
    return <div className="text-center py-8">Loading vacation packages...</div>;
  }

  const totalVacations = vacations.length;
  const totalPages = Math.ceil(totalVacations / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentVacations = vacations.slice(indexOfFirst, indexOfLast);

  return (
    <div className="w-full">
      {/* Top banner */}
      <div
        className="bg-cover bg-center h-56 flex items-center justify-center"
        style={{ backgroundImage: `url(${vacationBanner})` }}
      >
        {/* Optionally add a title here */}
      </div>

      {/* Vacation Packages Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentVacations.map((vac, idx) => {
            console.log("Vacation object:", vac);
            // Attempt to extract a unique identifier.
            const id = vac?.id || vac?._id || vac?.package_name || vac?.created_at || `vacation-${idx}`;

            // If we end up with a fallback, warn in the console.
            if (!vac?.id && !vac?._id) {
              console.warn("Vacation object is missing a valid 'id':", vac);
            }

            // Only allow navigation if a valid id is present.
            const linkPath = (vac?.id || vac?._id) ? `/vacation/${vac.id || vac._id}` : "#";

            return (
              <div key={id} className="bg-white shadow rounded-lg overflow-hidden">
                <img
                  src={vac.cover_image || vac.image}
                  alt={vac.package_name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-800 mb-2">
                    {vac.package_name}
                  </h2>
                  <p className="text-xl font-extrabold text-gray-900 mb-1">
                    ₦{Number(vac.price).toLocaleString()}
                  </p>
                  <Link
                    to={linkPath}
                    className="bg-[#FFC107] text-black font-bold py-2 px-4 rounded hover:bg-[#e6ac0c] transition-colors no-underline"
                  >
                    Reserve Packages
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
