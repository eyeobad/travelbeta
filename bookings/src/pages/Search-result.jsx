// src/components/FlightSearchResults.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useProductContext } from "../user/Produuctcontext";

// ────────────────────────────────
// Filter panel
// ────────────────────────────────
export function FilterPanel({ filters, setFilters }) {
  const { price, stops, cabin, refundable, airlines } = filters;
  return (
    <aside className="w-full md:w-64 p-4 bg-gray-100 border-r border-gray-300">
      <h2 className="font-bold mb-4 text-lg">Filter</h2>

      {/* Price */}
      <div className="mb-6">
        <label className="block text-sm mb-1">
          Price (max €{price.maxLimit.toLocaleString()})
        </label>
        <input
          type="range"
          min={0}
          max={price.maxLimit}
          value={price.current}
          onChange={(e) =>
            setFilters({
              ...filters,
              price: { ...price, current: +e.target.value },
            })
          }
          className="w-full"
        />
        <div className="text-xs text-gray-600 mt-1">
          Up to €{price.current.toLocaleString()}
        </div>
      </div>

      {/* Stops */}
      <div className="mb-6">
        <span className="block text-sm font-semibold mb-1">Stops</span>
        {[0, 1, 2].map((n) => (
          <label key={n} className="flex items-center text-sm mb-1">
            <input
              type="checkbox"
              checked={stops.includes(n)}
              onChange={() => {
                const s = new Set(stops);
                s.has(n) ? s.delete(n) : s.add(n);
                setFilters({ ...filters, stops: Array.from(s) });
              }}
              className="mr-2"
            />
            {n} stop{n !== 1 && "s"}
          </label>
        ))}
      </div>

      {/* Cabin */}
      <div className="mb-6">
        <span className="block text-sm font-semibold mb-1">Class</span>
        <label className="flex items-center text-sm mb-1">
          <input
            type="radio"
            name="cabin"
            value="ECONOMY"
            checked={cabin === "ECONOMY"}
            onChange={() => setFilters({ ...filters, cabin: "ECONOMY" })}
            className="mr-2"
          />
          Economy
        </label>
        <label className="flex items-center text-sm mb-1">
          <input
            type="radio"
            name="cabin"
            value="PREMIUM_ECONOMY"
            checked={cabin === "PREMIUM_ECONOMY"}
            onChange={() =>
              setFilters({ ...filters, cabin: "PREMIUM_ECONOMY" })
            }
            className="mr-2"
          />
          Premium Economy
        </label>
        <label className="flex items-center text-sm mb-1">
          <input
            type="radio"
            name="cabin"
            value="BUSINESS"
            checked={cabin === "BUSINESS"}
            onChange={() => setFilters({ ...filters, cabin: "BUSINESS" })}
            className="mr-2"
          />
          Business Class
        </label>
        <label className="flex items-center text-sm">
          <input
            type="radio"
            name="cabin"
            value="FIRST"
            checked={cabin === "FIRST"}
            onChange={() => setFilters({ ...filters, cabin: "FIRST" })}
            className="mr-2"
          />
          First Class
        </label>
      </div>

      {/* Refundable */}
      <div className="mb-6">
        <span className="block text-sm font-semibold mb-1">Refundable</span>
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            checked={refundable}
            onChange={() =>
              setFilters({ ...filters, refundable: !refundable })
            }
            className="mr-2"
          />
          Refundable
        </label>
      </div>

      {/* Airlines */}
      <div className="mb-6">
        <span className="block text-sm font-semibold mb-1">Airlines</span>
        {airlines.map((code) => (
          <label key={code} className="flex items-center text-sm mb-1">
            <input
              type="checkbox"
              checked={filters.airlines.includes(code)}
              onChange={() => {
                const s = new Set(filters.airlines);
                s.has(code) ? s.delete(code) : s.add(code);
                setFilters({ ...filters, airlines: Array.from(s) });
              }}
              className="mr-2"
            />
            {code}
          </label>
        ))}
      </div>

      <button
        onClick={() =>
          setFilters({
            price: { ...price, current: price.maxLimit },
            stops: [],
            cabin: "",
            refundable: false,
            airlines: [],
          })
        }
        className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded transition-colors"
      >
        Reset Filters
      </button>
    </aside>
  );
}

