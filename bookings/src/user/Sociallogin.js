import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';  // Import the GoogleLogin component
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Socialaccount = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle Google Login response
  const responseGoogle = async (response) => {
    if (response.credential) {
      try {
        // Send the Google token to your backend (Django Rest Framework)
        const res = await axios.post('http://127.0.0.1:8000/auth/social/google/', {
          token: response.credential,  // Google token
        });

        // On successful login, save token and redirect
        localStorage.setItem('token', res.data.token);
        navigate('');  // Redirect to your dashboard or another route
      } catch (err) {
        setError('Login failed');
        console.error(err);
      }
    } else {
      setError('Google login failed');
    }
  };

  return (
    <div>
      
      <GoogleLogin
        onSuccess={responseGoogle}  // Triggered when the login is successful
        onError={() => setError('Login failed')}  // Triggered when the login fails
      />
      {error && <div>{error}</div>}
    </div>
  );
};

export default Socialaccount;
