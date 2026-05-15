import React, { useContext } from "react";
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
    const { aToken } = useContext(AdminContext);
    const { dToken } = useContext(DoctorContext);

    return (
        <div className="min-h-screen bg-gray-800/30 backdrop-blur-xl border-r border-gray-700/50 w-72">
            {aToken && (
                <div className="p-6">
                    <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">
                        Admin Menu
                    </h3>
                    <ul className="space-y-2">

                        <NavLink
                            to="/admin/dashboard"
                            className={({ isActive }) =>
                                `group flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 ${
                                    isActive
                                        ? "bg-gradient-to-r from-blue-600/20 to-blue-700/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10"
                                        : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                                }`
                            }
                        >
                            <div className="relative">
                                <img src={assets.home_icon} alt="" className="w-5 h-5 filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-blue-500/20 rounded blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <p className="font-medium">Dashboard</p>
                            <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </NavLink>

                        <NavLink
                            to="/admin/appointments"
                            className={({ isActive }) =>
                                `group flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 ${
                                    isActive
                                        ? "bg-gradient-to-r from-orange-600/20 to-orange-700/20 text-orange-400 border border-orange-500/30 shadow-lg shadow-orange-500/10"
                                        : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                                }`
                            }
                        >
                            <div className="relative">
                                <img src={assets.appointment_icon} alt="" className="w-5 h-5 filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-orange-500/20 rounded blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <p className="font-medium">Appointments</p>
                            <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </NavLink>

                        <NavLink
                            to="/admin/add-doctor"
                            className={({ isActive }) =>
                                `group flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 ${
                                    isActive
                                        ? "bg-gradient-to-r from-green-600/20 to-green-700/20 text-green-400 border border-green-500/30 shadow-lg shadow-green-500/10"
                                        : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                                }`
                            }
                        >
                            <div className="relative">
                                <img src={assets.add_icon} alt="" className="w-5 h-5 filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-green-500/20 rounded blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <p className="font-medium">Add Doctor</p>
                            <div className="ml-auto w-2 h-2 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </NavLink>

                        <NavLink
                            to="/admin/doctors"
                            className={({ isActive }) =>
                                `group flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 ${
                                    isActive
                                        ? "bg-gradient-to-r from-purple-600/20 to-purple-700/20 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/10"
                                        : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                                }`
                            }
                        >
                            <div className="relative">
                                <img src={assets.people_icon} alt="" className="w-5 h-5 filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-purple-500/20 rounded blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <p className="font-medium">Doctors List</p>
                            <div className="ml-auto w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </NavLink>

                        <NavLink
                            to="/admin/profile"
                            className={({ isActive }) =>
                                `group flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 ${
                                    isActive
                                        ? "bg-gradient-to-r from-indigo-600/20 to-indigo-700/20 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                                        : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                                }`
                            }
                        >
                            <div className="relative">
                                <img src={assets.people_icon} alt="" className="w-5 h-5 filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-indigo-500/20 rounded blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <p className="font-medium">Admin Profile</p>
                            <div className="ml-auto w-2 h-2 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </NavLink>

                    </ul>
                </div>
            )}

            {dToken && (
                <div className="p-6">
                    <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">
                        Doctor Menu
                    </h3>
                    <ul className="space-y-2">

                        <NavLink
                            to="/doctor/dashboard"
                            className={({ isActive }) =>
                                `group flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 ${
                                    isActive
                                        ? "bg-gradient-to-r from-blue-600/20 to-blue-700/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10"
                                        : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                                }`
                            }
                        >
                            <div className="relative">
                                <img src={assets.home_icon} alt="" className="w-5 h-5 filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-blue-500/20 rounded blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <p className="font-medium">Dashboard</p>
                            <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </NavLink>

                        <NavLink
                            to="/doctor/appointments"
                            className={({ isActive }) =>
                                `group flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 ${
                                    isActive
                                        ? "bg-gradient-to-r from-orange-600/20 to-orange-700/20 text-orange-400 border border-orange-500/30 shadow-lg shadow-orange-500/10"
                                        : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                                }`
                            }
                        >
                            <div className="relative">
                                <img src={assets.appointment_icon} alt="" className="w-5 h-5 filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-orange-500/20 rounded blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <p className="font-medium">Appointments</p>
                            <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </NavLink>

                        <NavLink
                            to="/doctor/profile"
                            className={({ isActive }) =>
                                `group flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 ${
                                    isActive
                                        ? "bg-gradient-to-r from-green-600/20 to-green-700/20 text-green-400 border border-green-500/30 shadow-lg shadow-green-500/10"
                                        : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                                }`
                            }
                        >
                            <div className="relative">
                                <img src={assets.people_icon} alt="" className="w-5 h-5 filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-green-500/20 rounded blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <p className="font-medium">Profile</p>
                            <div className="ml-auto w-2 h-2 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </NavLink>

                    </ul>
                </div>
            )}
        </div>
    );
};

export default Sidebar;