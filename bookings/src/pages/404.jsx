import React from 'react';
import { Link } from 'react-router-dom';

// You can import your airplane image if it's a local asset
// import airplaneImage from '../assets/airplane.png';

// Or use a URL like in the HTML version
const airplaneImageUrl = "../images/Airplane.png";
const placeholderImageUrl = "../images/Airplane.png"; // Placeholder image URL

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      {/* Airplane Image */}
      <div className="mb-8">
        <img 
          src={airplaneImageUrl} 
          alt="Airplane" 
          className="max-w-xs md:max-w-md"
          // This onError event handler works in React as well
          onError={(e) => { e.target.onerror = null; e.target.src = placeholderImageUrl; }}
        />
      </div>

      {/* Text Content */}
      <div className="text-center">
        <p className="text-yellow-500 font-semibold mb-2">Error 404</p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Oh no! this page doesn't exist.
        </h1>
        <p className="text-gray-600">
          Need help finding something? Try reaching us on our{' '}
          <Link to="/contact" className="text-indigo-600 font-semibold hover:underline">
            contact us page
          </Link>
          {' '}or head back to our{' '}
          <Link to="/" className="text-indigo-600 font-semibold hover:underline">
            landing page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
