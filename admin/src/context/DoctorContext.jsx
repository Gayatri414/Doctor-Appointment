import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {

  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") || ""
  );

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Add axios interceptor for doctor token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.data?.message?.includes('expired') || error.response?.data?.message?.includes('invalid')) {
          // Check if this is a doctor request
          const isDoctorRequest = error.config?.url?.includes('/api/doctor/') && 
                                 !error.config?.url?.includes('/api/doctor/list') && 
                                 !error.config?.url?.includes('/api/doctor/login');
          if (isDoctorRequest) {
            console.log("Doctor token expired, logging out...");
            localStorage.removeItem('dToken');
            setDToken('');
            toast.error("Doctor session expired. Please login again.");
            window.location.reload();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const value = {
    dToken,
    setDToken,
    backendUrl,
  };

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;