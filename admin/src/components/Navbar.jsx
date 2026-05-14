import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    localStorage.removeItem("aToken");
    localStorage.removeItem("dToken");
    setAToken("");
    setDToken("");

    navigate("/");
  };

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-white shadow-md">
      
      <div className="flex items-center gap-3">
        <img src={assets.admin_logo} alt="logo" className="w-10 h-10" />
        <p className="text-lg font-semibold text-gray-700">
          {aToken ? "Admin Panel" : "Doctor Panel"}
        </p>
      </div>

      <button
        onClick={logoutHandler}
        className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;