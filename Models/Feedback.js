import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  feedbackType: {
    type: String,
    enum: ['property', 'project', 'website'],
    required: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: function() { return this.feedbackType === 'property'; }
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: function() { return this.feedbackType === 'project'; }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

export { Feedback };
