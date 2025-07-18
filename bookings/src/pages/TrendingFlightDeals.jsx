// src/components/TrendingFlightDeals.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductContext } from '../user/Produuctcontext';
import flight from '../images/Flight_deal.png';

// ────────────────────────────────
// Chevron Icons
// ────────────────────────────────
export const ChevronLeftIcon = ({ style }) => (
  <svg style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
);
export const ChevronRightIcon = ({ style }) => (
  <svg style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
  </svg>
);

// ────────────────────────────────
// Static routes & default fallbacks
// ────────────────────────────────
const trendingRoutes = [
  { origin: 'LOS', destination: 'LON', label: 'Lagos → London' },
  { origin: 'LOS', destination: 'ACC', label: 'Lagos → Accra' },
  { origin: 'LOS', destination: 'YYZ', label: 'Lagos → Toronto' },
];

const staticDefaults = {
  LOS_LON: 1411936,
  LOS_ACC: 460275,
  LOS_YYZ: 1851943,
};

export default function TrendingFlightDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { searchFlights } = useProductContext();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Always search for tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const departureDate = tomorrow.toISOString().split('T')[0];

        const fetched = await Promise.all(
          trendingRoutes.map(async (route) => {
            const query = {
              origin: route.origin,
              destination: route.destination,
              departure_date: departureDate,
              return_date: '',
              adults: 1,
              flight_class: 'economy',
              search_hotel: false,
            };

            const res = await fetch('http://127.0.0.1:8000/flight-bookings/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(query),
            });
            const payload = await res.json();
            console.log('Trending deal payload for', route, payload);

            // Adjust to your actual shape
            const offer = Array.isArray(payload.data) ? payload.data[0] : null;
            // Amadeus often returns price.total as a string, so convert:
            const rawPrice = offer?.price?.total ?? null;
            const numericPrice =
              rawPrice != null
                ? Number(rawPrice)
                : staticDefaults[`${route.origin}_${route.destination}`];

            return {
              ...route,
              price: numericPrice,
              date: departureDate,
              carrier: offer?.validatingAirlineCodes?.[0] || '',
              rawOffer: offer,
            };
          })
        );

        setDeals(fetched);
      } catch (err) {
        console.error('Error fetching trending deals:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleBook = async (deal) => {
    // Build the search query from the trending deal
    const query = {
      origin: deal.origin,
      destination: deal.destination,
      date: deal.date,
      returnDate: '',
      adults: 1,
      cabin: 'economy',
      searchHotel: false,
    };

    // Use the ProductContext's searchFlights function to fetch and store the results.
    await searchFlights(query);

    // Navigate to the search result page. The results will be read from the context.
    navigate('/flights-search-result', {
      state: {
        searchParams: {
          origin: deal.origin,
          destination: deal.destination,
          date: deal.date,
          passengers: 1,
          cabin: 'economy',
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="my-8 max-w-6xl mx-auto px-4 text-center">
        <p>Loading trending deals…</p>
      </div>
    );
  }

  return (
    <div className="my-8 max-w-6xl mx-auto px-4">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Trending Flight Deals
          </h2>
          <p className="text-gray-500">
            Get the best flight deals, airline specials and promotions.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <a
            href="/search-flight"
            className="flex items-center text-blue-950 font-bold"
          >
            View More deals&nbsp;
            <ChevronRightIcon style={{ width: '1em', height: '1em' }} />
          </a>
        </div>
      </div>

      {/* Deal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {deals.map((d) => (
          <div key={d.destination} className="bg-white shadow rounded overflow-hidden">
            <div className="relative">
              <span className="absolute top-2 right-2 bg-blue-950 text-white text-xs font-bold py-1 px-2 rounded">
                Top flight deal
              </span>
              <img src={flight} alt="Flight background" className="w-full" />
            </div>
            <div className="p-4">
              <h5 className="text-lg font-bold mb-1">{d.label}</h5>
              <p className="text-2xl font-bold mb-1">
                ₦{d.price.toLocaleString()}
              </p>
              <p className="text-gray-500 text-sm mb-1">
                {new Date(d.date).toDateString()}
              </p>
              <div className="mb-2">
                {d.carrier && (
                  <img
                    src={`/images/airlines/${d.carrier}.png`}
                    alt={d.carrier}
                    className="max-h-5 mx-auto"
                  />
                )}
              </div>
              <button
                onClick={() => handleBook(d)}
                className="w-full bg-blue-950 text-white py-2 rounded"
              >
                Book Flight
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
