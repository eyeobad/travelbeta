import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuthContext } from "../user/Authcontext";

const ProductContext = createContext();
export const useProductContext = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  // ──────────────────────────────────────────────────────────────
  // Search results (Amadeus)
  // ──────────────────────────────────────────────────────────────
  const [flightOffers, setFlightOffers] = useState([]);
  const [hotelOffers, setHotelOffers] = useState([]);
  const [shortletOffers, setShortletOffers] = useState([]);

  // ──────────────────────────────────────────────────────────────
  // Autocomplete suggestions
  // ──────────────────────────────────────────────────────────────
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [hotelSuggestions, setHotelSuggestions] = useState([]);
  const [shortletSuggestions, setShortletSuggestions] = useState([]);

  // ──────────────────────────────────────────────────────────────
  // Other products
  // ──────────────────────────────────────────────────────────────
  const [carRentals, setCarRentals] = useState([]);
  const [vacations, setVacations] = useState([]);
  const [vacationDetail, setVacationDetail] = useState(null);
  const [mapDestinations, setMapDestinations] = useState([]);

  // ──────────────────────────────────────────────────────────────
  // Loading & Error Logging
  // ──────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const logError = (context, error) => {
    console.error(`Error in ${context}:`, error.message);
    if (error.stack) console.error(error.stack);
  };

  // ──────────────────────────────────────────────────────────────
  // Get authTokens from AuthContext
  // ──────────────────────────────────────────────────────────────
  const { authTokens } = useAuthContext();

  // ──────────────────────────────────────────────────────────────
  // 1) Flight search (POST /flight-bookings/)
  // ──────────────────────────────────────────────────────────────
  const searchFlights = useCallback(
    async ({
      origin,
      destination,
      date,
      returnDate = "",
      adults = 1,
      cabin = "economy",
      searchHotel = false,
    }) => {
      setLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:8000/flight-bookings/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authTokens ? `Bearer ${authTokens.access}` : "",
          },
          body: JSON.stringify({
            origin: origin,
            destination: destination,
            departure_date: date,
            returnDate: returnDate,
            adults: adults,
            flight_class: cabin,
            search_hotel: searchHotel,
          }),
        });
        if (!res.ok) throw new Error(res.statusText);
        const payload = await res.json();
        setFlightOffers(payload.data || []);
      } catch (err) {
        logError("searchFlights", err);
      } finally {
        setLoading(false);
      }
    },
    [authTokens]
  );

  // ──────────────────────────────────────────────────────────────
  // 3) Hotel search (POST /hotel-bookings/) - UPDATED
  // ──────────────────────────────────────────────────────────────
  const searchHotels = useCallback(
    async ({ cityCode, checkInDate, checkOutDate, adults, rooms }) => {
      setLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:8000/hotel-bookings/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authTokens ? `Bearer ${authTokens.access}` : "",
          },
          body: JSON.stringify({
            cityCode: cityCode, // Use cityCode
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            adults: adults,
            rooms: rooms,
          }),
        });
        
        const payload = await res.json();
        if (!res.ok) {
          console.error("Hotel search error:", payload);
          throw new Error(payload.error || "Hotel search failed");
        }
        setHotelOffers(payload.data || []);
      } catch (err) {
        console.error("Hotel search failed:", err);
        setHotelOffers([]);
        throw err; // Re-throw error for the component to catch
      } finally {
        setLoading(false);
      }
    },
    [authTokens]
  );
  // ──────────────────────────────────────────────────────────────
  // 4) Shortlet search (POST /shortlet-bookings/)
  // ──────────────────────────────────────────────────────────────
  const searchShortlets = useCallback(
    async ({ cityCode, checkInDate, checkOutDate, adults = 1 }) => {
      setLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:8000/shortlet-bookings/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city_code: cityCode,
            check_in_date: checkInDate,
            check_out_date: checkOutDate,
            adults,
          }),
        });
        if (!res.ok) throw new Error(res.statusText);
        const payload = await res.json();
        setShortletOffers(payload.data || []);
      } catch (err) {
        logError("searchShortlets", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ──────────────────────────────────────────────────────────────
  // 5) Autocomplete lookups
  // ──────────────────────────────────────────────────────────────
  const fetchLocationSuggestions = useCallback(async (q) => {
    if (!q) return setLocationSuggestions([]);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/locations/?q=${encodeURIComponent(q)}`
      );
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setLocationSuggestions(data);
    } catch (err) {
      logError("fetchLocationSuggestions", err);
    }
  }, []);

  const fetchHotelSuggestions = useCallback(async (q) => {
    if (!q) return setHotelSuggestions([]);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/hotels/?q=${encodeURIComponent(q)}`
      );
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setHotelSuggestions(data);
    } catch (err) {
      logError("fetchHotelSuggestions", err);
    }
  }, []);

  const fetchShortletSuggestions = useCallback(async (q) => {
    if (!q) return setShortletSuggestions([]);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/shortlets/?q=${encodeURIComponent(q)}`
      );
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setShortletSuggestions(data);
    } catch (err) {
      logError("fetchShortletSuggestions", err);
    }
  }, []);

  // ──────────────────────────────────────────────────────────────
  // 6) Other product fetchers: Car Rentals, Vacations, Map
  // ──────────────────────────────────────────────────────────────
  const fetchCarRentals = useCallback(async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/car-rentals/");
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setCarRentals(data);
    } catch (err) {
      logError("fetchCarRentals", err);
    }
  }, []);

  const fetchVacations = useCallback(async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/vacations/");
      if (!res.ok) throw new Error(res.statusText);
      let data = await res.json();
      data = data.map((vac, idx) => ({
        ...vac,
        id: vac.id || vac.package_name || vac.created_at || `vacation-${idx}`,
      }));
      setVacations(data);
    } catch (err) {
      logError("fetchVacations", err);
    }
  }, []);

  const fetchVacationDetail = useCallback(async (id) => {
    if (!id) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/vacations/${id}/`);
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setVacationDetail(data);
    } catch (err) {
      logError("fetchVacationDetail", err);
    }
  }, []);

  const fetchMapDestinations = useCallback(async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/map-destinations/");
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setMapDestinations(data);
    } catch (err) {
      logError("fetchMapDestinations", err);
    }
  }, []);

  // ──────────────────────────────────────────────────────────────
  // Initial load: Car rentals, vacations, and map data
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchCarRentals();
    fetchVacations();
    fetchMapDestinations();
  }, [fetchCarRentals, fetchVacations, fetchMapDestinations]);

  // ──────────────────────────────────────────────────────────────
  // Context value
  // ──────────────────────────────────────────────────────────────
  const contextValue = {
    // Search results
    flightOffers,
    hotelOffers,
    shortletOffers,

    // Autocomplete suggestions
    locationSuggestions,
    hotelSuggestions,
    shortletSuggestions,

    // Other products
    carRentals,
    vacations,
    vacationDetail,
    mapDestinations,

    // Loading state
    loading,

    // Actions
    searchFlights,
    searchHotels,
    searchShortlets,
    fetchLocationSuggestions,
    fetchHotelSuggestions,
    fetchShortletSuggestions,
    fetchCarRentals,
    fetchVacations,
    fetchVacationDetail,
    fetchMapDestinations,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
