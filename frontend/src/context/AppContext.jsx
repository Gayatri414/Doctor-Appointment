import { createContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

/* ─── helpers ─── */
const CACHE_KEY   = "userData";
const TOKEN_KEY   = "token";

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const writeCache = (data) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); }
  catch { /* ignore quota errors */ }
};

const clearCache = () => {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

/* ═══════════════════════════════════════════════════════════════ */
const AppContextProvider = (props) => {

  const currencySymbol = '$';
  const backendUrl     = import.meta.env.VITE_BACKEND_URL;

  // ── Read token once, synchronously, before first render ──
  const initialToken = localStorage.getItem(TOKEN_KEY) || null;

  // ── Seed userData from cache so Navbar shows name INSTANTLY ──
  const initialUserData = initialToken ? readCache() : null;

  const [doctors,          setDoctors]          = useState([]);
  const [token,            setTokenState]        = useState(initialToken);
  const [userData,         setUserData]          = useState(initialUserData);
  // isLoadingProfile is TRUE from the start only when we have a token
  // but no cached data (so Navbar shows skeleton, not flash of nothing)
  const [isLoadingProfile, setIsLoadingProfile]  = useState(!!initialToken && !initialUserData);

  // Guard ref — prevents duplicate concurrent API calls
  const fetchingRef = useRef(false);

  // ── Keep axios default header in sync ──
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("Token Found:", token.substring(0, 20) + "...");
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  /* ── LOAD DOCTORS ── */
  const getDoctorsData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/list');
      if (data.success) setDoctors(data.doctors);
      else toast.error(data.message);
    } catch (error) {
      console.error("Get doctors error:", error);
      toast.error(error?.response?.data?.message || error.message);
    }
  }, [backendUrl]);

  /* ── LOAD USER PROFILE ──
     - isSilent = true  → background refresh (don't show loading spinner)
     - isSilent = false → first load, set isLoadingProfile
  */
  const loadUserProfileData = useCallback(async (isSilent = false) => {
    if (!token) {
      console.log("No token — skipping profile fetch");
      return;
    }
    if (fetchingRef.current) {
      console.log("Already fetching profile — skipping duplicate call");
      return;
    }

    fetchingRef.current = true;
    if (!isSilent) setIsLoadingProfile(true);

    console.log("Fetching Profile...");

    try {
      const response = await axios.get(backendUrl + '/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        console.log("Profile Loaded ✅");
        const freshData = response.data.user;
        setUserData(freshData);
        writeCache(freshData);           // update cache silently
        console.log("User State Updated ✅");
      } else {
        console.log("Profile API returned success: false —", response.data.message);
        if (!isSilent) toast.error(response.data.message || "Failed to load profile");
      }

    } catch (error) {
      console.log("Profile loading error:", error);
      const status = error.response?.status;
      const msg    = error.response?.data?.message || "";

      if (status === 401) {
        if (
          msg.includes("expired") ||
          msg.includes("invalid") ||
          msg.includes("Not Authorized") ||
          msg.includes("authentication")
        ) {
          console.log("Token invalid — clearing auth");
          clearCache();
          setTokenState(null);
          setUserData(null);
          toast.error("Session expired. Please login again.");
        } else {
          if (!isSilent) toast.error("Authentication failed — please login again");
        }
      } else if (status === 404) {
        console.log("User not found — clearing auth");
        clearCache();
        setTokenState(null);
        setUserData(null);
        toast.error("Account not found. Please register again.");
      } else if (!error.response) {
        console.log("Network error — keeping auth");
        if (!isSilent) toast.error("Network error — please check your connection");
      } else {
        if (!isSilent) toast.error("Failed to load profile");
      }
    } finally {
      fetchingRef.current = false;
      setIsLoadingProfile(false);
    }
  }, [token, backendUrl]);

  /* ── Custom setToken — single source of truth ── */
  const setToken = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      setTokenState(newToken);
    } else {
      clearCache();
      delete axios.defaults.headers.common["Authorization"];
      setTokenState(null);
      setUserData(null);
    }
  }, []);

  /* ── Fetch doctors once on mount ── */
  useEffect(() => {
    getDoctorsData();
  }, [getDoctorsData]);

  /* ── Fetch profile whenever token changes ──
     - If we already have cached userData (shown instantly), this runs as a
       silent background refresh.
     - If there is no cache yet, it runs as a normal loading fetch.
  */
  useEffect(() => {
    if (token && token !== "null") {
      const hasCachedData = !!readCache();
      loadUserProfileData(hasCachedData); // silent = true when cache exists
    } else {
      setUserData(null);
      setIsLoadingProfile(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // ONLY re-run when token changes — NOT on loadUserProfileData identity change

  /* ── Context value ── */
  const value = {
    doctors,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    isLoadingProfile,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;