// ────────────────────────────────
// Flight result card
// ────────────────────────────────
export function FlightResultCard({ offer, dicts = {} }) {
  const itin = offer.itineraries[0];
  const first = itin.segments[0];
  const last = itin.segments[itin.segments.length - 1];
  const priceVal = offer.price.grandTotal || offer.price.total;
  const currency =
    dicts.currencies?.[offer.price.currency] || offer.price.currency;
  const stops = itin.segments.length - 1;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white mb-4 rounded shadow hover:shadow-lg transition-shadow">
      <div>
        <div className="font-semibold text-lg">
          {first.departure.iataCode} → {last.arrival.iataCode}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {new Date(first.departure.at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          –{" "}
          {new Date(last.arrival.at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {stops} stop{stops !== 1 && "s"}
        </div>
      </div>
      <div className="mt-3 md:mt-0 text-right">
        <div className="text-xl font-bold text-blue-600">
          {currency} {parseFloat(priceVal).toLocaleString()}
        </div>
        <button className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
          View
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────
// List of flight offers
// ────────────────────────────────
export function FlightOffersList({ offers = [], dicts = {} }) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Flight Offers</h2>
      {offers.length > 0 ? (
        offers.map((o) => (
          <FlightResultCard key={o.id} offer={o} dicts={dicts} />
        ))
      ) : (
        <p className="text-center text-gray-500">
          No flights match your filters.
        </p>
      )}
    </div>
  );
}

// ────────────────────────────────
// Main results component using useLocation and ProductContext
// ────────────────────────────────
export default function FlightSearchResults() {
  const location = useLocation();
  const { searchParams = {} } = location.state || {};
  const { flightOffers: offers, dicts = {} } = useProductContext();

  // Calculate max price & airlines from offers
  const maxPrice =
    offers.length > 0
      ? Math.max(
          ...offers.map((o) =>
            parseFloat(o.price.grandTotal || o.price.total)
          )
        )
      : 0;
  const uniqueAirlines = Array.from(
    new Set(offers.map((o) => o.validatingAirlineCodes[0]))
  );

  const [filters, setFilters] = useState({
    price: { current: maxPrice, maxLimit: maxPrice },
    stops: [],
    cabin: "",
    refundable: false,
    airlines: uniqueAirlines,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter the offers with dynamic cabin extraction (normalized)
  const filtered = offers.filter((o) => {
    const priceVal = parseFloat(o.price.grandTotal || o.price.total);
    if (priceVal > filters.price.current) return false;

    const stopsCount = o.itineraries[0].segments.length - 1;
    if (filters.stops.length && !filters.stops.includes(stopsCount))
      return false;

    if (filters.cabin) {
      const cabinCode =
        o.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin;
      if (
        !cabinCode ||
        cabinCode.toLowerCase() !==
          filters.cabin.replace(/_/g, " ").toLowerCase()
      ) {
        return false;
      }
    }

    if (
      filters.airlines.length &&
      !filters.airlines.includes(o.validatingAirlineCodes[0])
    )
      return false;

    return true;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIdx, startIdx + itemsPerPage);

  // Smart pagination helper
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
    if (range[0] > 2) range.unshift("...");
    if (range[0] !== 1) range.unshift(1);
    if (range[range.length - 1] < totalPages - 1) range.push("...");
    if (range[range.length - 1] !== totalPages) range.push(totalPages);
    return range;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <FilterPanel filters={filters} setFilters={setFilters} />
      <div className="flex-1 p-4">
        <div className="mb-6 bg-[#FFC107] text-black p-4 rounded flex flex-col md:flex-row justify-between items-center">
          <span className="mb-2 md:mb-0">
            {searchParams.origin} → {searchParams.destination}
          </span>
          <span className="mb-2 md:mb-0">{searchParams.date}</span>
          <span>
            {searchParams.passengers} Adult
            {searchParams.passengers > 1 && "s"}, {searchParams.cabin}
          </span>
        </div>

        <FlightOffersList offers={paginated} dicts={dicts} />

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 transition-colors"
            >
              Previous
            </button>

            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={idx} className="px-2">
                  …
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded transition-colors ${
                    currentPage === page
                      ? "bg-[#FFC107] text-black"
                      : "bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
