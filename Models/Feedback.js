import mongoose from "mongoose";

const propertyFeedbackSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property", // Reference to Property model
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true, // Rating from 1 to 5
  },
  comment: {
    type: String,
    required: true, // Feedback comment
  },
  createdAt: {
    type: Date,
    default: Date.now, // Date when feedback was created
  },
});

const projectFeedbackSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project", // Reference to Project model
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true, // Rating from 1 to 5
  },
  comment: {
    type: String,
    required: true, // Feedback comment
  },
  createdAt: {
    type: Date,
    default: Date.now, // Date when feedback was created
  },
});

const websiteFeedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true, // Rating from 1 to 5
  },
  comment: {
    type: String,
    required: true, // Feedback comment
  },
  createdAt: {
    type: Date,
    default: Date.now, // Date when feedback was created
  },
});

const PropertyFeedback = mongoose.model("PropertyFeedback", propertyFeedbackSchema);
const ProjectFeedback = mongoose.model("ProjectFeedback", projectFeedbackSchema);
const WebsiteFeedback = mongoose.model("WebsiteFeedback", websiteFeedbackSchema);

export { PropertyFeedback, ProjectFeedback, WebsiteFeedback };

