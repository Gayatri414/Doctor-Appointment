import express from "express";
import {
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentMockGateway,
  verifyMockPayment,
} from "../controllers/appointmentController.js";
import authUser from "../middlewares/authUser.js";

const appointmentRouter = express.Router();

// User appointment routes
appointmentRouter.post("/book", authUser, bookAppointment);
appointmentRouter.get("/list", authUser, listAppointment);
appointmentRouter.post("/cancel", authUser, cancelAppointment);
appointmentRouter.post("/payment-mock", authUser, paymentMockGateway);
appointmentRouter.post("/verify-mock", authUser, verifyMockPayment);

export default appointmentRouter;