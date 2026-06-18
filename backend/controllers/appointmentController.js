import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
import crypto from "crypto";

// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    console.log("=== APPOINTMENT BOOKING REQUEST ===");
    console.log("Request body:", req.body);
    console.log("req.userId from middleware:", req.userId);
    console.log("req.body.userId:", req.body.userId);
    console.log("Request headers:", req.headers);
    
    // Extract data from request - userId comes from auth middleware, not body
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.userId; // Get from auth middleware instead of body
    
    // DEBUGGING: Log exact values
    console.log("DEBUG VALUES:");
    console.log("- docId:", docId);
    console.log("- slotDate:", slotDate);
    console.log("- slotTime:", slotTime);
    console.log("- userId (from middleware):", userId);
    console.log("- userId type:", typeof userId);
    
    // Validate authenticated user ID
    if (!userId) {
      console.log("❌ No userId found from authentication");
      return res.json({ 
        success: false, 
        message: "Authentication required - please login again" 
      });
    }
    
    console.log("✓ Using authenticated userId:", userId);

    // Get doctor and user data with error handling
    let docData, userData;
    
    try {
      console.log("🔍 Fetching doctor data for ID:", docId);
      docData = await doctorModel.findById(docId).select("-password");
      if (!docData) {
        console.log("❌ Doctor not found for ID:", docId);
        return res.json({ success: false, message: "Doctor not found" });
      }
      console.log("✓ Found doctor:", docData.name);
      
      console.log("🔍 Fetching user data for ID:", userId);
      userData = await userModel.findById(userId).select("-password");
      if (!userData) {
        console.log("❌ User not found for ID:", userId);
        return res.json({ success: false, message: "User not found - please login again" });
      }
      console.log("✓ Found user:", userData.name);
      
    } catch (dbError) {
      console.log("❌ Database error:", dbError.message);
      console.log("❌ Database error stack:", dbError.stack);
      return res.json({ success: false, message: "Database error - please try again" });
    }

    if (!docData.available) {
      console.log("❌ Doctor not available:", docData.name);
      return res.json({ success: false, message: "Doctor Not Available" });
    }

    let slots_booked = docData.slots_booked;

    // Check slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        console.log("❌ Slot already booked:", { slotDate, slotTime });
        return res.json({ success: false, message: "Slot Not Available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    // Create appointment data with debugging
    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    console.log("=== APPOINTMENT DATA BEFORE SAVE ===");
    console.log("appointmentData.userId:", appointmentData.userId);
    console.log("appointmentData.userData:", appointmentData.userData ? "EXISTS" : "MISSING");
    console.log("appointmentData.docId:", appointmentData.docId);
    console.log("appointmentData.docData:", appointmentData.docData ? "EXISTS" : "MISSING");
    console.log("Full appointmentData:", JSON.stringify(appointmentData, null, 2));

    // Validate required fields before saving
    if (!appointmentData.userId) {
      console.log("❌ VALIDATION ERROR: userId is missing");
      return res.json({ success: false, message: "User ID is required" });
    }
    
    if (!appointmentData.userData) {
      console.log("❌ VALIDATION ERROR: userData is missing");
      return res.json({ success: false, message: "User data is required" });
    }

    // Save appointment
    console.log("📝 Creating new appointment model...");
    const newAppointment = new appointmentModel(appointmentData);
    
    console.log("💾 Saving appointment to database...");
    const savedAppointment = await newAppointment.save();
    console.log("✅ Appointment saved with ID:", savedAppointment._id);

    // Update doctor's slots
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    console.log("✅ Appointment booked successfully");
    res.json({ success: true, message: "Appointment Booked Successfully" });
    
  } catch (error) {
    console.log("❌ Appointment booking error:", error);
    console.log("❌ Error name:", error.name);
    console.log("❌ Error message:", error.message);
    console.log("❌ Error stack:", error.stack);
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      console.log("❌ Mongoose validation error:");
      console.log("❌ Validation errors:", error.errors);
      
      const validationErrors = Object.keys(error.errors).map(key => {
        return `${key}: ${error.errors[key].message}`;
      });
      
      return res.json({ 
        success: false, 
        message: `Validation failed: ${validationErrors.join(', ')}`
      });
    }
    
    res.json({ success: false, message: error.message });
  }
};

// API to get user appointments
const listAppointment = async (req, res) => {
  try {
    console.log("=== LIST APPOINTMENTS REQUEST ===");
    console.log("Authenticated userId from middleware:", req.userId);
    
    const userId = req.userId; // Get from auth middleware
    
    if (!userId) {
      return res.json({ success: false, message: "Authentication required" });
    }
    
    const appointments = await appointmentModel.find({ userId });
    console.log(`✓ Found ${appointments.length} appointments for user`);

    res.json({ success: true, appointments });
  } catch (error) {
    console.log("❌ List appointments error:", error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    console.log("=== CANCEL APPOINTMENT REQUEST ===");
    console.log("Request body:", req.body);
    console.log("Authenticated userId from middleware:", req.userId);
    
    const { appointmentId } = req.body;
    const userId = req.userId; // Get from auth middleware
    
    if (!userId) {
      return res.json({ success: false, message: "Authentication required" });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);
    
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Verify appointment user
    if (appointmentData.userId !== userId) {
      console.log("❌ Unauthorized cancellation attempt");
      return res.json({ success: false, message: "Unauthorized action" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { 
      cancelled: true,
      status: 'cancelled'
    });

    // Release the doctor slot
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    console.log("✅ Appointment cancelled successfully");
    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log("❌ Cancel appointment error:", error);
    res.json({ success: false, message: error.message });
  }
};

// API to make payment using Mock Payment Gateway
const paymentMockGateway = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: "Appointment Cancelled or not found" });
    }

    if (appointmentData.payment) {
      return res.json({ success: false, message: "Payment already completed" });
    }

    // Creating options for mock payment
    const options = {
      amount: appointmentData.amount * 100, // Convert to cents
      currency: process.env.CURRENCY || 'USD',
      receipt: appointmentId,
    };

    // Creation of a mock order
    const order = {
      id: 'order_' + Date.now() + Math.random().toString(36).substr(2, 9),
      ...options,
      status: 'created',
      created_at: Math.floor(Date.now() / 1000)
    };

    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to verify mock payment
const verifyMockPayment = async (req, res) => {
  try {
    const { mock_order_id, mock_payment_id, appointmentId } = req.body;

    // Simulate payment verification (always successful for demo)
    const isAuthentic = true; // Mock verification always passes

    if (isAuthentic) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { 
        payment: true,
        paymentId: mock_payment_id,
        razorpayOrderId: mock_order_id,
        status: 'confirmed'
      });

      res.json({ success: true, message: "Payment Successful" });
    } else {
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for admin to get all appointments
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for admin to cancel appointment
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    await appointmentModel.findByIdAndUpdate(appointmentId, { 
      cancelled: true,
      status: 'cancelled'
    });

    // Release the doctor slot
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for doctor to get appointments
const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for doctor to mark appointment completed
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { 
        isCompleted: true,
        status: 'completed'
      });
      return res.json({ success: true, message: "Appointment Completed" });
    } else {
      return res.json({ success: false, message: "Mark Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for admin
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for doctor
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;

    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    let patients = [];

    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentMockGateway,
  verifyMockPayment,
  appointmentsAdmin,
  appointmentCancel,
  appointmentsDoctor,
  appointmentComplete,
  adminDashboard,
  doctorDashboard,
};