import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  sellerType: {
    type: String,
    enum: ["individual", "agent", "builder"], // Type of seller
    required: true,
  },
  plan: {
    type: String,
    enum: ["payPerProperty", "monthly", "yearly"], // Plan types
    required: true,
  },
  credits: {
    type: Number,
    required: true, // Number of credits for posting properties
    default: 0,
  },
  price: {
    type: Number,
    required: true, // Price for the plan (can be monthly/yearly for agents/builders or per post)
  },
  features: {
    type: [String], // Array of features
    default: [], // Default to an empty array if no features are added
    required: true, // Features field is required
  }
}, { timestamps: true });

export default mongoose.model("Subscription", subscriptionSchema);
