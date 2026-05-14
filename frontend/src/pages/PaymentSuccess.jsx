import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    // Get payment details from navigation state
    if (location.state?.paymentDetails) {
      setPaymentDetails(location.state.paymentDetails);
    } else {
      // If no payment details, redirect to appointments
      navigate('/my-appointments');
    }
  }, [location.state, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!paymentDetails) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-green-600 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Your appointment has been confirmed
          </p>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
          
          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-gray-800 mb-1">
              ${paymentDetails.amount}
            </div>
            <div className="text-sm text-gray-500">
              Payment ID: {paymentDetails.paymentId}
            </div>
          </div>

          <div className="space-y-4">
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Order ID</span>
              <span className="font-medium text-sm">{paymentDetails.orderId}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Transaction Date</span>
              <span className="font-medium text-sm">
                {formatDate(paymentDetails.transactionDate)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Status</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {paymentDetails.status}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Currency</span>
              <span className="font-medium">{paymentDetails.currency}</span>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            
            <button
              onClick={() => navigate('/my-appointments')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              View My Appointments
            </button>

            <button
              onClick={() => navigate('/payment-invoice', { 
                state: { paymentDetails } 
              })}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Download Invoice
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full text-blue-600 py-2 font-medium hover:text-blue-700 transition"
            >
              Back to Home
            </button>

          </div>

        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>

      </div>
    </div>
  );
};

export default PaymentSuccess;