import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const AllAppointments = () => {
  const { aToken, backendUrl } = useContext(AdminContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(backendUrl + '/api/admin/appointments', {
        headers: { Authorization: `Bearer ${aToken}` }
      });

      if (data.success) {
        setAppointments(data.appointments);
        console.log(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, {
        headers: { Authorization: `Bearer ${aToken}` }
      });

      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400">Loading appointments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent mb-2">
          All Appointments
        </h1>
        <p className="text-gray-400">Manage and monitor all patient appointments.</p>
      </div>

      {/* Appointments Table */}
      <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
        
        {/* Table Header */}
        <div className="bg-gray-800/50 border-b border-gray-700/50 px-6 py-4">
          <div className="hidden lg:grid grid-cols-[0.5fr_2.5fr_1fr_2fr_2fr_1fr_1fr] gap-4 text-sm font-semibold text-gray-300">
            <p>#</p>
            <p>Patient</p>
            <p>Age</p>
            <p>Date & Time</p>
            <p>Doctor</p>
            <p>Fees</p>
            <p>Actions</p>
          </div>
        </div>

        {/* Table Body */}
        <div className="max-h-[70vh] overflow-y-auto">
          {appointments.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📅</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Appointments Found</h3>
              <p className="text-gray-400">There are no appointments to display at the moment.</p>
            </div>
          ) : (
            appointments.map((item, index) => (
              <div 
                key={index}
                className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors duration-200"
              >
                {/* Desktop View */}
                <div className="hidden lg:grid grid-cols-[0.5fr_2.5fr_1fr_2fr_2fr_1fr_1fr] gap-4 items-center px-6 py-4 text-sm">
                  <p className="text-gray-400 font-medium">{index + 1}</p>
                  
                  {/* Patient */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-600" 
                        src={item.userData.image} 
                        alt="" 
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    </div>
                    <div>
                      <p className="text-white font-medium">{item.userData.name}</p>
                      <p className="text-gray-400 text-xs">{item.userData.email}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300">{calculateAge(item.userData.dob)} years</p>
                  
                  {/* Date & Time */}
                  <div>
                    <p className="text-white font-medium">{item.slotDate.split('_').join('-')}</p>
                    <p className="text-gray-400 text-xs">{item.slotTime}</p>
                  </div>
                  
                  {/* Doctor */}
                  <div className="flex items-center gap-3">
                    <img 
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-600" 
                      src={item.docData.image} 
                      alt="" 
                    />
                    <div>
                      <p className="text-white font-medium">{item.docData.name}</p>
                      <p className="text-gray-400 text-xs">{item.docData.speciality}</p>
                    </div>
                  </div>
                  
                  <p className="text-green-400 font-semibold">${item.amount}</p>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-center">
                    {item.cancelled ? (
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full border border-red-500/30">
                        Cancelled
                      </span>
                    ) : item.isCompleted ? (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
                        Completed
                      </span>
                    ) : (
                      <button 
                        onClick={() => cancelAppointment(item._id)} 
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors duration-200 group"
                        title="Cancel Appointment"
                      >
                        <img 
                          className="w-5 h-5 filter brightness-0 invert opacity-60 group-hover:opacity-100 transition-opacity duration-200" 
                          src={assets.cancel_icon} 
                          alt="Cancel" 
                        />
                      </button>
                    )}
                  </div>
                </div>

                {/* Mobile View */}
                <div className="lg:hidden p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-600" 
                        src={item.userData.image} 
                        alt="" 
                      />
                      <div>
                        <p className="text-white font-medium">{item.userData.name}</p>
                        <p className="text-gray-400 text-sm">{calculateAge(item.userData.dob)} years</p>
                      </div>
                    </div>
                    <span className="text-green-400 font-semibold">${item.amount}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <img 
                      className="w-8 h-8 rounded-full object-cover border border-gray-600" 
                      src={item.docData.image} 
                      alt="" 
                    />
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{item.docData.name}</p>
                      <p className="text-gray-400 text-xs">{item.docData.speciality}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm">{item.slotDate.split('_').join('-')}</p>
                      <p className="text-gray-400 text-xs">{item.slotTime}</p>
                    </div>
                    
                    <div>
                      {item.cancelled ? (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full">
                          Cancelled
                        </span>
                      ) : item.isCompleted ? (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                          Completed
                        </span>
                      ) : (
                        <button 
                          onClick={() => cancelAppointment(item._id)} 
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                        >
                          <img 
                            className="w-4 h-4 filter brightness-0 invert opacity-60" 
                            src={assets.cancel_icon} 
                            alt="Cancel" 
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};

// Function to calculate age
const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default AllAppointments;