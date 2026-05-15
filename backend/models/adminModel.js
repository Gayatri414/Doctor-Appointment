import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    image: { type: String, default: "" },
    role: { type: String, default: "admin" },
    createdAt: { type: Date, default: Date.now }
});

const adminModel = mongoose.models.admin || mongoose.model('admin', adminSchema);

export default adminModel;