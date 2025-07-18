import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Template from './template/Template';
import { AuthProvider } from './user/Authcontext';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/login';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Rental from './pages/Rental';
import Dashboard from './pages/Dashboard';
import VacationPackages from './pages/Vacation_package';
import ProductProvider from "./user/Produuctcontext";
import VacationDetails from './pages/Vacation_details';
import ReserveVacation from './pages/ReserveVacation';
import FlightDeals from './pages/Deals';
import FlightSearchResults from './pages/Search-result';
import HotelSearchResults from './pages/HotelSearchResults';

function App() {
  return (
    <GoogleOAuthProvider clientId="318182091371-dhpfdgmme0i6beb1g0in9fpb49k93i2d.apps.googleusercontent.com">
      <BrowserRouter>
        <AuthProvider>
        <ProductProvider>
          <Routes>
            {/* Routes that include the Template */}
            <Route element={<Template />}>
              <Route path="home" element={<Home />} />
              <Route path="rental" element={<Rental />} />  
              <Route path="/" element={<Home />} />
              <Route path="vacation" element={<VacationPackages />} />
              <Route path="vacation/:vacationId" element={<VacationDetails />} />
              <Route path="deals" element={<FlightDeals />} />
              <Route path="deals/:flightId" element={<FlightDeals />} />
              <Route path="/flights-search-result" element={<FlightSearchResults  />} />
              <Route path="/hotel-search-result" element={<HotelSearchResults />} />


            </Route>
            {/* Signup route does not use the Template */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="/reserve-vacation/:vacationId" element={<ReserveVacation />} />
          </Routes>
        </ProductProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
