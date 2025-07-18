import React, { useState } from "react";
import { Link } from "react-router-dom";

// Hero/Background Image
import hero from "../images/shutterstock_186964970.webp";
import smallogo from "../images/213ba61d1043759862a00a57eed32c60_zbufwb.png";
// Carousel Images
import blueRibbon from "../images/blue_ribbon.png";
import protocol from "../images/protocol.png";
import visa from "../images/visa.png";

// Rental & Flight Deal Images
import rentVehicle from "../images/rent-vehicle_1_mhkisc.png";

// Partner Logos
import iataLogo from "../images/iataLogoColoured.svg";
import paystackLogo from "../images/paystackLogoColoured.svg";
import amadeusLogo from "../images/amadeusLogoColoured.svg";
import flutterwaveLogo from "../images/flutterwaveLogoColoured.svg";
import interswitchLogo from "../images/InterswitchLogoColoured.svg";
// Icon Libraries
import { HomeIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import { FaPlane, FaCar, FaBuilding } from "react-icons/fa";
import {ChevronLeftIcon,ChevronRightIcon,DestinationMap,FlightSearchForm,HotelSearchForm } from './Home-dependencies'

import TrendingFlightDeals from "./TrendingFlightDeals";



const Home = () => {
  const [activeTab, setActiveTab] = useState("flights");

  

  // Switch tabs
  const handleTabClick = (tab) => setActiveTab(tab);

  // Newsletter form handler
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Subscribed!");
  };

  return (
    <div className="w-full mx-auto">
      {/* Hero Section */}
      <div
        className="w-full h-[50vh] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative z-10 flex flex-col md:items-start items-center justify-center text-white h-full">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:ps-40 md:ms-20">
            Going somewhere?
          </h1>
        </div>
      </div>

     {/* Overlaid Search Form Container */}
<div className="relative z-20 -mt-[120px] px-4">
  <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-4">
    {/* Tabs */}
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <button
        onClick={() => handleTabClick("flights")}
        className={`px-4 py-2 rounded flex items-center border-2 ${
          activeTab === "flights"
            ? "border-blue-950 bg-white text-black"
            : "bg-white text-black border-transparent"
        }`}
      >
        <FaPlane className="h-5 w-5 mr-2" />
        Flights
      </button>
      <button
        onClick={() => handleTabClick("hotels")}
        className={`px-4 py-2 rounded flex items-center border-2 ${
          activeTab === "hotels"
            ? "border-blue-950 bg-white text-black"
            : "bg-white text-black border-transparent"
        }`}
      >
        <FaBuilding className="h-5 w-5 mr-2" />
        Hotels
      </button>
      <button
        onClick={() => handleTabClick("shortlets")}
        className={`px-4 py-2 rounded flex items-center border-2 ${
          activeTab === "shortlets"
            ? "border-blue-950 bg-white text-black"
            : "bg-white text-black border-transparent"
        }`}
      >
        <HomeIcon className="h-5 w-5 mr-2" />
        Shortlets
      </button>
      <button
        onClick={() => handleTabClick("manage")}
        className={`px-4 py-2 rounded flex items-center border-2 ${
          activeTab === "manage"
            ? "border-blue-950 bg-white text-black"
            : "bg-white text-black border-transparent"
        }`}
      >
        <Cog6ToothIcon className="h-5 w-5 mr-2" />
        Manage Bookings
      </button>
  
<Link
  to="/rental"
  onClick={() => handleTabClick("rental")}
  className={`px-4 py-2 rounded flex items-center border-2 no-underline ${
    activeTab === "rental"
      ? "border-blue-950 bg-white text-black "
      : "bg-white text-black border-transparent"
  }`}
>
  <FaCar className="h-5 w-5 mr-2" />
  Car Rental
</Link>
      {/* Best deals note for larger screens */}
      <div className="ml-auto hidden lg:flex items-center gap-2">
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 20 20"
          className="h-5 w-5 text-green-500"
        >
          <path d="M6.267 3.455..." />
        </svg>
        <p className="text-sm text-gray-500">
          We offer the best deals in the industry!
        </p>
      </div>
    </div>

    {/* Flight Search Form */}
    {activeTab === "flights" && <FlightSearchForm />}

     
     {/* Hotel Search Form */}
   {activeTab === "hotels" && <HotelSearchForm/>}
       {/* shortlets Search Form */}
       {activeTab === "shortlets" && (
  <div className="relative z-30 px-4 py-4 bg-blue-950 -mx-6 -my-6 mt-1 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {/* City or Hotel Name */}
      <div className="relative bg-white rounded-lg flex flex-col px-3 py-2">
        <span className="text-xs text-gray-500">Going to?</span>
        <input
          type="text"
          placeholder="City or place name"
          className="outline-none text-sm text-gray-800"
        />
      </div>

      {/* Rooms & Guests */}
      <div className="relative bg-white rounded-lg flex flex-col px-3 py-2">
        <span className="text-xs text-gray-500">Rooms and guests</span>
        <span className="text-sm text-gray-800">1 Room, 1 Guest</span>
        {/* 
          Replace with a dropdown or custom component 
          if you want interactive selection 
        */}
      </div>

      {/* Check-in */}
      <div className="relative bg-white rounded-lg flex flex-col px-3 py-2">
        <span className="text-xs text-gray-500">Check-in</span>
        <span className="text-sm text-gray-800">Thu, Mar 27</span>
        {/* 
          Optionally use a date input:
          <input type="date" className="outline-none text-sm text-gray-800" />
        */}
      </div>

      {/* Check-out */}
      <div className="relative bg-white rounded-lg flex flex-col px-3 py-2">
        <span className="text-xs text-gray-500">Check-out</span>
        <span className="text-sm text-gray-800">Sun, Mar 30</span>
      </div>

      {/* Search Hotels Button */}
      <div className="flex items-center">
        <button className="w-full bg-[#FFC107] text-black font-bold rounded-lg px-6 py-3 hover:bg-[#e6ac0c] transition-colors">
          Search shortlets
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
  </div>
)} {/* manage Search Form */}
{activeTab === "manage" && (
  <div className="relative z-30 px-4 py-4 bg-blue-950 -mx-6 -my-6 mt-1 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
      {/* Last Name Field */}
      <div className="bg-white rounded-lg flex items-center px-3 py-2">
        <span className="text-sm text-gray-800">Last Name</span>
        {/* 
          Optionally, replace this <span> with an <input> 
          if you need user input:
          <input 
            type="text"
            placeholder="Last Name"
            className="flex-1 outline-none text-sm text-gray-800"
          />
        */}
      </div>

      {/* PNR Number Field */}
      <div className="bg-white rounded-lg flex items-center px-3 py-2">
        <span className="text-sm text-gray-800">PNR number</span>
        {/* 
          Optionally, replace this <span> with an <input> 
          if you need user input:
          <input 
            type="text"
            placeholder="PNR number"
            className="flex-1 outline-none text-sm text-gray-800"
          />
        */}
      </div>

      {/* Search Booking Button */}
      <div className="flex items-center">
        <button className="w-full bg-[#FFC107] text-black font-bold rounded-lg px-6 py-3 hover:bg-[#e6ac0c] transition-colors">
          Search Booking
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
  </div>
)}

  </div>
</div>

    {/* Static Carousel Section */}
<div className="relative bg-white p-4 my-8">
  {/* Left Navigation Button */}
  <button className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 bg-opacity-75 text-white rounded-full p-2 z-10">
    <ChevronLeftIcon style={{ width: "30px", height: "30px" }} />
  </button>

  {/* Carousel Items */}
  <div className="flex flex-col md:flex-row justify-center gap-10">
    {/* Carousel Item 1 */}
    <div className="flex flex-col md:flex-row items-center gap-4">
      <img
        src={blueRibbon}
        alt="Blue Ribbon"
        className="mx-auto"
        style={{ width: "60px" }}
      />
      <div className="text-center md:text-left">
        <h5 className="font-bold mb-1">Blue Ribbon</h5>
        <p className="text-gray-500 text-sm">
          We offer global baggage protection on all flights.
        </p>
      </div>
    </div>

    {/* Carousel Item 2 */}
    <div className="flex flex-col md:flex-row items-center gap-4">
      <img
        src={protocol}
        alt="Protocol Service"
        className="mx-auto"
        style={{ width: "60px" }}
      />
      <div className="text-center md:text-left">
        <h5 className="font-bold mb-1">Protocol Service</h5>
        <p className="text-gray-500 text-sm">
          Expedited and smooth passage through airport immigration.
        </p>
      </div>
    </div>

    {/* Carousel Item 3 */}
    <div className="flex flex-col md:flex-row items-center gap-4">
      <img
        src={visa}
        alt="Visa Assistance"
        className="mx-auto"
        style={{ width: "60px" }}
      />
      <div className="text-center md:text-left">
        <h5 className="font-bold mb-1">Visa Assistance</h5>
        <p className="text-gray-500 text-sm">
          All-inclusive visa assistance in a timely, secure manner.
        </p>
      </div>
    </div>
  </div>

  {/* Right Navigation Button */}
  <button className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 bg-opacity-75 text-white rounded-full p-2 z-10">
    <ChevronRightIcon style={{ width: "30px", height: "30px" }} />
  </button>
</div>

   {/* Trending Deals Section */}
<TrendingFlightDeals />

      {/* Vehicle Rental Section */}
      <div className="my-8 py-8 max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-4 md:mb-0">
            <img src={rentVehicle} alt="Vehicle" className="w-full rounded" />
          </div>
          <div className="md:w-1/3 md:pl-8">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
              Rent a vehicle with ease
            </h2>
            <p className="text-gray-500 mb-4">
              Enhance your driving experience with reliable vehicles in good
              condition.
            </p>
           
<Link to="/rental">
  <button className="bg-blue-950 text-white py-2 px-4 rounded inline-flex items-center">
    Rent a vehicle
    <ChevronRightIcon style={{ width: "20px", height: "20px", marginLeft: "8px" }} />
  </button>
</Link>
          </div>
        </div>
      </div>

{/* Partner Logos Section */}
<div className="my-8 max-w-6xl mx-auto px-4 overflow-hidden relative">
  {/* Marquee container is animated on mobile and static on large screens */}
  <div className="flex gap-8 animate-marquee lg:animate-none hover:pause-marquee">
    {[...Array(2)].map((_, i) =>
      [
        { name: "iata", src: iataLogo },
        { name: "paystack", src: paystackLogo },
        { name: "amadeus", src: amadeusLogo },
        { name: "flutterwave", src: flutterwaveLogo },
        { name: "interswitch", src: interswitchLogo },
      ].map((brand) => (
        <div key={`${brand.name}-${i}`} className="flex-shrink-0">
          <img
            src={brand.src}
            alt={brand.name}
            className="mx-auto grayscale hover:grayscale-0 transition duration-300"
            style={{ maxWidth: "150px" }}
          />
        </div>
      ))
    )}
  </div>

  {/* Inline styles for marquee animation */}
  <style jsx>{`
    @keyframes marquee {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }
    .animate-marquee {
      animation: marquee 20s linear infinite;
    }
    .pause-marquee:hover {
      animation-play-state: paused;
    }
  `}</style>
</div>


      {/* Newsletter Section */}
<div className="bg-gray-100 py-8">
  <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto px-4 space-y-6 md:space-y-0">
    {/* Left Side: Brand Icon and Text */}
    <div className="w-full md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left">
      {/* Brand Icon */}
      <div className=" w-24 lg:w-26 h-19 text-white flex items-center justify-center rounded">
        <img src={smallogo} alt="travelbeta"  />
      </div>
      {/* Text below icon */}
      <div className="mt-3">
        <h3 className="text-lg font-bold text-gray-800">
          Travel News & Deals
        </h3>
        <p className="text-sm text-gray-500">
          Enter your email for updates
        </p>
      </div>
    </div>

    {/* Right Side: Newsletter Form */}
    <div className="w-full md:w-2/3">
      <form onSubmit={handleSubscribe}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            type="text"
            placeholder="Your name..."
            className="border border-gray-300 rounded px-3 py-2 w-full"
            required
          />
          <input
            type="email"
            placeholder="Your email..."
            className="border border-gray-300 rounded px-3 py-2 w-full"
            required
          />
          <button
            type="submit"
            className="bg-blue-950 text-white rounded px-3 py-2 w-full"
          >
            Subscribe
          </button>
        </div>
      </form>
    </div>
  </div>
</div>


      {/* World Map Section */}
      <div className="my-8 py-8 max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
          Global Flight & Hotel Coverage
        </h2>
        <p className="text-gray-500 mb-4">
          Explore destinations and start planning your perfect trip
        </p>
        <div className="relative w-full h-96 rounded overflow-hidden">
          <DestinationMap />
        </div>
      </div>
    </div>
  );
};

export default Home;
