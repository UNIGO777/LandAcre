import mongoose from "mongoose";

const querySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  // This can refer to either Property or Project
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // Dynamically reference either Property or Project
    refPath: "itemType", // This will tell Mongoose whether it's a Property or Project
  },
  // Type of the item, it can either be "Property" or "Project"
  itemType: {
    type: String,
    enum: ["Property", "Project"], // To differentiate between Property and Project queries
    required: true,
  },
  status: {
    type: String,
    enum: ["seen", "unseen"],
    default: "unseen", // Default is unseen
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Query", querySchema);
