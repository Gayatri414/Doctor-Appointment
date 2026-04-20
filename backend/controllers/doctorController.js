import doctorModel from "../models/doctorModel.js";
import mongoose from "mongoose";

const changeAvailability = async (req, res) => {
  try {
     console.log("CHANGE AVAILABILITY HIT ✅");
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);

    if (!docData) {
      return res.json({
        success: false,
        message: "Doctor not found",
      });
    }

    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });

    res.json({
      success: true,
      message: "Availability Updated", 
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
 
};
const doctorList = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }
    const doctors = await doctorModel
      .find({})
      .select("-password"); // exclude password only

    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { changeAvailability ,doctorList};