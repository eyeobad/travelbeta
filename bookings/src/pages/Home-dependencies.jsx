// src/components/FlightSearchForm.jsx
import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaPlaneArrival, FaCalendarAlt } from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import { useAuthContext } from "../user/Authcontext";
import { useProductContext } from "../user/Produuctcontext";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";

// The TopoJSON file with world map data
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ────────────────────────────────
// RoundTripIcon
// ────────────────────────────────
export const RoundTripIcon = () => (
  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
    <path d="M10.94 2.11l1.24 4.62 2.32 1.15-1.15 2.32 4.62 1.24c.32.09.57.34.65.66l.24.91a.75.75 0 01-.74.92h-3.19l-3.12 3.12 1.54 1.54a.75.75 0 11-1.06 1.06l-2.19-2.19a.75.75 0 010-1.06l3.12-3.12v-3.19a.75.75 0 01.92-.74l.91.24c.32.08.57.33.66.65z" />
    <path d="M13.06 21.89l-1.24-4.62-2.32-1.15 1.15-2.32-4.62-1.24a.75.75 0 01-.65-.66l-.24-.91a.75.75 0 01.74-.92h3.19l3.12-3.12-1.54-1.54a.75.75 0 011.06-1.06l2.19 2.19c.29.29.29.77 0 1.06l-3.12 3.12v3.19c0 .36-.25.67-.6.73l-.91.24c-.32.08-.57.33-.65.65z" />
  </svg>
);

