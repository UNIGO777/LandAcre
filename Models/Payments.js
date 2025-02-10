import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller", // Reference to User model
    required: true,
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription", // Reference to Subscription model
  },
  amount: {
    type: Number,
    required: true, // Amount paid for the subscription
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "paypal", "razorpay", "stripe"], // Payment method
    required: true,
  },
  razorpayOrderId: {
    type: String,
    required: true, // Razorpay Order ID
  },
  razorpayPaymentId: {
    type: String,
    required: true, // Razorpay Payment ID
  },
  paymentDate: {
    type: Date,
    default: Date.now, // Date of payment
  },
  paymentStatus: {
    type: String,
    enum: ["completed", "failed", "pending"], // Status of the payment
    default: "completed", // Default payment status
  },
  transactionId: {
    type: String,
    required: true, // Unique transaction identifier
  },
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
