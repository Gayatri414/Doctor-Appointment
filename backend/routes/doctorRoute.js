import express from "express";
import { 
  doctorList, 
  loginDoctor, 
  doctorProfile, 
  updateDoctorProfile 
} from "../controllers/doctorController.js";
import { 
  appointmentsDoctor, 
  appointmentComplete, 
  appointmentCancel,
  doctorDashboard 
} from "../controllers/appointmentController.js";
import authDoctor from "../middlewares/authDoctor.js";

const doctorRouter = express.Router(); 

// Public routes
doctorRouter.get("/list", doctorList);
doctorRouter.post("/login", loginDoctor);

// Protected routes
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor);
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);
doctorRouter.get("/profile", authDoctor, doctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);

export default doctorRouter;