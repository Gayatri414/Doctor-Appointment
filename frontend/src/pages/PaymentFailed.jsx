import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorDetails, setErrorDetails] = useState(null);

  useEffect(() => {
    // Get error details from navigation state
    if (location.state?.error) {
      setErrorDetails(location.state.error);
    }
  }, [location.state]);

  const retryPayment = () => {
    if (errorDetails?.appointmentId) {
      navigate('/my-appointments');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        
        {/* Failed Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600">
            We couldn't process your payment
          </p>
        </div>

        {/* Error Details Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
          
          {errorDetails && (
            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-red-800">Error Details</span>
                </div>
                <p className="text-red-700 text-sm">
                  {errorDetails.reason || 'Payment processing failed'}
                </p>
                {errorDetails.orderId && (
                  <p className="text-red-600 text-xs mt-1">
                    Order ID: {errorDetails.orderId}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Common Reasons */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Common Reasons for Payment Failure:</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Insufficient funds in your account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Card details entered incorrectly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Network connectivity issues</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Transaction limit exceeded</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Card expired or blocked</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            
            {errorDetails?.canRetry && (
              <button
                onClick={retryPayment}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Retry Payment
              </button>
            )}

            <button
              onClick={() => navigate('/my-appointments')}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              View My Appointments
            </button>

            <button
              onClick={() => navigate('/contact')}
              className="w-full text-blue-600 py-2 font-medium hover:text-blue-700 transition"
            >
              Contact Support
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full text-gray-600 py-2 font-medium hover:text-gray-700 transition"
            >
              Back to Home
            </button>

          </div>

        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Need Help?</h4>
              <p className="text-blue-700 text-sm">
                If you continue to face issues, please contact our support team. 
                We're here to help you complete your appointment booking.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentFailed;