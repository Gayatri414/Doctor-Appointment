import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {

  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") || ""
  );

  const [doctors, setDoctors] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  console.log("BACKEND URL:", backendUrl);

  // Add axios interceptor for admin token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.data?.message?.includes('expired') || error.response?.data?.message?.includes('invalid')) {
          // Check if this is an admin request
          const isAdminRequest = error.config?.url?.includes('/api/admin/');
          if (isAdminRequest) {
            console.log("Admin token expired, logging out...");
            localStorage.removeItem('aToken');
            setAToken('');
            toast.error("Admin session expired. Please login again.");
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

  // GET ALL DOCTORS
 const getAllDoctors = async () => {
  try {
    const { data } = await axios.post(
      backendUrl + "/api/admin/all-doctors",
      {},
      {
        headers: {
          Authorization: `Bearer ${aToken}`,
        },
      }
    );

    console.log("API RESPONSE:", data); 

    if (data.success) {
      setDoctors(data.doctors);
    } else {
      toast.error(data.message); //backend message
    }

  } catch (error) {
    console.log("FULL ERROR:", error); 

    // Don't show error toast for token expiration as interceptor handles it
    if (!error.response?.data?.message?.includes('expired')) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  }
};

  // Load token on refresh
  useEffect(() => {
    const storedToken = localStorage.getItem("aToken");
    if (storedToken) {
      setAToken(storedToken);
    }
  }, []);

  // Save token
  useEffect(() => {
    if (aToken) {
      localStorage.setItem("aToken", aToken);
    }
  }, [aToken]);

const changeAvailability = async (docId) => {
  try {
   // console.log("CALLING:", backendUrl + "/api/admin/change-availability");
    const { data } = await axios.post(
      backendUrl + '/api/admin/change-availability',
      { docId },
      {
        headers: {
          Authorization: `Bearer ${aToken}`
        }
      }
    );

    if (data.success) {
      toast.success(data.message);
      getAllDoctors(); // refresh UI
    } else {
      toast.error(data.message);
    }

  } catch (error) {
    if (!error.response?.data?.message?.includes('expired')) {
      toast.error(error.response?.data?.message || error.message);
    }
  }
};

  const value = {
    doctors,           
    aToken,
    setAToken,
    backendUrl,
    getAllDoctors,
    changeAvailability
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};


export default AdminContextProvider;