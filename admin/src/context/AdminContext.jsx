import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {

  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") || ""
  );

  const [doctors, setDoctors] = useState([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);

  // FIXED: Memoize backendUrl to prevent unnecessary re-renders
  const backendUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL, []);

  // FIXED: Add axios interceptor for admin token expiration with stable dependencies
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
            setAdminData(null);
            toast.error("Admin session expired. Please login again.");
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []); // FIXED: Empty dependency array to prevent re-creation

  // Load admin profile data
  const loadAdminProfile = useCallback(async () => {
    if (!aToken || isLoadingAdmin) return;
    
    setIsLoadingAdmin(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/profile`,
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );

      if (data.success) {
        setAdminData(data.admin);
      } else {
        toast.error(data.message);
        localStorage.removeItem("aToken");
        setAToken("");
        setAdminData(null);
        window.location.href = '/login';
      }

    } catch (error) {
      console.error("Load admin profile error:", error);
      const status = error.response?.status;
      if (status === 401 || status === 403 || status === 404) {
        localStorage.removeItem("aToken");
        setAToken("");
        setAdminData(null);
        window.location.href = '/login';
      } else if (!error.response) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Failed to load admin profile");
      }
    } finally {
      setIsLoadingAdmin(false);
    }
  }, [aToken, backendUrl, isLoadingAdmin]);

  // FIXED: Memoize getAllDoctors function to prevent infinite re-renders
  const getAllDoctors = useCallback(async () => {
    if (!aToken || isLoadingDoctors) return; // FIXED: Prevent multiple simultaneous calls
    
    setIsLoadingDoctors(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/all-doctors`,
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error("Get doctors error:", error);

      // Don't show error toast for token expiration as interceptor handles it
      if (!error.response?.data?.message?.includes('expired')) {
        if (error.response && error.response.data) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    } finally {
      setIsLoadingDoctors(false);
    }
  }, [aToken, backendUrl, isLoadingDoctors]); // FIXED: Stable dependencies

  // FIXED: Load token on refresh with proper dependency
  useEffect(() => {
    const storedToken = localStorage.getItem("aToken");
    if (storedToken && storedToken !== aToken) {
      setAToken(storedToken);
    }
  }, []); // FIXED: Empty dependency to run only once

  // FIXED: Save token and load profile when token changes
  useEffect(() => {
    if (aToken) {
      localStorage.setItem("aToken", aToken);
      // Load admin profile when token is available
      loadAdminProfile();
    } else {
      localStorage.removeItem("aToken");
      setAdminData(null);
    }
  }, [aToken, loadAdminProfile]);

  // FIXED: Memoize changeAvailability to prevent re-renders
  const changeAvailability = useCallback(async (docId) => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/admin/change-availability`,
        { docId },
        {
          headers: {
            Authorization: `Bearer ${aToken}`
          }
        }
      );

      if (data.success) {
        toast.success(data.message);
        
        // FIXED: Update doctors state directly instead of calling getAllDoctors
        // This prevents the infinite re-render loop
        setDoctors(prevDoctors => 
          prevDoctors.map(doctor => 
            doctor._id === docId 
              ? { ...doctor, available: !doctor.available }
              : doctor
          )
        );
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      if (!error.response?.data?.message?.includes('expired')) {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  }, [aToken, backendUrl]); // FIXED: Stable dependencies

  // Admin logout function
  const adminLogout = useCallback(() => {
    localStorage.removeItem("aToken");
    setAToken("");
    setAdminData(null);
    toast.success("Logged out successfully");
  }, []);

  // FIXED: Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    doctors,           
    aToken,
    setAToken,
    backendUrl,
    getAllDoctors,
    changeAvailability,
    isLoadingDoctors,
    adminData,
    setAdminData,
    loadAdminProfile,
    isLoadingAdmin,
    adminLogout
  }), [doctors, aToken, backendUrl, getAllDoctors, changeAvailability, isLoadingDoctors, adminData, loadAdminProfile, isLoadingAdmin, adminLogout]);

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;