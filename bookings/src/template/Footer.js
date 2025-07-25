import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import logo from "../images/213ba61d1043759862a00a57eed32c60_zbufwb.png";

const Footer = () => {
  return (
    <footer className="bg-blue-950 text-light py-5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row py-3 px-2 gap-y-8 md:gap-y-0">
          
          {/* Left Side: Grid layout for Services, Account, Travelbeta */}
          <div className="w-full md:w-1/2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
              
              {/* Services Column */}
              <div className="border-b border-light pb-4 md:border-b-0 md:pb-0">
                {/* Heading shifted right with ml-4 */}
                <h5 className="font-bold text-lg mb-3 ml-4">Services</h5>
                <ul className="space-y-2">
                  <li>
                    <Link to="/?tab=flights" className="block py-1 text-light no-underline hover:underline">
                      Flights
                    </Link>
                  </li>
                  <li>
                    <Link to="/?tab=hotels" className="block py-1 text-light no-underline hover:underline">
                      Hotels
                    </Link>
                  </li>
                  <li>
                    <Link to="/visa" className="block py-1 text-light no-underline hover:underline">
                      Visa
                    </Link>
                  </li>
                  <li>
                    <Link to="/deals" className="block py-1 text-light no-underline hover:underline">
                      Deals
                    </Link>
                  </li>
                  <li>
                    <Link to="/packages" className="block py-1 text-light no-underline hover:underline">
                      Packages
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Account Column */}
              <div className="border-b border-light pb-4 md:border-b-0 md:pb-0">
                {/* Heading shifted right with ml-4 */}
                <h5 className="font-bold text-lg mb-3 ml-4">Account</h5>
                <ul className="space-y-2">
                  <li>
                    <Link to="/login" className="block py-1 text-light no-underline hover:underline">
                      My Account
                    </Link>
                  </li>
                  <li>
                    <Link to="/affiliate" className="block py-1 text-light no-underline hover:underline">
                      Affiliates
                    </Link>
                  </li>
                  <li>
                    <Link to="/feedback" className="block py-1 text-light no-underline hover:underline">
                      Feedback
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Travelbeta Column */}
              <div className="border-b border-light pb-4 md:border-b-0 md:pb-0">
                {/* Heading shifted right with ml-4 */}
                <h5 className="font-bold text-lg mb-3 ml-4">Travelbeta</h5>
                <ul className="space-y-2">
                  <li>
                    <Link to="/about" className="block py-1 text-light no-underline hover:underline">
                      About us
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="block py-1 text-light no-underline hover:underline">
                      Contact us
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy/app" className="block py-1 text-light no-underline hover:underline">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* Right Side: Social Icons, Logo, and Footer Info */}
          <div className="w-full md:w-1/2">
            <div className="flex flex-col items-center md:items-end space-y-4">
              
              {/* Social Icons */}
              <div className="flex space-x-3">
                <a
                  href="https://www.facebook.com/travelbeta"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook website"
                  className="text-light"
                >
                  <span className="inline-block rounded-full bg-light px-2 py-1">
                    <FontAwesomeIcon icon={faFacebookF} style={{ color: "#212529" }} />
                  </span>
                </a>
                <a
                  href="https://www.instagram.com/travelbeta"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram website"
                  className="text-light"
                >
                  <span className="inline-block rounded-full bg-light px-2 py-1">
                    <FontAwesomeIcon icon={faInstagram} style={{ color: "#212529" }} />
                  </span>
                </a>
                <a
                  href="https://www.twitter.com/travelbeta"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter website"
                  className="text-light"
                >
                  <span className="inline-block rounded-full bg-light px-2 py-1">
                    <FontAwesomeIcon icon={faTwitter} style={{ color: "#212529" }} />
                  </span>
                </a>
              </div>

              {/* Footer Logo */}
              <div>
                <img src={logo} alt="Travelbeta Logo" className="max-w-[80px] h-auto" />
              </div>

              {/* Copyright & Terms */}
              <div className="text-center md:text-right">
                <p className="text-sm">© 2025 Travelbeta All Rights Reserved.</p>
                <p className="text-sm">
                  <Link to="/terms" className="text-light no-underline hover:underline">
                    Terms and Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
