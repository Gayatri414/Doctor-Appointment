import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import MockPayment from "../components/MockPayment";

const MyAppointment = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  };

  // Getting user appointments data from Database
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/appointment/list', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Function to cancel appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/appointment/cancel', { appointmentId }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Function to initiate mock payment
  const initiatePayment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowPayment(true);
  };

  // Handle payment success
  const handlePaymentSuccess = (paymentDetails) => {
    setShowPayment(false);
    setSelectedAppointment(null);
    toast.success("Payment successful!");
    getUserAppointments();
    
    // Navigate to success page
    navigate('/payment-success', {
      state: { paymentDetails }
    });
  };

  // Handle payment failure
  const handlePaymentFailure = (error) => {
    setShowPayment(false);
    setSelectedAppointment(null);
    toast.error("Payment failed: " + error.reason);
    
    // Navigate to failure page
    navigate('/payment-failed', {
      state: { error }
    });
  };

  // Close payment modal
  const closePayment = () => {
    setShowPayment(false);
    setSelectedAppointment(null);
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div className="px-6 md:px-16 py-10 min-h-[80vh]">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          My <span className="text-blue-500">Appointments</span>
        </h1>
        
        <button
          onClick={() => navigate('/payment-history')}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
        >
          Payment History
        </button>
      </div>

      {/* Appointments List */}
      <div className="flex flex-col gap-6">

        {appointments.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">No Appointments Found</h3>
            <p className="text-gray-600 mb-6">You haven't booked any appointments yet.</p>
            <button
              onClick={() => navigate('/doctors')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Book an Appointment
            </button>
          </div>
        ) : (
          appointments.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-6 border rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >

              {/* Image */}
              <div className="w-full md:w-40">
                <img
                  className="w-full h-40 object-cover rounded-lg"
                  src={item.docData.image}
                  alt={item.docData.name}
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-sm text-gray-700">

                <p className="text-lg font-semibold text-gray-900">
                  {item.docData.name}
                </p>

                <p className="text-gray-500">
                  {item.docData.speciality}
                </p>

                <p className="mt-2 font-medium">Address:</p>
                <p>{item.docData.address?.line1}</p>
                <p>{item.docData.address?.line2}</p>

                <p className="mt-2">
                  <span className="font-medium">Date & Time:</span>{" "}
                  {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>

                <p className="mt-2">
                  <span className="font-medium">Amount:</span>{" "}
                  <span className="text-green-600 font-semibold">${item.amount}</span>
                </p>

              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 justify-center min-w-[150px]">

                {!item.cancelled && item.payment && !item.isCompleted && (
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-center font-medium">
                    ✓ Paid
                  </div>
                )}

                {!item.cancelled && !item.payment && !item.isCompleted && (
                  <button 
                    onClick={() => initiatePayment(item)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition font-medium"
                  >
                    💳 Pay Now
                  </button>
                )}

                {!item.cancelled && !item.isCompleted && (
                  <button 
                    onClick={() => cancelAppointment(item._id)}
                    className="border border-red-500 text-red-500 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition font-medium"
                  >
                    Cancel
                  </button>
                )}

                {item.cancelled && (
                  <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-center font-medium">
                    ❌ Cancelled
                  </div>
                )}

                {item.isCompleted && (
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-center font-medium">
                    ✅ Completed
                  </div>
                )}

                {/* View Invoice Button for Paid Appointments */}
                {item.payment && item.paymentId && (
                  <button
                    onClick={() => navigate('/payment-invoice', {
                      state: {
                        paymentDetails: {
                          paymentId: item.paymentId,
                          orderId: item.razorpayOrderId || 'N/A',
                          amount: item.amount,
                          currency: 'USD',
                          status: 'success',
                          transactionDate: item.date,
                          appointmentId: item._id
                        }
                      }
                    })}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition font-medium text-sm"
                  >
                    📄 Invoice
                  </button>
                )}

              </div>

            </div>
          ))
        )}

      </div>

      {/* Mock Payment Modal */}
      {showPayment && selectedAppointment && (
        <MockPayment
          appointmentData={selectedAppointment}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
          onClose={closePayment}
        />
      )}

    </div>
  );
};

export default MyAppointment;