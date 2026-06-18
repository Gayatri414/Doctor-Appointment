import { createContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { isTokenExpired } from "../utils/tokenUtils";

export const AppContext = createContext();

/* ─── storage helpers ─── */
const TOKEN_KEY = "token";
const CACHE_KEY = "userData";

const readTokenFromStorage = () => {
  const t = localStorage.getItem(TOKEN_KEY);
  // Treat "null" / "undefined" strings as absent
  return t && t !== "null" && t !== "undefined" ? t : null;
};

const writeCache  = (data) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch { /* quota */ }
};

const clearStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CACHE_KEY);
};

/* ═══════════════════════════════════════════════════════════════════════ */
const AppContextProvider = (props) => {

  const currencySymbol = "$";
  const backendUrl     = import.meta.env.VITE_BACKEND_URL;

  /*
   * Initialize state from storage synchronously:
   * - If token is absent or expired, clear storage and initialize as null.
   * - If token is valid, seed both token and userData from cache to avoid layout shift.
   */
  const [token, setTokenState] = useState(() => {
    const stored = readTokenFromStorage();
    if (stored) {
      if (isTokenExpired(stored)) {
        clearStorage();
        return null;
      }
      return stored;
    }
    return null;
  });

  const [userData, setUserData] = useState(() => {
    const stored = readTokenFromStorage();
    if (stored && !isTokenExpired(stored)) {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        return cached ? JSON.parse(cached) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [doctors,          setDoctors]          = useState([]);

  // Prevents duplicate concurrent profile fetches
  const fetchingRef = useRef(false);

  /* ──────────────────────────────────────────────────────────────────── */
  /* Keep axios default header in sync with token state                  */
  /* ──────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("[Auth] Token loaded:", token.substring(0, 22) + "...");
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  /* ──────────────────────────────────────────────────────────────────── */
  /* getDoctorsData                                                       */
  /* ──────────────────────────────────────────────────────────────────── */
  const getDoctorsData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
      if (data.success) setDoctors(data.doctors);
      else toast.error(data.message);
    } catch (error) {
      console.error("[Doctors] Fetch error:", error);
      toast.error(error?.response?.data?.message || error.message);
    }
  }, [backendUrl]);

  /* ──────────────────────────────────────────────────────────────────── */
  /* loadUserProfileData                                                  */
  /*  - Always validates token against backend.                           */
  /*  - On success  → setUserData + writeCache                            */
  /*  - On 401/404  → clearStorage + setToken(null) + setUserData(null)   */
  /*    (shows Login button immediately)                                   */
  /* ──────────────────────────────────────────────────────────────────── */
  const loadUserProfileData = useCallback(async (currentToken) => {
    // Accept an explicit token so we're not stale-closing over state
    const tok = currentToken || token;
    if (!tok) {
      console.log("[Auth] No token — skipping profile fetch");
      return;
    }
    if (fetchingRef.current) {
      console.log("[Auth] Already fetching — skipping duplicate");
      return;
    }

    fetchingRef.current = true;
    setIsLoadingProfile(true);

    console.log("[Auth] Fetching Profile...");

    try {
      const response = await axios.get(backendUrl + "/api/user/profile", {
        headers: {
          Authorization: `Bearer ${tok}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        console.log("[Auth] Profile Loaded ✅");
        const freshData = response.data.user;
        setUserData(freshData);
        writeCache(freshData);
        console.log("[Auth] User State Updated ✅");
      } else {
        // API returned success:false — treat as auth failure
        console.log("[Auth] Profile fetch: success=false —", response.data.message);
        console.log("[Auth] Profile fetch failure — clearing auth");
        clearStorage();
        setTokenState(null);
        setUserData(null);
        toast.error(response.data.message || "Failed to load profile. Please login again.");
      }

    } catch (error) {
      const status = error.response?.status;
      const msg    = error.response?.data?.message || "";
      console.log("[Auth] Profile fetch failure — status:", status, "msg:", msg);

      if (status === 401 || status === 403) {
        // Token expired / invalid / not authorized
        console.log("[Auth] Token invalid or expired — clearing auth");
        clearStorage();
        setTokenState(null);
        setUserData(null);
        toast.error("Session expired. Please login again.");

      } else if (status === 404) {
        // Account deleted or not found
        console.log("[Auth] User not found — clearing auth");
        clearStorage();
        setTokenState(null);
        setUserData(null);
        toast.error("Account not found. Please register again.");

      } else if (!error.response) {
        // Network error — keep token, but don't show avatar (userData stays null)
        console.log("[Auth] Network error — keeping token, userData remains null");
        toast.error("Network error — please check your connection.");

      } else {
        // Unknown server error — clear to be safe
        console.log("[Auth] Unknown error — clearing auth");
        clearStorage();
        setTokenState(null);
        setUserData(null);
        toast.error("Authentication error. Please login again.");
      }
    } finally {
      fetchingRef.current = false;
      setIsLoadingProfile(false);
    }
  }, [token, backendUrl]);

  /* ──────────────────────────────────────────────────────────────────── */
  /* setToken — public API exposed to Login / Logout                      */
  /* ──────────────────────────────────────────────────────────────────── */
  const setToken = useCallback((newToken) => {
    if (newToken && newToken !== "null" && newToken !== "undefined") {
      localStorage.setItem(TOKEN_KEY, newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      setTokenState(newToken);
      // Profile will be fetched by the token useEffect below
    } else {
      console.log("[Auth] Logout triggered — clearing auth");
      clearStorage();
      delete axios.defaults.headers.common["Authorization"];
      setTokenState(null);
      setUserData(null);
    }
  }, []);

  /* ──────────────────────────────────────────────────────────────────── */
  /* On mount: fetch initial doctors data                                 */
  /* ──────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    getDoctorsData();
  }, [getDoctorsData]); // runs ONCE on mount (since getDoctorsData is wrapped in useCallback)

  /* ──────────────────────────────────────────────────────────────────── */
  /* Whenever token changes, validate with backend.                       */
  /* userData is NEVER shown until this succeeds.                         */
  /* ──────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (token) {
      loadUserProfileData(token);
    } else {
      // Token cleared → ensure UI shows Login button
      setUserData(null);
      setIsLoadingProfile(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Only re-run when token identity changes

  /* ──────────────────────────────────────────────────────────────────── */
  /* Context value                                                         */
  /* ──────────────────────────────────────────────────────────────────── */
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