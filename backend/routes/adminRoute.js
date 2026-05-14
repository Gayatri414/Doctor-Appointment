import express from "express";
import { addDoctor, loginAdmin, allDoctors } from "../controllers/adminController.js";
import { changeAvailability } from "../controllers/doctorController.js";
import { 
  appointmentsAdmin, 
  appointmentCancel, 
  adminDashboard 
} from "../controllers/appointmentController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router();

// Admin login
adminRouter.post("/login", loginAdmin);

// Add doctor
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);

// Get all doctors
adminRouter.get("/all-doctors", authAdmin, allDoctors);

// Change availability
adminRouter.patch("/change-availability", authAdmin, changeAvailability);

// Appointment management
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);

// Dashboard
adminRouter.get("/dashboard", authAdmin, adminDashboard);

export default adminRouter;