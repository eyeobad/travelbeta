// src/components/HotelSearchResults.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useProductContext } from '../user/Produuctcontext';

export default function HotelSearchResults() {
  const { state } = useLocation();
  const { searchParams = {} } = state || {};
  const { hotelOffers: offers } = useProductContext();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(offers.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedOffers = offers.slice(startIdx, startIdx + itemsPerPage);

  // Helper to generate page numbers with ellipsis
  const getPageNumbers = () => {
    const delta = 1;
    let range = [];
    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    if (range[0] > 2) range.unshift('...');
    if (range[0] !== 1) range.unshift(1);
    if (range[range.length - 1] < totalPages - 1) range.push('...');
    if (range[range.length - 1] !== totalPages) range.push(totalPages);
    return range;
  };

  return (
    <div className="p-4">
      {/* Display search parameters */}
      <div className="mb-6 bg-[#FFC107] text-black p-4 rounded flex flex-col md:flex-row justify-between items-center">
        <span className="mb-2 md:mb-0">
          {searchParams.hotelLocation}
        </span>
        <span className="mb-2 md:mb-0">
          Check-in: {searchParams.checkInDate}
        </span>
        <span className="mb-2 md:mb-0">
          Check-out: {searchParams.checkOutDate}
        </span>
        <span>
          {searchParams.rooms} Room, {searchParams.guests} Guest
        </span>
      </div>

      {/* Hotel offers list */}
      <div>
        {paginatedOffers.length > 0 ? (
          paginatedOffers.map((offer, idx) => (
            <div
              key={offer.id || idx}
              className="p-4 bg-white rounded shadow mb-4"
            >
              <div className="font-bold text-xl">
                {offer.name || 'Hotel Name'}
              </div>
              <div className="text-gray-600">
                {offer.address || 'Hotel Address'}
              </div>
              <div className="text-lg font-semibold mt-2">
                Price: ₦{Number(offer.price).toLocaleString()}
              </div>
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
                View
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No hotels match your search criteria.
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 transition-colors"
          >
            Previous
          </button>

          {getPageNumbers().map((page, idx) =>
            page === '...' ? (
              <span key={idx} className="px-2">
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded transition-colors ${
                  currentPage === page
                    ? 'bg-[#FFC107] text-black'
                    : 'bg-gray-100'
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
