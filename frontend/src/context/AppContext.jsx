import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {

  const currencySymbol = '$';
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [userData, setUserData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  //  SET TOKEN GLOBALLY IN AXIOS
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  //  GET DOCTORS
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/list');

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error("Get doctors error:", error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  //  LOAD USER PROFILE
  const loadUserProfileData = useCallback(async () => {
    if (!token || isLoadingProfile) {
      console.log("No token or already loading profile");
      return;
    }
    
    console.log("=== LOADING USER PROFILE ===");
    console.log("Token exists:", !!token);
    console.log("Token preview:", token ? `${token.substring(0, 20)}...` : "null");
    console.log("Backend URL:", backendUrl);
    
    setIsLoadingProfile(true);
    
    try {
      // Always use explicit headers instead of relying on global defaults
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      console.log("Making profile API request...");
      console.log("Request config:", config);
      
      const response = await axios.get(backendUrl + '/api/user/profile', config);
      
      console.log("Profile API response:", response.data);

      if (response.data.success) {
        console.log("✅ Profile loaded successfully");
        setUserData(response.data.user);
      } else {
        console.log("❌ Profile API returned success: false");
        console.log("Error message:", response.data.message);
        toast.error(response.data.message || "Failed to load profile");
      }

    } catch (error) {
      console.log("❌ Profile loading error:", error);
      console.log("Error response:", error.response?.data);
      console.log("Error status:", error.response?.status);
      
      // Only clear auth state if it's a real authentication error
      // Don't clear on network errors or other issues
      if (error.response?.status === 401) {
        const errorMessage = error.response?.data?.message || "";
        console.log("Authentication error detected:", errorMessage);
        
        // Only clear auth if it's actually a token issue
        if (errorMessage.includes("expired") || 
            errorMessage.includes("invalid") || 
            errorMessage.includes("Not Authorized") ||
            errorMessage.includes("authentication")) {
          console.log("Clearing authentication due to token issue");
          localStorage.removeItem('token');
          setToken(null);
          setUserData(null);
          toast.error("Session expired. Please login again.");
        } else {
          console.log("401 error but not token related");
          toast.error("Authentication failed - please login again");
        }
      } else if (error.response?.status === 404) {
        console.log("User not found - clearing auth");
        localStorage.removeItem('token');
        setToken(null);
        setUserData(null);
        toast.error("Account not found. Please register again.");
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        console.log("Network error - not clearing auth");
        toast.error("Network error - please check your connection");
      } else {
        console.log("Other error - not clearing auth");
        toast.error("Failed to load profile");
      }
    } finally {
      setIsLoadingProfile(false);
    }
  }, [token, backendUrl]);

  // Custom setToken function that handles both state and localStorage
  const setTokenAndStorage = useCallback((newToken) => {
    if (newToken) {
      // Set localStorage first
      localStorage.setItem('token', newToken);
      
      // Then set state
      setToken(newToken);
      
      // Set axios header immediately
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem('token');
      setToken(null);
      setUserData(null);
      delete axios.defaults.headers.common["Authorization"];
    }
  }, []);

  //CONTEXT VALUE
  const value = {
    doctors,
    currencySymbol,
    token,
    setToken: setTokenAndStorage, // Use custom function
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    isLoadingProfile
  };

  //  LOAD DOCTORS ON START
  useEffect(() => {
    getDoctorsData();
  }, []);

  // LOAD USER WHEN TOKEN CHANGES
  useEffect(() => {
    if (token && token !== "null" && token !== null) {
      // Add a small delay to ensure axios headers are set
      setTimeout(() => {
        loadUserProfileData();
      }, 100);
    } else {
      setUserData(null);
      setIsLoadingProfile(false);
    }
  }, [token]); // Only depend on token

  // Initialize token from localStorage on app start
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    
    if (storedToken && storedToken !== token) {
      setToken(storedToken);
      // Set axios header immediately for stored token
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    } else if (!storedToken) {
      setToken(null);
      setUserData(null);
    }
  }, []); // Run only once on mount

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;