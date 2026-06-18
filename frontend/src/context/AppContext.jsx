import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [token, setTokenState] = useState("");
  const [userData, setUserData] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);

  // Sync axios header when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const getDoctorsData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("[Doctors] Fetch error:", error);
      toast.error(error?.response?.data?.message || error.message);
    }
  }, [backendUrl]);

  // Verify token on app startup
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken && storedToken !== "null" && storedToken !== "undefined") {
        try {
          const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          if (data.success) {
            setTokenState(storedToken);
            setUserData(data.user);
          } else {
            localStorage.removeItem("token");
            setTokenState("");
            setUserData(null);
          }
        } catch (error) {
          console.error("Auth initialization failed:", error);
          localStorage.removeItem("token");
          setTokenState("");
          setUserData(null);
        }
      } else {
        localStorage.removeItem("token");
        setTokenState("");
        setUserData(null);
      }
      setAuthLoading(false);
    };

    getDoctorsData();
    initAuth();
  }, [backendUrl, getDoctorsData]);

  // Load profile data (called on login/register/profile-update)
  const loadUserProfileData = useCallback(async (customToken) => {
    const t = customToken || token;
    if (!t) return;
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { Authorization: `Bearer ${t}` }
      });
      if (data.success) {
        setUserData(data.user);
      } else {
        localStorage.removeItem("token");
        setTokenState("");
        setUserData(null);
      }
    } catch (error) {
      console.error("Profile load failed:", error);
      localStorage.removeItem("token");
      setTokenState("");
      setUserData(null);
    }
  }, [token, backendUrl]);

  // Public setter exposed to components
  const setToken = useCallback((newToken) => {
    if (newToken && newToken !== "null" && newToken !== "undefined") {
      localStorage.setItem("token", newToken);
      setTokenState(newToken);
      loadUserProfileData(newToken);
    } else {
      localStorage.removeItem("token");
      setTokenState("");
      setUserData(null);
    }
  }, [loadUserProfileData]);

  const value = {
    doctors,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    authLoading,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;