import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";

const PaymentInvoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const invoiceRef = useRef();

  useEffect(() => {
    if (location.state?.paymentDetails) {
      setPaymentDetails(location.state.paymentDetails);
    } else {
      navigate('/my-appointments');
    }
  }, [location.state, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadInvoice = () => {
    window.print();
  };

  if (!paymentDetails) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <button
            onClick={() => navigate('/my-appointments')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Appointments
          </button>
          
          <button
            onClick={downloadInvoice}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Invoice
          </button>
        </div>

        {/* Invoice */}
        <div ref={invoiceRef} className="bg-white rounded-lg shadow-lg p-8 print:shadow-none print:rounded-none">
          
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <img src={assets.logo} alt="Logo" className="h-12 mb-4" />
              <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
              <p className="text-gray-600">Payment Receipt</p>
            </div>
            
            <div className="text-right">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-2">
                PAID
              </div>
              <p className="text-sm text-gray-600">Invoice Date</p>
              <p className="font-semibold">{formatDate(paymentDetails.transactionDate)}</p>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
            {/* Bill To */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Bill To:</h3>
              <div className="text-gray-600">
                <p className="font-medium">Patient Name</p>
                <p>patient@example.com</p>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>

            {/* Invoice Info */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Invoice Details:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Invoice ID:</span>
                  <span className="font-medium">INV-{paymentDetails.paymentId.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-medium">{paymentDetails.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{paymentDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Date:</span>
                  <span className="font-medium">{formatDateTime(paymentDetails.transactionDate)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-800 mb-4">Service Details:</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Description</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-800">Qty</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-800">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">Doctor Consultation</p>
                        <p className="text-sm text-gray-600">Appointment booking fee</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Appointment ID: {paymentDetails.appointmentId}
                        </p>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">1</td>
                    <td className="text-right py-4 px-4 font-semibold">
                      ${paymentDetails.amount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="border-t-2 border-gray-200 pt-6">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>${paymentDetails.amount}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (0%):</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Discount:</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                      <span>Total:</span>
                      <span>${paymentDetails.amount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Payment Method:</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">💳</span>
                    </div>
                    <div>
                      <p className="font-medium">Mock Payment Gateway</p>
                      <p className="text-sm text-gray-600">Demo Transaction</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Transaction Status:</h3>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-green-800">Payment Successful</p>
                      <p className="text-sm text-green-600">Transaction Completed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
            <p className="mb-2">Thank you for choosing our healthcare services!</p>
            <p>For any queries regarding this invoice, please contact our support team.</p>
            <p className="mt-4 font-medium">
              Email: support@healthcare.com | Phone: +1 (555) 123-4567
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PaymentInvoice;