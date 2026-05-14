import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  appointmentId: { type: String, required: true },
  orderId: { type: String, required: true, unique: true },
  paymentId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { 
    type: String, 
    enum: ['pending', 'success', 'failed', 'refunded'], 
    default: 'pending' 
  },
  paymentMethod: { type: String, default: 'mock_payment' },
  transactionDate: { type: Date, default: Date.now },
  failureReason: { type: String, default: null },
  metadata: {
    userAgent: { type: String },
    ipAddress: { type: String },
    deviceInfo: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { minimize: false });

// Update the updatedAt field before saving
paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const paymentModel = mongoose.models.payment || mongoose.model("payment", paymentSchema);

export default paymentModel;