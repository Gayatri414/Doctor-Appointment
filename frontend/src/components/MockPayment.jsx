import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
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
  const [selectedMethod, setSelectedMethod] = useState('card');

  // Mock payment methods with modern design
  const paymentMethods = [
    { 
      id: 'card', 
      name: 'Credit/Debit Card', 
      icon: '💳',
      description: 'Visa, Mastercard, Amex'
    },
    { 
      id: 'upi', 
      name: 'UPI Payment', 
      icon: '📱',
      description: 'Google Pay, PhonePe, Paytm'
    },
    { 
      id: 'wallet', 
      name: 'Digital Wallet', 
      icon: '💰',
      description: 'Paytm, Amazon Pay'
    },
    { 
      id: 'netbanking', 
      name: 'Net Banking', 
      icon: '🏦',
      description: 'All major banks'
    }
  ];

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const parts = dateString.split('_');
    if (parts.length !== 3) return dateString;
    
    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = parts[0];
    const month = months[parseInt(parts[1])] || parts[1];
    const year = parts[2];
    
    return `${day} ${month} ${year}`;
  };

  // Calculate fees
  const consultationFee = appointmentData?.amount || 0;
  const platformFee = Math.round(consultationFee * 0.05); // 5% platform fee
  const tax = Math.round((consultationFee + platformFee) * 0.18); // 18% tax
  const totalAmount = consultationFee + platformFee + tax;

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

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Process the payment
      const paymentResponse = await axios.post(
        backendUrl + '/api/mock-payment/process-payment',
        { 
          orderId: order.id,
          appointmentId: appointmentData._id,
          paymentMethod: selectedMethod
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (paymentResponse.data.success) {
        setPaymentStep('success');
        setTimeout(() => {
          onSuccess(paymentResponse.data.paymentDetails);
        }, 1500);
      } else {
        setPaymentStep('failed');
        setTimeout(() => {
          onFailure(paymentResponse.data.error);
        }, 1500);
      }

    } catch (error) {
      console.error('Payment error:', error);
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

  // Processing state
  if (paymentStep === 'processing') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <h3 className="text-2xl font-bold mb-2 text-gray-800">Processing Payment</h3>
          <p className="text-gray-600 mb-6">Please wait while we securely process your payment...</p>
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full animate-pulse transition-all duration-1000" style={{width: '75%'}}></div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Do not close this window</p>
        </div>
      </div>
    );
  }

  // Success state
  if (paymentStep === 'success') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <div className="text-5xl">✅</div>
          </div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-4">Your appointment has been confirmed.</p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm text-green-700">You will receive a confirmation email shortly.</p>
          </div>
        </div>
      </div>
    );
  }

  // Failed state
  if (paymentStep === 'failed') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <div className="text-5xl">❌</div>
          </div>
          <h3 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h3>
          <p className="text-gray-600 mb-6">Something went wrong with your payment. Please try again.</p>
          <div className="flex gap-3">
            <button
              onClick={retryPayment}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105"
            >
              Retry Payment
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main payment review UI
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
        
        {/* Content with scroll */}
        <div className="overflow-y-auto max-h-[95vh]">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Complete Payment</h2>
                <p className="text-blue-100 text-sm">Secure payment gateway</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center text-2xl transition-all"
              >
                ×
              </button>
            </div>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-6 p-6">
            
            {/* LEFT COLUMN - Appointment Summary */}
            <div className="space-y-6">
              
              {/* Appointment Details Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800 text-lg">Appointment Summary</h3>
                </div>
                
                <div className="p-6">
                  {/* Doctor Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <img
                        src={appointmentData?.docData?.image || "https://via.placeholder.com/80"}
                        alt={appointmentData?.docData?.name || "Doctor"}
                        className="w-20 h-20 rounded-2xl object-cover shadow-md"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/80?text=Doctor" }}
                      />
                      <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg text-gray-800">
                        {appointmentData?.docData?.name || "Doctor Name"}
                      </p>
                      <p className="text-blue-600 text-sm font-medium">
                        {appointmentData?.docData?.speciality || "Speciality"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {appointmentData?.docData?.experience || "Experienced"}
                      </p>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="text-2xl">📅</div>
                      <div>
                        <p className="text-xs text-gray-500">Appointment Date</p>
                        <p className="font-semibold text-gray-800">
                          {formatDate(appointmentData?.slotDate) || 'Not set'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="text-2xl">🕐</div>
                      <div>
                        <p className="text-xs text-gray-500">Appointment Time</p>
                        <p className="font-semibold text-gray-800">
                          {appointmentData?.slotTime || 'Not set'}
                        </p>
                      </div>
                    </div>

                    {appointmentData?.docData?.address && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="text-2xl">📍</div>
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="font-medium text-gray-700 text-sm">
                            {appointmentData.docData.address.line1}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Price Summary Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800 text-lg">Price Breakdown</h3>
                </div>
                
                <div className="p-6 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Consultation Fee</span>
                    <span className="font-semibold">${consultationFee}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Platform Fee</span>
                    <span className="font-semibold">${platformFee}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (18%)</span>
                    <span className="font-semibold">${tax}</span>
                  </div>
                  
                  <div className="border-t-2 border-dashed border-gray-300 my-4"></div>
                  
                  <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                    <span className="font-bold text-gray-800 text-lg">Total Amount</span>
                    <span className="font-bold text-blue-600 text-2xl">${totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Payment Methods */}
            <div className="space-y-6">
              
              {/* Payment Methods Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800 text-lg">Select Payment Method</h3>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`relative flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-102 ${
                          selectedMethod === method.id
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedMethod === method.id}
                          onChange={(e) => setSelectedMethod(e.target.value)}
                          className="sr-only"
                        />
                        
                        {/* Custom Radio Button */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedMethod === method.id 
                            ? 'border-blue-500' 
                            : 'border-gray-300'
                        }`}>
                          {selectedMethod === method.id && (
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 flex items-center gap-3">
                          <div className="text-3xl">{method.icon}</div>
                          <div>
                            <p className="font-semibold text-gray-800">{method.name}</p>
                            <p className="text-xs text-gray-500">{method.description}</p>
                          </div>
                        </div>
                        
                        {selectedMethod === method.id && (
                          <div className="text-blue-500">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Details (for demo) */}
              {selectedMethod === 'card' && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>💳</span>
                    Card Details <span className="text-xs text-blue-600 font-normal">(Demo Mode)</span>
                  </h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full p-3 border border-blue-200 rounded-xl bg-white"
                      defaultValue="1234 5678 9012 3456"
                      readOnly
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="p-3 border border-blue-200 rounded-xl bg-white"
                        defaultValue="12/25"
                        readOnly
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="p-3 border border-blue-200 rounded-xl bg-white"
                        defaultValue="123"
                        readOnly
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      className="w-full p-3 border border-blue-200 rounded-xl bg-white"
                      defaultValue="JOHN DOE"
                      readOnly
                    />
                  </div>
                  <div className="mt-4 bg-blue-100 border border-blue-300 rounded-xl p-3">
                    <p className="text-xs text-blue-700 flex items-center gap-2">
                      <span>ℹ️</span>
                      This is a demo payment. No real transaction will occur.
                    </p>
                  </div>
                </div>
              )}

              {/* Security Badge */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🔒</div>
                  <div>
                    <p className="font-semibold text-green-800">Secure Payment</p>
                    <p className="text-xs text-green-600">256-bit SSL encrypted transaction</p>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={processMockPayment}
                disabled={isProcessing}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all transform shadow-lg ${
                  isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:scale-105 hover:shadow-xl'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Pay ${totalAmount}</span>
                    <span>→</span>
                  </div>
                )}
              </button>

              {/* Demo Notice */}
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  🎭 Demo Mode: 90% success rate for testing purposes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockPayment;

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