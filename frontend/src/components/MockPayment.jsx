import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MockPayment = ({ 
  appointmentData, 
  onSuccess, 
  onFailure, 
  onClose 
}) => {
  const { backendUrl, token } = useContext(AppContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('review'); // 'review', 'processing', 'success', 'failed'

  // Mock payment methods
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'upi', name: 'UPI Payment', icon: '📱' },
    { id: 'wallet', name: 'Digital Wallet', icon: '💰' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦' }
  ];

  const [selectedMethod, setSelectedMethod] = useState('card');

  // Process mock payment
  const processMockPayment = async () => {
    try {
      setIsProcessing(true);
      setPaymentStep('processing');

      // Create payment order first
      const orderResponse = await axios.post(
        backendUrl + '/api/mock-payment/create-order',
        { appointmentId: appointmentData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message);
      }

      const { order } = orderResponse.data;

      // Process the payment
      const paymentResponse = await axios.post(
        backendUrl + '/api/mock-payment/process-payment',
        { 
          orderId: order.id,
          appointmentId: appointmentData._id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (paymentResponse.data.success) {
        setPaymentStep('success');
        setTimeout(() => {
          onSuccess(paymentResponse.data.paymentDetails);
        }, 2000);
      } else {
        setPaymentStep('failed');
        setTimeout(() => {
          onFailure(paymentResponse.data.error);
        }, 1500);
      }

    } catch (error) {
      console.log(error);
      setPaymentStep('failed');
      toast.error(error.response?.data?.message || error.message);
      setTimeout(() => {
        onFailure({ reason: error.message, canRetry: true });
      }, 1500);
    } finally {
      setIsProcessing(false);
    }
  };

  // Retry payment
  const retryPayment = () => {
    setPaymentStep('review');
  };

  if (paymentStep === 'processing') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Processing Payment</h3>
          <p className="text-gray-600">Please wait while we process your payment...</p>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStep === 'success') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-green-600 mb-2">Payment Successful!</h3>
          <p className="text-gray-600">Your appointment has been confirmed.</p>
        </div>
      </div>
    );
  }

  if (paymentStep === 'failed') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">Payment Failed</h3>
          <p className="text-gray-600 mb-4">Something went wrong with your payment.</p>
          <div className="flex gap-3">
            <button
              onClick={retryPayment}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Retry Payment
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-3">Order Summary</h3>
          
          <div className="flex items-center gap-3 mb-4">
            <img
              src={appointmentData.docData.image}
              alt={appointmentData.docData.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{appointmentData.docData.name}</p>
              <p className="text-sm text-gray-600">{appointmentData.docData.speciality}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{appointmentData.slotDate.split('_').join('-')}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span>{appointmentData.slotTime}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total Amount:</span>
              <span>${appointmentData.amount}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Select Payment Method</h3>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                  selectedMethod === method.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="text-blue-600"
                />
                <span className="text-2xl">{method.icon}</span>
                <span className="font-medium">{method.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Mock Card Details (for demo) */}
        {selectedMethod === 'card' && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-3">Card Details (Demo)</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full p-2 border rounded"
                defaultValue="1234 5678 9012 3456"
                readOnly
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="flex-1 p-2 border rounded"
                  defaultValue="12/25"
                  readOnly
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="flex-1 p-2 border rounded"
                  defaultValue="123"
                  readOnly
                />
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              * This is a demo. No real payment will be processed.
            </p>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-green-600">🔒</span>
            <span className="text-sm text-green-700">
              This is a secure mock payment for demonstration purposes
            </span>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={processMockPayment}
          disabled={isProcessing}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </div>
          ) : (
            `Pay $${appointmentData.amount}`
          )}
        </button>

        {/* Demo Notice */}
        <p className="text-xs text-gray-500 text-center mt-3">
          Demo Mode: 90% success rate, 10% failure rate for testing
        </p>
      </div>
    </div>
  );
};

export default MockPayment;