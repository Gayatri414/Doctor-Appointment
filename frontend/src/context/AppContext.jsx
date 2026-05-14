import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {

  const currencySymbol = '$';
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [userData, setUserData] = useState(null);

  console.log("Backend URL:", backendUrl);

  //  SET TOKEN GLOBALLY IN AXIOS
  useEffect(() => {
    if (token) {
      console.log("TOKEN SET IN AXIOS:", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Add axios interceptor to handle token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.data?.message?.includes('expired') || error.response?.data?.message?.includes('invalid')) {
          // Token is expired or invalid
          console.log("Token expired, logging out...");
          localStorage.removeItem('token');
          setToken(null);
          setUserData(null);
          toast.error("Session expired. Please login again.");
          // Redirect to login page
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

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
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  //  LOAD USER PROFILE (NO HEADER OVERRIDE)
  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + '/api/user/profile'
      );

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      // Don't show error toast for token expiration as interceptor handles it
      if (!error.response?.data?.message?.includes('expired')) {
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  };

  //CONTEXT VALUE
  const value = {
    doctors,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData
  };

  //  LOAD DOCTORS ON START
  useEffect(() => {
    getDoctorsData();
  }, []);

  // LOAD USER WHEN TOKEN CHANGES
  useEffect(() => {
    if (token && token !== "null") {
      console.log("CALLING PROFILE API...");
      loadUserProfileData();
    } else {
      setUserData(null);
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;