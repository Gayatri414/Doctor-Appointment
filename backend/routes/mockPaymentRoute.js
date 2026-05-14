import express from "express";
import {
  createMockPaymentOrder,
  processMockPayment,
  getPaymentHistory,
  getPaymentDetails,
  retryPayment,
  getAllPayments
} from "../controllers/mockPaymentController.js";
import authUser from "../middlewares/authUser.js";
import authAdmin from "../middlewares/authAdmin.js";

const mockPaymentRouter = express.Router();

// User payment routes (protected)
mockPaymentRouter.post("/create-order", authUser, createMockPaymentOrder);
mockPaymentRouter.post("/process-payment", authUser, processMockPayment);
mockPaymentRouter.get("/history", authUser, getPaymentHistory);
mockPaymentRouter.get("/details/:paymentId", authUser, getPaymentDetails);
mockPaymentRouter.post("/retry", authUser, retryPayment);

// Admin payment routes (protected)
mockPaymentRouter.get("/admin/all-payments", authAdmin, getAllPayments);

export default mockPaymentRouter;