// ────────────────────────────────
// RoundTripIconComponent
// ────────────────────────────────
export const RoundTripIconComponent = ({
  selectedTripType,
  setSelectedTripType,
  tripOptions,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        className="text-white font-bold px-4 py-3 text-sm w-full flex items-center justify-between"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center">
          {tripOptions.find((o) => o.label === selectedTripType)?.icon}
          {selectedTripType}
        </span>
        <svg className="h-4 w-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.07l3.71-3.84a.75.75 0 111.08 1.04l-4.25 4.4a.75.75 0 01-1.08 0l-4.25-4.4a.75.75 0 01.02-1.06z" />
        </svg>
      </button>
      {open && (
        <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg z-50">
          {tripOptions.map((opt) => (
            <button
              key={opt.label}
              className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-left"
              onClick={() => {
                setSelectedTripType(opt.label);
                setOpen(false);
              }}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ────────────────────────────────
// PassengerDropdown (controlled)
// ────────────────────────────────
export const PassengerDropdown = ({ passengers, setPassengers }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        className="w-full flex items-center justify-between text-white font-bold px-4 py-3 text-sm"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-2">
          <FaUser className="h-4 w-4" />
          {passengers}
        </span>
        <svg className="h-4 w-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.07l3.71-3.84a.75.75 0 111.08 1.04l-4.25 4.4a.75.75 0 01-1.08 0l-4.25-4.4a.75.75 0 01.02-1.06z" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-64 bg-white border rounded-lg shadow-lg p-4 text-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Passengers</div>
            <div className="flex items-center gap-2">
              <button
                className="px-2 py-1 text-lg font-bold bg-gray-100 rounded"
                onClick={() => setPassengers(Math.max(1, passengers - 1))}
              >
                -
              </button>
              <span>{passengers}</span>
              <button
                className="px-2 py-1 text-lg font-bold bg-gray-100 rounded"
                onClick={() => setPassengers(passengers + 1)}
              >
                +
              </button>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="text-sm bg-yellow-400 text-black px-4 py-1 rounded"
              onClick={() => setOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ────────────────────────────────
// CabinClassDropdown (controlled)
// ────────────────────────────────
export const CabinClassDropdown = ({ travelClass, setTravelClass }) => {
  const [open, setOpen] = useState(false);
  const options = [
    "economy",
    "premium economy",
    "business class",
    "first class",
  ];
  return (
    <div className="relative">
      <button
        className="w-full flex items-center justify-between text-white font-bold px-4 py-3 text-sm"
        onClick={() => setOpen(!open)}
      >
        <span className="text-white">{travelClass}</span>
        <svg className="h-4 w-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.07l3.71-3.84a.75.75 0 111.08 1.04l-4.25 4.4a.75.75 0 01-1.08 0l-4.25-4.4a.75.75 0 01.02-1.06z" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-48 bg-white border rounded-lg shadow-lg text-black">
          {options.map((opt) => (
            <button
              key={opt}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                setTravelClass(opt);
                setOpen(false);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ────────────────────────────────
// CitySelect (uses ProductContext for autocomplete)
// ────────────────────────────────
export const CitySelect = ({ onSelect, placeholder }) => {
  const { fetchLocationSuggestions, locationSuggestions } = useProductContext();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = React.useRef();

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (open && query.length >= 2) {
      fetchLocationSuggestions(query);
    }
  }, [open, query, fetchLocationSuggestions]);

  // Update pick to display the city name in the input
  const pick = (name, code) => {
    onSelect(code);
    setQuery(name);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        className="bg-white rounded-lg flex items-center px-3 py-2 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <FaPlaneArrival className="h-4 w-4 text-black mr-2" />
        <input
          type="text"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder={placeholder || "Enter City or airport"}
          className="flex-1 outline-none text-sm text-gray-800 p-2"
        />
      </div>
      {open && (
        <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg p-2 z-50 max-h-60 overflow-auto">
          {locationSuggestions.length > 0 ? (
            locationSuggestions.map((r, index) => (
              <div
                key={`${r.iataCode}-${index}`}
                className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                onClick={() => pick(r.name, r.iataCode)}
              >
                {r.name} ({r.iataCode})
              </div>
            ))
          ) : (
            <div className="px-3 py-1 text-gray-500">
              {query.length < 2
                ? "Type at least 2 characters..."
                : "No matches found"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

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
// InteractiveMap
// ────────────────────────────────
export function DestinationMap() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    // Fetch data from your Django backend
    fetch("/api/map-destinations/")
      .then((res) => res.json())
      .then((data) => setDestinations(data))
      .catch(err => console.error("Failed to fetch map data:", err));
  }, []);

  return (
    <ComposableMap projection="geoMercator" projectionConfig={{ scale: 130 }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: { fill: "#D1E3F3", stroke: "#FFFFFF", strokeWidth: 0.75 },
                  hover: { fill: "#A0C4E3", outline: "none" },
                  pressed: { fill: "#A0C4E3", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {/* Map over the fetched data to place markers */}
        {destinations.map(({ name, coordinates }) => (
          <Marker key={name} coordinates={coordinates}>
            <circle r={3} fill="#E85A4F" />
            <text
              textAnchor="middle"
              y={-8}
              style={{ fontFamily: "system-ui", fontSize: 10, fill: "#5D5A6D" }}
            >
              {name}
            </text>
          </Marker>
        ))}
    </ComposableMap>
  );
}

// ────────────────────────────────
// FlightSearchForm
// ────────────────────────────────

export function FlightSearchForm() {
  const navigate = useNavigate();
  const { authTokens } = useAuthContext();
  const { searchFlights } = useProductContext();

  const [trip, setTrip] = useState("Round Trip");
  const tripOptions = [
    { label: "Round Trip", icon: <RoundTripIcon /> },
    { label: "One Way", icon: "✈️" },
    { label: "Multi-city", icon: "🌐" },
  ];
  const [searchHotel, setSearchHotel] = useState(false);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState("economy");
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const isIata = (c) => c && c.length === 3;
  const canSearch = isIata(origin) && isIata(destination) && pickupDate;

  const handleSearchFlights = async () => {
    if (!authTokens?.access) {
      setSearchError("You must be logged in to search flights.");
      return;
    }
    if (!canSearch) {
      setSearchError("Enter valid 3‑letter IATA codes and a departure date.");
      return;
    }

    setSearchError("");
    setLoading(true);
    await searchFlights({
      origin,
      destination,
      date: pickupDate,
      returnDate,
      adults: passengers,
      cabin: travelClass,
      searchHotel,
    });
    setLoading(false);

    // Navigate to the search results page with the search parameters.
    // FlightSearchResults will access the flight offers from the context.
    navigate("/flights-search-result", {
      state: {
        searchParams: {
          origin,
          destination,
          date: pickupDate,
          passengers,
          cabin: travelClass,
        },
      },
    });
  };

  return (
    <>
      <div className="relative z-30 -mx-6 -my-6 mt-2 px-4 py-4 bg-blue-950 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <RoundTripIconComponent
            selectedTripType={trip}
            setSelectedTripType={setTrip}
            tripOptions={tripOptions}
          />
          <PassengerDropdown
            passengers={passengers}
            setPassengers={setPassengers}
          />
          <CabinClassDropdown
            travelClass={travelClass}
            setTravelClass={setTravelClass}
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="searchHotel"
              checked={searchHotel}
              onChange={(e) => setSearchHotel(e.target.checked)}
              className="form-checkbox h-5 w-5 text-white"
            />
            <label
              htmlFor="searchHotel"
              className="ml-2 text-white font-bold text-sm"
            >
              Search Hotel
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <CitySelect onSelect={setOrigin} placeholder="From (IATA code)" />
          <CitySelect onSelect={setDestination} placeholder="To (IATA code)" />
          <div className="relative bg-white rounded-lg flex items-center px-3 py-3">
            <FaCalendarAlt className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="date"
              className="flex-1 outline-none text-sm text-gray-800"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </div>
          <div className="relative bg-white rounded-lg flex items-center px-3 py-3">
            <FaCalendarAlt className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="date"
              className="flex-1 outline-none text-sm text-gray-800"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>
          <button
            onClick={handleSearchFlights}
            disabled={!canSearch || loading}
            className={`w-full font-bold rounded-lg px-6 py-3 transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#FFC107] hover:bg-[#e6ac0c]"
            }`}
          >
            {loading ? "Searching..." : "Search Flights"}
          </button>
        </div>
        {searchError && (
          <div className="text-red-500 text-center mt-4">{searchError}</div>
        )}
      </div>
    </>
  );
}
//hotel logic

export const RoomsGuestsDropdown = ({ rooms, setRooms, guests, setGuests }) => {
  const [open, setOpen] = useState(false);

  const decreaseRooms = () => setRooms((prev) => Math.max(1, prev - 1));
  const increaseRooms = () => setRooms((prev) => prev + 1);
  const decreaseGuests = () => setGuests((prev) => Math.max(1, prev - 1));
  const increaseGuests = () => setGuests((prev) => prev + 1);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="bg-white rounded-lg px-3 py-2 w-full text-left"
      >
        <span className="text-xs text-gray-500">Rooms and guests</span>
        <div className="text-sm text-gray-800">
          {rooms} Room{rooms > 1 ? "s" : ""}, {guests} Guest{guests > 1 ? "s" : ""}
        </div>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg p-4 text-gray-800">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold">Rooms</span>
            <div className="flex items-center gap-2">
              <button
                onClick={decreaseRooms}
                className="px-2 py-1 bg-gray-100 rounded font-bold"
              >
                -
              </button>
              <span>{rooms}</span>
              <button
                onClick={increaseRooms}
                className="px-2 py-1 bg-gray-100 rounded font-bold"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold">Guests</span>
            <div className="flex items-center gap-2">
              <button
                onClick={decreaseGuests}
                className="px-2 py-1 bg-gray-100 rounded font-bold"
              >
                -
              </button>
              <span>{guests}</span>
              <button
                onClick={increaseGuests}
                className="px-2 py-1 bg-gray-100 rounded font-bold"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setOpen(false)}
              className="text-sm bg-yellow-400 text-black px-4 py-1 rounded"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export function HotelSearchForm() {
  const navigate = useNavigate();
  // Note: searchHotels and fetchHotelSuggestions will need to be updated in your context
  const { searchHotels, fetchHotelSuggestions, hotelSuggestions } = useProductContext();

  const [cityInput, setCityInput] = useState("");
  const [selectedCity, setSelectedCity] = useState(null); // Changed from selectedHotel
  const [suggestions, setSuggestions] = useState([]);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Search is now enabled when a city is selected
  const canSearch = selectedCity && checkInDate && checkOutDate;

  // Fetch city suggestions (backend now returns cities)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (cityInput.length > 2) { // Start searching after 2 characters
        fetchHotelSuggestions(cityInput);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [cityInput, fetchHotelSuggestions]);

  // Update local suggestions when context changes
  useEffect(() => {
    setSuggestions(hotelSuggestions);
  }, [hotelSuggestions]);

  // Handle selecting a city suggestion
  const handleSelectSuggestion = (suggestion) => {
    setSelectedCity(suggestion); // The suggestion is now { name: "London, GB", cityCode: "LON" }
    setCityInput(suggestion.name);
    setSuggestions([]);
  };

  // Handle the hotel search by city
  const handleSearchHotels = async () => {
    // Check for cityCode instead of hotelId
    if (!selectedCity?.cityCode) {
      setSearchError("Please select a valid city from the suggestions.");
      return;
    }
    if (!canSearch) {
      setSearchError("Please select a city and dates.");
      return;
    }

    // Date and guest validation remains the same
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (checkIn >= checkOut) {
      setSearchError("Check-out date must be after check-in date.");
      return;
    }
    if (guests < rooms) {
      setSearchError("Number of guests must be at least equal to the number of rooms.");
      return;
    }
    const adultsPerRoom = Math.floor(guests / rooms);
    if (adultsPerRoom < 1) {
      setSearchError("Each room must have at least one adult.");
      return;
    }

    setLoading(true);
    setSearchError("");

    try {
      // The searchHotels function now needs to accept a cityCode
      await searchHotels({
        cityCode: selectedCity.cityCode,
        checkInDate,
        checkOutDate,
        adults: adultsPerRoom,
        rooms,
      });

      // Navigate to results page, passing city name
      navigate("/hotel-search-result", {
        state: {
          searchParams: {
            cityName: selectedCity.name,
            checkInDate,
            checkOutDate,
            rooms,
            guests,
          },
        },
      });
    } catch (err) {
      setSearchError(err.message || "Failed to search hotels. Please check your parameters.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-30 px-4 py-4 bg-blue-950 -mx-6 -my-6 mt-1 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* City Search Input */}
        <div className="relative bg-white rounded-lg px-3 py-2">
          <span className="text-xs text-gray-500">City</span>
          <input
            type="text"
            placeholder="Search by city..."
            className="outline-none text-sm text-gray-800 w-full"
            value={cityInput}
            onChange={(e) => {
              setCityInput(e.target.value);
              setSelectedCity(null);
            }}
          />
          {suggestions.length > 0 && (
            <ul className="absolute bg-white shadow-lg rounded mt-1 w-full z-50 max-h-60 overflow-auto">
              {suggestions.map((sug) => (
                <li
                  // Use the unique cityCode for the key
                  key={sug.cityCode}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectSuggestion(sug)}
                >
                  {sug.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Rooms & Guests Dropdown */}
        <RoomsGuestsDropdown
          rooms={rooms}
          setRooms={setRooms}
          guests={guests}
          setGuests={setGuests}
        />

        {/* Check-in */}
        <div className="bg-white rounded-lg px-3 py-2">
          <span className="text-xs text-gray-500">Check-in</span>
          <input
            type="date"
            className="outline-none text-sm text-gray-800 w-full"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Check-out */}
        <div className="bg-white rounded-lg px-3 py-2">
          <span className="text-xs text-gray-500">Check-out</span>
          <input
            type="date"
            className="outline-none text-sm text-gray-800 w-full"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            min={checkInDate || new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Search Button */}
        <div className="flex items-center">
          <button
            onClick={handleSearchHotels}
            disabled={!canSearch || loading}
            className="w-full bg-[#FFC107] text-black font-bold rounded-lg px-6 py-3 hover:bg-[#e6ac0c] transition-colors disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
            <svg
              className="inline-block ml-2 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M13.17 11H4a1 1 0 110-2h9.17l-3.58-3.59a1 1 0 111.42-1.42l5.3 5.3a1 1 0 010 1.42l-5.3 5.3a1 1 0 01-1.42-1.42L13.17 11z" />
            </svg>
          </button>
        </div>
      </div>

      {searchError && (
        <p className="text-red-500 text-center text-sm mt-2">{searchError}</p>
      )}
    </div>
  );
}

const Components = {
  RoundTripIcon,
  RoundTripIconComponent,
  PassengerDropdown,
  CabinClassDropdown,
  CitySelect,
  ChevronLeftIcon,
  ChevronRightIcon,
  DestinationMap,
  FlightSearchForm,
  HotelSearchForm,
};

export default Components;
