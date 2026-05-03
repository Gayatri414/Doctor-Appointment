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
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
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