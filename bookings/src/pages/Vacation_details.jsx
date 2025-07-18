import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useProductContext } from "../user/Produuctcontext"; // adjust the path as needed

export default function VacationDetails() {
  const { vacationId } = useParams();
  const navigate = useNavigate();
  const { vacationDetail, fetchVacationDetail } = useProductContext();

  useEffect(() => {
    if (!vacationId) {
      console.warn("No vacationId parameter found in URL.");
      // Optionally redirect if no valid ID is present:
      // navigate("/vacation");
      return;
    }
    fetchVacationDetail(vacationId);
  }, [vacationId, fetchVacationDetail, navigate]);

  // If vacationDetail is missing or empty, show a message.
  if (!vacationDetail || Object.keys(vacationDetail).length === 0) {
    return <div className="text-center py-8 text-red-600">Vacation not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Cover Image with Overlay Title */}
      {vacationDetail.cover_image && (
        <div
          className="w-full h-96 bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url(${vacationDetail.cover_image})` }}
        >
          <div className="bg-black bg-opacity-50 h-full flex items-center justify-center">
            <h1 className="text-4xl text-white font-bold">
              {vacationDetail.package_name || "Vacation Package"}
            </h1>
          </div>
        </div>
      )}

      <div className="mt-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {vacationDetail.package_name || "Vacation Package"}
            </h2>
            <p className="text-xl text-gray-600">
              {vacationDetail.destination || "Destination"}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-2xl font-bold text-green-600">
              ₦{Number(vacationDetail.price).toLocaleString() || "0"}
            </p>
          </div>
        </div>

        {/* Travel Dates and Additional Info */}
        <div className="mt-4 text-gray-700">
          {vacationDetail.departure_date && vacationDetail.return_date && (
            <p>
              <strong>Travel Dates:</strong> {vacationDetail.departure_date} -{" "}
              {vacationDetail.return_date}
            </p>
          )}
          <p>
            <strong>Adults:</strong> {vacationDetail.number_of_adults || "N/A"}
          </p>
          {vacationDetail.room_type && (
            <p>
              <strong>Room:</strong> {vacationDetail.room_type} |{" "}
              <strong>Nights:</strong> {vacationDetail.number_of_nights || "N/A"}
            </p>
          )}
        </div>

        {/* Description Section */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Description</h3>
          <p className="text-gray-700">
            {vacationDetail.description || "No description provided."}
          </p>
        </div>

        {/* Itinerary Section */}
        {vacationDetail.itinerary && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Itinerary</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {vacationDetail.itinerary}
            </p>
          </div>
        )}

        {/* Inclusions Section */}
        {vacationDetail.inclusions && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Inclusions
            </h3>
            <p className="text-gray-700 whitespace-pre-line">
              {vacationDetail.inclusions}
            </p>
          </div>
        )}

        {/* Exclusions Section */}
        {vacationDetail.exclusions && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Exclusions
            </h3>
            <p className="text-gray-700 whitespace-pre-line">
              {vacationDetail.exclusions}
            </p>
          </div>
        )}

        {/* Additional Images */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {vacationDetail.image_2 && (
            <img
              src={vacationDetail.image_2}
              alt={`${vacationDetail.package_name || "Vacation"} additional image`}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
          {vacationDetail.image_3 && (
            <img
              src={vacationDetail.image_3}
              alt={`${vacationDetail.package_name || "Vacation"} additional image`}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Reserve Package Button */}
        <div className="mt-8 text-center">
          <Link
            to={`/reserve-vacation/${vacationId}`}
            className="inline-block bg-[#FFC107] text-black font-bold py-2 px-4 rounded hover:bg-[#e6ac0c] transition-colors no-underline"
          >
            Reserve Package
          </Link>
        </div>
      </div>
    </div>
  );
}
