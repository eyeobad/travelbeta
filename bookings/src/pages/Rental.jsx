import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useProductContext } from "../user/Produuctcontext"; // Adjust the path as needed
import Swal from "sweetalert2"; // Import SweetAlert2
// Car image
import carImage from "../images/rent-vehicle_1_mhkisc.png";
// Partner Logos
import iataLogo from "../images/iataLogoColoured.svg";
import paystackLogo from "../images/paystackLogoColoured.svg";
import amadeusLogo from "../images/amadeusLogoColoured.svg";
import flutterwaveLogo from "../images/flutterwaveLogoColoured.svg";
import interswitchLogo from "../images/InterswitchLogoColoured.svg";

export default function Rental() {
  // Destructure createCarRental from the context (make sure to add this function in your context)
  const { createCarRental } = useProductContext();

  // Form states
  const [city, setCity] = useState("");
  const [carModel, setCarModel] = useState("");
  const [category, setCategory] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [extraPriceInfo, setExtraPriceInfo] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  // reCAPTCHA
  const [recaptchaToken, setRecaptchaToken] = useState("");
  // Terms & Conditions
  const [acceptTerms, setAcceptTerms] = useState(false);
  // Error state
  const [error, setError] = useState("");

  // Handle submit: uses the context function to create a new car rental booking.
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate reCAPTCHA
    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA.");
      return;
    }
    // Validate Terms
    if (!acceptTerms) {
      setError("Please accept the Terms & Conditions.");
      return;
    }

    // Prepare booking data (make sure the keys match your backend API)
    const bookingData = {
      name: "rental",
      city,
      car_model: carModel,
      category,
      pick_up_date: pickupDate,
      price_info: extraPriceInfo,
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phone,
    };

    try {
      await createCarRental(bookingData);
      console.log("Car rental created successfully.");
      // Use SweetAlert2 to show a success popup
      Swal.fire({
        title: "Submitted!",
        text: "We will contact you through your email.",
        icon: "success",
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        position: "top-right",
        showConfirmButton: false,
      });
      // Optionally, clear the form or give further feedback
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to create car rental booking. Please try again.");
    }
  };

  return (
    <>
      <div className="max-w-7xl w-full bg-white mx-auto p-6 md:p-8 mt-4">
        {error && (
          <p className="text-red-600 font-medium mb-4">{error}</p>
        )}

        <div className="md:flex md:space-x-8">
          {/* Left Column: Heading & Form */}
          <div className="md:w-1/2 space-y-4 p-6 rounded-md shadow-md">
            <div className="bg-blue-900 p-4 -mx-6 -my-1">
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Rent a vehicle
              </h1>
              <p className="text-sm text-white">
                Fill out the form below and we'll reach out.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: City & Car Model */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Lagos"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Car Model
                  </label>
                  <input
                    type="text"
                    placeholder="Select Vehicle"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Category & Pickup Date */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">-- Choose a category --</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Van">Van</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pick-up Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Price Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Info
                </label>
                <input
                  type="text"
                  placeholder="Select city, car model and category to show price"
                  value={extraPriceInfo}
                  onChange={(e) => setExtraPriceInfo(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Row 3: First Name & Last Name */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Row 4: Email & Phone */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., +234..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* reCAPTCHA */}
              <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey="6Ldz6aIqAAAAACN4y5k91M2zlGnWESKRmqwtYb1X"
                  onChange={(token) => setRecaptchaToken(token)}
                  onExpired={() => {
                    setRecaptchaToken("");
                    setError("reCAPTCHA expired. Please complete it again.");
                  }}
                />
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-center text-sm">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  required
                />
                <label htmlFor="acceptTerms" className="ml-2 text-gray-700">
                  By proceeding, I acknowledge that I have read and accept Travelbeta's{" "}
                  <span className="text-blue-600">Terms & Conditions</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#FFC107] text-black font-bold py-3 rounded mt-2 hover:bg-[#e6ac0c] transition-colors"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Right Column: Car Image & Additional Text */}
          <div className="md:w-1/2 flex flex-col items-center justify-center mt-8 md:mt-0">
            <img
              src={carImage}
              alt="Vehicles"
              className="w-full h-auto object-contain"
            />
            <h2 className="text-2xl font-bold text-gray-800 mt-4">
              Rent a vehicle with ease
            </h2>
            <p className="text-gray-500 mt-2 text-center px-2 md:px-6">
              Enhance your driving experience with the right travel tool for your transportation needs.
              From small cars to luxury vehicles, we have reliable options in good condition.
            </p>
          </div>
        </div>
      </div>

      {/* Partner Logos Section with Marquee */}
      <div className="my-8 max-w-6xl mx-auto px-4 overflow-hidden relative">
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
            white-space: nowrap;
          }
          .pause-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    </>
  );
}
