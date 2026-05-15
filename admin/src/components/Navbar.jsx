import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { aToken, adminLogout, adminData } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    if (aToken) {
      adminLogout();
      navigate("/admin/login");
    } else if (dToken) {
      localStorage.removeItem("dToken");
      setDToken("");
      navigate("/doctor/login");
    }
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <img 
            src={assets.admin_logo} 
            alt="logo" 
            className="w-10 h-10 filter brightness-0 invert" 
          />
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg opacity-50"></div>
        </div>
        <div>
          <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
            {aToken ? "Admin Panel" : "Doctor Panel"}
          </p>
          <p className="text-xs text-gray-400">
            Healthcare Management System
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* User info */}
        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-700/50 rounded-full border border-gray-600/50">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {aToken ? "A" : "D"}
            </span>
          </div>
          <div className="text-left">
            <span className="text-gray-300 text-sm font-medium block">
              {aToken ? "Administrator" : "Doctor"}
            </span>
            {aToken && adminData?.name && (
              <span className="text-gray-400 text-xs">
                {adminData.name}
              </span>
            )}
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={logoutHandler}
          className="group relative px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="relative z-10">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;