import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { aToken, backendUrl } = useContext(AdminContext);
  const [dashData, setDashData] = useState(false);
  const [paymentStats, setPaymentStats] = useState(null);
  const [isLoadingDash, setIsLoadingDash] = useState(false);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);

  // Memoize API functions to prevent re-renders
  const getDashData = useCallback(async () => {
    if (!aToken || isLoadingDash) return;
    
    setIsLoadingDash(true);
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${aToken}` }
      });

      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (!error.response?.data?.message?.includes('expired')) {
        toast.error(error.response?.data?.message || error.message);
      }
    } finally {
      setIsLoadingDash(false);
    }
  }, [aToken, backendUrl, isLoadingDash]);

  const getPaymentStats = useCallback(async () => {
    if (!aToken || isLoadingPayments) return;
    
    setIsLoadingPayments(true);
    try {
      const { data } = await axios.get(backendUrl + '/api/mock-payment/admin/all-payments', {
        headers: { Authorization: `Bearer ${aToken}` }
      });

      if (data.success) {
        const payments = data.payments;
        const stats = {
          totalPayments: payments.length,
          successfulPayments: payments.filter(p => p.status === 'success').length,
          failedPayments: payments.filter(p => p.status === 'failed').length,
          totalRevenue: payments.filter(p => p.status === 'success').reduce((sum, p) => sum + p.amount, 0)
        };
        setPaymentStats(stats);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingPayments(false);
    }
  }, [aToken, backendUrl, isLoadingPayments]);

  const cancelAppointment = useCallback(async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, {
        headers: { Authorization: `Bearer ${aToken}` }
      });

      if (data.success) {
        toast.success(data.message);
        // Refresh dashboard data after cancellation
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (!error.response?.data?.message?.includes('expired')) {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  }, [aToken, backendUrl, getDashData]);

  // Load data only when token changes, not on every render
  useEffect(() => {
    if (aToken) {
      getDashData();
      getPaymentStats();
    }
  }, [aToken]); // Only depend on aToken

  // Memoize loading state
  const isLoading = useMemo(() => {
    return isLoadingDash || isLoadingPayments || !dashData;
  }, [isLoadingDash, isLoadingPayments, dashData]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-400">Welcome back! Here's what's happening with your healthcare platform.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
              <img className="w-8 h-8 filter brightness-0 invert" src={assets.doctor_icon} alt="" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{dashData.doctors}</p>
              <p className="text-gray-400 text-sm">Total Doctors</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-blue-400">Active</span>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-orange-500/50 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-xl flex items-center justify-center">
              <img className="w-8 h-8 filter brightness-0 invert" src={assets.appointments_icon} alt="" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{dashData.appointments}</p>
              <p className="text-gray-400 text-sm">Appointments</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-xs text-orange-400">Scheduled</span>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center">
              <img className="w-8 h-8 filter brightness-0 invert" src={assets.patients_icon} alt="" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{dashData.patients}</p>
              <p className="text-gray-400 text-sm">Total Patients</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-400">Registered</span>
          </div>
        </div>

        {paymentStats && (
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">${paymentStats.totalRevenue}</p>
                <p className="text-gray-400 text-sm">Total Revenue</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-purple-400">Earned</span>
            </div>
          </div>
        )}

      </div>

      {/* Payment Statistics */}
      {paymentStats && (
        <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📊</span>
            </div>
            Payment Analytics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-gradient-to-r from-blue-600/10 to-blue-700/10 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-400 mb-1">Total Payments</p>
                  <p className="text-3xl font-bold text-white">{paymentStats.totalPayments}</p>
                </div>
                <div className="text-3xl opacity-50">💳</div>
              </div>
              <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{width: '100%'}}></div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600/10 to-green-700/10 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-400 mb-1">Successful</p>
                  <p className="text-3xl font-bold text-white">{paymentStats.successfulPayments}</p>
                </div>
                <div className="text-3xl opacity-50">✅</div>
              </div>
              <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{width: `${paymentStats.totalPayments > 0 ? (paymentStats.successfulPayments / paymentStats.totalPayments) * 100 : 0}%`}}></div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-600/10 to-red-700/10 border border-red-500/20 rounded-xl p-6 hover:border-red-500/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-400 mb-1">Failed</p>
                  <p className="text-3xl font-bold text-white">{paymentStats.failedPayments}</p>
                </div>
                <div className="text-3xl opacity-50">❌</div>
              </div>
              <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" style={{width: `${paymentStats.totalPayments > 0 ? (paymentStats.failedPayments / paymentStats.totalPayments) * 100 : 0}%`}}></div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Latest Bookings */}
      <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">

        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-700/50 bg-gray-800/50">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <img className="w-4 h-4 filter brightness-0 invert" src={assets.list_icon} alt="" />
          </div>
          <h3 className="text-lg font-bold text-white">Latest Bookings</h3>
          <div className="ml-auto px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
            {dashData.latestAppointments?.length || 0} Recent
          </div>
        </div>

        <div className="divide-y divide-gray-700/50">
          {dashData.latestAppointments?.map((item, index) => (
            <div className="flex items-center px-6 py-4 hover:bg-gray-700/30 transition-colors duration-200 group" key={item._id || index}>
              <div className="relative">
                <img className="rounded-full w-12 h-12 object-cover border-2 border-gray-600 group-hover:border-blue-500 transition-colors duration-200" src={item.docData.image} alt="" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>
              <div className="flex-1 ml-4">
                <p className="text-white font-semibold group-hover:text-blue-400 transition-colors duration-200">{item.docData.name}</p>
                <p className="text-gray-400 text-sm">{item.slotDate}</p>
              </div>
              <div className="flex items-center gap-3">
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
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors duration-200 group/btn"
                  >
                    <img 
                      className="w-5 h-5 filter brightness-0 invert opacity-60 group-hover/btn:opacity-100 transition-opacity duration-200" 
                      src={assets.cancel_icon} 
                      alt="" 
                    />
                  </button>
                )}
              </div>
            </div>
          )) || (
            <div className="px-6 py-8 text-center text-gray-400">
              No recent appointments
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Dashboard;