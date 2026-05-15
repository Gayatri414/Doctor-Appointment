import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentHistory = () => {
  const { backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'success', 'failed', 'pending'

  // Get payment history
  const getPaymentHistory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(backendUrl + '/api/mock-payment/history', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setPayments(data.payments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Payment history error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getPaymentHistory();
    }
  }, [token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      success: { bg: 'bg-green-100', text: 'text-green-800', label: 'Success' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      refunded: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Refunded' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  const viewInvoice = (payment) => {
    if (payment.status === 'success') {
      navigate('/payment-invoice', {
        state: {
          paymentDetails: {
            paymentId: payment.paymentId,
            orderId: payment.orderId,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            transactionDate: payment.transactionDate,
            appointmentId: payment.appointmentId
          }
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 py-10 min-h-[80vh]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Payment <span className="text-blue-500">History</span>
          </h1>
          <p className="text-gray-600">Track all your payment transactions</p>
        </div>

        {/* Filter */}
        <div className="mt-4 sm:mt-0">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Payments</option>
            <option value="success">Successful</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold">{payments.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💳</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Successful</p>
              <p className="text-2xl font-bold text-green-600">
                {payments.filter(p => p.status === 'success').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">
                {payments.filter(p => p.status === 'failed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">❌</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold">
                ${payments.filter(p => p.status === 'success').reduce((sum, p) => sum + p.amount, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

      </div>

      {/* Payments List */}
      {filteredPayments.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <div className="text-6xl mb-4">💳</div>
          <h3 className="text-xl font-semibold mb-2">No Payments Found</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? "You haven't made any payments yet." 
              : `No ${filter} payments found.`
            }
          </p>
          <button
            onClick={() => navigate('/doctors')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Book an Appointment
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-4 border-b">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 font-semibold text-gray-700">
              <div>Payment ID</div>
              <div>Doctor</div>
              <div>Amount</div>
              <div>Date</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredPayments.map((payment, index) => (
              <div key={index} className="px-6 py-4 hover:bg-gray-50 transition">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  
                  {/* Payment ID */}
                  <div>
                    <p className="font-medium text-sm">
                      {payment.paymentId || payment.orderId}
                    </p>
                    <p className="text-xs text-gray-500">
                      Order: {payment.orderId.slice(-8)}
                    </p>
                  </div>

                  {/* Doctor */}
                  <div>
                    {payment.appointmentDetails ? (
                      <div>
                        <p className="font-medium text-sm">
                          {payment.appointmentDetails.doctorName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {payment.appointmentDetails.speciality}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">N/A</p>
                    )}
                  </div>

                  {/* Amount */}
                  <div>
                    <p className="font-semibold">${payment.amount}</p>
                    <p className="text-xs text-gray-500">{payment.currency}</p>
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-sm">{formatDate(payment.transactionDate)}</p>
                  </div>

                  {/* Status */}
                  <div>
                    {getStatusBadge(payment.status)}
                    {payment.failureReason && (
                      <p className="text-xs text-red-600 mt-1">
                        {payment.failureReason}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {payment.status === 'success' && (
                      <button
                        onClick={() => viewInvoice(payment)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Invoice
                      </button>
                    )}
                    {payment.status === 'failed' && (
                      <button
                        onClick={() => navigate('/my-appointments')}
                        className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                      >
                        Retry
                      </button>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};

export default PaymentHistory;