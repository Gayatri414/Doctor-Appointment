import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { aToken, backendUrl } = useContext(AdminContext);
  const [dashData, setDashData] = useState(false);
  const [paymentStats, setPaymentStats] = useState(null);

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${aToken}` }
      });

      if (data.success) {
        setDashData(data.dashData);
        console.log(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const getPaymentStats = async () => {
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
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, {
        headers: { Authorization: `Bearer ${aToken}` }
      });

      if (data.success) {
        toast.success(data.message);
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (aToken) {
      getDashData();
      getPaymentStats();
    }
  }, [aToken]);

  return dashData && (
    <div className="m-5">

      <div className="flex flex-wrap gap-3">

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.doctor_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashData.doctors}</p>
            <p className="text-gray-400">Doctors</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.appointments_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashData.appointments}</p>
            <p className="text-gray-400">Appointments</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.patients_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashData.patients}</p>
            <p className="text-gray-400">Patients</p>
          </div>
        </div>

        {paymentStats && (
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-600">${paymentStats.totalRevenue}</p>
              <p className="text-gray-400">Revenue</p>
            </div>
          </div>
        )}

      </div>

      {/* Payment Statistics */}
      {paymentStats && (
        <div className="bg-white rounded-lg border mt-6 p-6">
          <h3 className="text-lg font-semibold mb-4">Payment Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Total Payments</p>
                  <p className="text-2xl font-bold text-blue-800">{paymentStats.totalPayments}</p>
                </div>
                <div className="text-2xl">💳</div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Successful</p>
                  <p className="text-2xl font-bold text-green-800">{paymentStats.successfulPayments}</p>
                </div>
                <div className="text-2xl">✅</div>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600">Failed</p>
                  <p className="text-2xl font-bold text-red-800">{paymentStats.failedPayments}</p>
                </div>
                <div className="text-2xl">❌</div>
              </div>
            </div>

          </div>
        </div>
      )}

      <div className="bg-white">

        <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
          <img className="w-5" src={assets.list_icon} alt="" />
          <p className="font-semibold">Latest Bookings</p>
        </div>

        <div className="pt-4 border border-t-0">
          {dashData.latestAppointments.map((item, index) => (
            <div className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100" key={index}>
              <img className="rounded-full w-10" src={item.docData.image} alt="" />
              <div className="flex-1 text-sm">
                <p className="text-gray-800 font-medium">{item.docData.name}</p>
                <p className="text-gray-600">{item.slotDate}</p>
              </div>
              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-500 text-xs font-medium">Completed</p>
              ) : (
                <img 
                  onClick={() => cancelAppointment(item._id)} 
                  className="w-10 cursor-pointer" 
                  src={assets.cancel_icon} 
                  alt="" 
                />
              )}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default Dashboard;