import appointmentModel from "../models/appointmentModel.js";
import paymentModel from "../models/paymentModel.js";
import userModel from "../models/userModel.js";
import crypto from "crypto";

// Utility function to generate fake payment IDs
const generatePaymentId = () => {
  return 'pay_' + crypto.randomBytes(12).toString('hex');
};

const generateOrderId = () => {
  return 'order_' + crypto.randomBytes(12).toString('hex');
};

// Simulate payment processing delay
const simulatePaymentDelay = () => {
  return new Promise(resolve => setTimeout(resolve, 2000));
};

// Simulate payment success/failure (90% success, 10% failure)
const simulatePaymentResult = () => {
  const random = Math.random();
  return {
    success: random <= 0.9, // 90% success rate
    failureReason: random > 0.9 ? getRandomFailureReason() : null
  };
};

const getRandomFailureReason = () => {
  const reasons = [
    'Insufficient funds',
    'Card declined',
    'Network timeout',
    'Invalid card details',
    'Transaction limit exceeded'
  ];
  return reasons[Math.floor(Math.random() * reasons.length)];
};

// API to create mock payment order
const createMockPaymentOrder = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const { userId } = req.body; // From auth middleware

    // Get appointment details
    const appointmentData = await appointmentModel.findById(appointmentId);
    
    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ 
        success: false, 
        message: "Appointment not found or cancelled" 
      });
    }

    if (appointmentData.payment) {
      return res.json({ 
        success: false, 
        message: "Payment already completed for this appointment" 
      });
    }

    // Generate fake order details
    const orderId = generateOrderId();
    const amount = appointmentData.amount;

    // Create payment record with pending status
    const paymentData = new paymentModel({
      userId,
      appointmentId,
      orderId,
      paymentId: '', // Will be generated after successful payment
      amount,
      status: 'pending',
      metadata: {
        userAgent: req.headers['user-agent'] || 'Unknown',
        ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
        deviceInfo: 'Mock Payment Device'
      }
    });

    await paymentData.save();

    // Return mock order details (similar to Razorpay format)
    const mockOrder = {
      id: orderId,
      amount: amount * 100, // Convert to cents (like Razorpay)
      currency: 'USD',
      receipt: appointmentId,
      status: 'created',
      created_at: Math.floor(Date.now() / 1000)
    };

    res.json({ 
      success: true, 
      order: mockOrder,
      message: "Mock payment order created successfully"
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to process mock payment
const processMockPayment = async (req, res) => {
  try {
    const { orderId, appointmentId } = req.body;
    const { userId } = req.body; // From auth middleware

    // Find the pending payment record
    const paymentRecord = await paymentModel.findOne({ 
      orderId, 
      userId, 
      appointmentId,
      status: 'pending' 
    });

    if (!paymentRecord) {
      return res.json({ 
        success: false, 
        message: "Payment record not found or already processed" 
      });
    }

    // Simulate payment processing delay
    await simulatePaymentDelay();

    // Simulate payment result
    const paymentResult = simulatePaymentResult();

    if (paymentResult.success) {
      // Generate payment ID for successful payment
      const paymentId = generatePaymentId();

      // Update payment record
      await paymentModel.findByIdAndUpdate(paymentRecord._id, {
        paymentId,
        status: 'success',
        transactionDate: new Date()
      });

      // Update appointment status
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        payment: true,
        paymentId,
        status: 'confirmed'
      });

      // Return success response
      res.json({
        success: true,
        message: "Payment processed successfully",
        paymentDetails: {
          paymentId,
          orderId,
          amount: paymentRecord.amount,
          currency: paymentRecord.currency,
          status: 'success',
          transactionDate: new Date().toISOString(),
          appointmentId
        }
      });

    } else {
      // Update payment record with failure
      await paymentModel.findByIdAndUpdate(paymentRecord._id, {
        status: 'failed',
        failureReason: paymentResult.failureReason
      });

      // Return failure response
      res.json({
        success: false,
        message: "Payment failed",
        error: {
          reason: paymentResult.failureReason,
          orderId,
          appointmentId,
          canRetry: true
        }
      });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get payment history for user
const getPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.body; // From auth middleware

    const payments = await paymentModel.find({ userId }).sort({ createdAt: -1 });

    // Get appointment details for each payment
    const paymentHistory = await Promise.all(
      payments.map(async (payment) => {
        const appointment = await appointmentModel.findById(payment.appointmentId);
        return {
          ...payment.toObject(),
          appointmentDetails: appointment ? {
            doctorName: appointment.docData?.name,
            speciality: appointment.docData?.speciality,
            slotDate: appointment.slotDate,
            slotTime: appointment.slotTime
          } : null
        };
      })
    );

    res.json({ 
      success: true, 
      payments: paymentHistory 
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get payment details by ID
const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { userId } = req.body; // From auth middleware

    const payment = await paymentModel.findOne({ paymentId, userId });

    if (!payment) {
      return res.json({ 
        success: false, 
        message: "Payment not found" 
      });
    }

    // Get related appointment and user details
    const appointment = await appointmentModel.findById(payment.appointmentId);
    const user = await userModel.findById(userId).select('-password');

    const paymentDetails = {
      ...payment.toObject(),
      appointmentDetails: appointment,
      userDetails: user
    };

    res.json({ 
      success: true, 
      payment: paymentDetails 
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to retry failed payment
const retryPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const { userId } = req.body; // From auth middleware

    // Find the failed payment record
    const paymentRecord = await paymentModel.findOne({ 
      orderId, 
      userId, 
      status: 'failed' 
    });

    if (!paymentRecord) {
      return res.json({ 
        success: false, 
        message: "Failed payment record not found" 
      });
    }

    // Reset payment status to pending for retry
    await paymentModel.findByIdAndUpdate(paymentRecord._id, {
      status: 'pending',
      failureReason: null,
      updatedAt: new Date()
    });

    res.json({ 
      success: true, 
      message: "Payment retry initiated",
      orderId: paymentRecord.orderId,
      appointmentId: paymentRecord.appointmentId
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for admin to get all payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await paymentModel.find({}).sort({ createdAt: -1 });

    // Get user and appointment details for each payment
    const paymentList = await Promise.all(
      payments.map(async (payment) => {
        const user = await userModel.findById(payment.userId).select('name email');
        const appointment = await appointmentModel.findById(payment.appointmentId);
        
        return {
          ...payment.toObject(),
          userDetails: user,
          appointmentDetails: appointment ? {
            doctorName: appointment.docData?.name,
            slotDate: appointment.slotDate,
            slotTime: appointment.slotTime
          } : null
        };
      })
    );

    res.json({ 
      success: true, 
      payments: paymentList 
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  createMockPaymentOrder,
  processMockPayment,
  getPaymentHistory,
  getPaymentDetails,
  retryPayment,
  getAllPayments
};