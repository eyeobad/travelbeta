import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {jwtDecode} from "jwt-decode"; 
import { useNavigate } from "react-router-dom";
const swal = require("sweetalert2");

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

// Helper function to wrap fetch calls with timeout using AbortController
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Initialize authTokens from localStorage if available.
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  // Initialize user by decoding the access token.
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(JSON.parse(localStorage.getItem("authTokens")).access)
      : null
  );

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper alert functions
  const showSuccessAlert = (message) => {
    swal.fire({
      title: message,
      icon: "success",
      toast: true,
      position: "top",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const showErrorAlert = (message) => {
    swal.fire({
      title: message,
      icon: "error",
      toast: true,
      position: "top",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  // Authentication functions
  const loginUser = async (username, password) => {
    try {
      const response = await fetch("https://909793a00c39.ngrok-free.app/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Expecting backend to return both access and refresh tokens
        localStorage.setItem("authTokens", JSON.stringify(data));
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        await getProfile(data.access);
        navigate("/");
        showSuccessAlert("Login Successful");
      } else {
        throw new Error(data.detail || "Login failed");
      }
    } catch (error) {
      showErrorAlert(error.message);
    }
  };

  const registerUser = async (username, password, password2, email, first_name, last_name) => {
    if (password !== password2) {
      showErrorAlert("Passwords do not match");
      return;
    }
    try {
      const response = await fetch("https://909793a00c39.ngrok-free.app/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email, last_name, first_name, password2 }),
      });
      if (response.status === 201) {
        navigate("/login");
        showSuccessAlert("Registration Successful, Please Login");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
    } catch (error) {
      showErrorAlert(error.message);
    }
  };

  const logoutUser = useCallback(() => {
    localStorage.removeItem("authTokens");
    setAuthTokens(null);
    setUser(null);
    setProfile(null);
    navigate("/login");
    showSuccessAlert("You have been logged out");
  }, [navigate]);

  // Profile management with timeout handling
  const getProfile = useCallback(
    async (accessToken) => {
      if (!authTokens) return;
      try {
        const response = await fetchWithTimeout(
          "https://909793a00c39.ngrok-free.app/profile/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken || authTokens.access}`,
            },
          },
          10000 // timeout in ms
        );
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          throw new Error("Failed to fetch profile");
        }
      } catch (error) {
        if (error.name === "AbortError") {
          showErrorAlert("Profile request timed out");
        } else {
          showErrorAlert(error.message);
        }
      }
    },
    [authTokens]
  );

  const updateProfile = async (updatedData) => {
    if (!authTokens) return;
    try {
      const response = await fetch("https://909793a00c39.ngrok-free.app/profile/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        showSuccessAlert("Profile updated successfully");
        return true;
      }
      throw new Error("Profile update failed");
    } catch (error) {
      showErrorAlert(error.message);
      return false;
    }
  };

  // Token refresh function
  const refreshToken = useCallback(async () => {
    if (!authTokens?.refresh) return;
    try {
      const response = await fetch("https://909793a00c39.ngrok-free.app/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: authTokens.refresh }),
      });
      if (response.ok) {
        const data = await response.json();
        // Update the access token; you may also receive a new refresh token.
        const updatedTokens = { ...authTokens, access: data.access, refresh: data.refresh || authTokens.refresh };
        localStorage.setItem("authTokens", JSON.stringify(updatedTokens));
        setAuthTokens(updatedTokens);
        setUser(jwtDecode(data.access));
      } else {
        // If refresh fails, log the user out
        logoutUser();
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      logoutUser();
    }
  }, [authTokens, logoutUser]);

  // Check token validity on initial load and get profile
  useEffect(() => {
    const initializeAuth = async () => {
      if (authTokens) {
        try {
          const decodedUser = jwtDecode(authTokens.access);
          // Optionally, you could compare exp with current time and refresh beforehand if needed.
          setUser(decodedUser);
          await getProfile(authTokens.access);
        } catch (error) {
          console.error("Token invalid/expired:", error);
          logoutUser();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, [authTokens, getProfile, logoutUser]);

  // Set up an interval to refresh token regularly (e.g., every 4 minutes)
  useEffect(() => {
    if (authTokens) {
      const interval = setInterval(() => {
        refreshToken();
      }, 4 * 60 * 1000); // Adjust interval as appropriate based on token lifetime
      return () => clearInterval(interval);
    }
  }, [authTokens, refreshToken]);

  const contextValue = {
    user,
    profile,
    authTokens,
    loading,
    loginUser,
    registerUser,
    logoutUser,
    updateProfile,
    getProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
