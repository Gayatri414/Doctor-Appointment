import React, { useContext } from "react";
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
    const { aToken } = useContext(AdminContext);
    const { dToken } = useContext(DoctorContext);

    return (
        <div className="min-h-screen bg-white border-r">
            {aToken && (
                <ul className="text-[#515151] mt-5 space-y-2">

                    <NavLink
                        to="/admin-dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 ps-3 md:px-9 md:min-w-72 cursor-pointer rounded-lg ${
                                isActive
                                    ? "bg-blue-100 text-blue-900 border-r-4 border-blue-900"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        <img src={assets.home_icon} alt="" className="w-5" />
                        <p>Dashboard</p>
                    </NavLink>

                    <NavLink
                        to="/all-appointments"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 ps-3 md:px-9 md:min-w-72 cursor-pointer rounded-lg ${
                                isActive
                                    ?"bg-blue-100 text-blue-900 border-r-4 border-blue-900"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        <img src={assets.appointment_icon} alt="" className="w-5" />
                        <p>Appointments</p>
                    </NavLink>

                    <NavLink
                        to="/add-doctor"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 ps-3 md:px-9 md:min-w-72 cursor-pointer rounded-lg ${
                                isActive
                                    ?"bg-blue-100 text-blue-900 border-r-4 border-blue-900"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        <img src={assets.add_icon} alt="" className="w-5" />
                        <p>Add Doctor</p>
                    </NavLink>

                    <NavLink
                        to="/doctor-list"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 ps-3 md:px-9 md:min-w-72 cursor-pointer rounded-lg ${
                                isActive
                                    ? "bg-blue-100 text-blue-900 border-r-4 border-blue-900"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        <img src={assets.people_icon} alt="" className="w-5" />
                        <p>Doctors List</p>
                    </NavLink>

                </ul>
            )}

            {dToken && (
                <ul className="text-[#515151] mt-5 space-y-2">

                    <NavLink
                        to="/doctor-dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 ps-3 md:px-9 md:min-w-72 cursor-pointer rounded-lg ${
                                isActive
                                    ? "bg-blue-100 text-blue-900 border-r-4 border-blue-900"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        <img src={assets.home_icon} alt="" className="w-5" />
                        <p>Dashboard</p>
                    </NavLink>

                    <NavLink
                        to="/doctor-appointments"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 ps-3 md:px-9 md:min-w-72 cursor-pointer rounded-lg ${
                                isActive
                                    ?"bg-blue-100 text-blue-900 border-r-4 border-blue-900"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        <img src={assets.appointment_icon} alt="" className="w-5" />
                        <p>Appointments</p>
                    </NavLink>

                    <NavLink
                        to="/doctor-profile"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 ps-3 md:px-9 md:min-w-72 cursor-pointer rounded-lg ${
                                isActive
                                    ?"bg-blue-100 text-blue-900 border-r-4 border-blue-900"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        <img src={assets.people_icon} alt="" className="w-5" />
                        <p>Profile</p>
                    </NavLink>

                </ul>
            )}
        </div>
    );
};

export default Sidebar;