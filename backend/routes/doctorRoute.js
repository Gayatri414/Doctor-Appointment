// routes/doctorRoutes.js
import express from "express";
import { doctorList } from "../controllers/doctorController.js";

const doctorRouter = express.Router(); // ✅ use same name

doctorRouter.get("/list", doctorList); // ✅ correct

export default doctorRouter;