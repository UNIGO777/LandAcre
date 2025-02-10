import mongoose from "mongoose";

const featuredProjectSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project", // Reference to Project model
    required: true,
  },
  featuredDate: {
    type: Date,
    default: Date.now, // Date when the project was featured
  },
  isActive: {
    type: Boolean,
    default: true, // Indicates if the featured project is currently active
  },
});

const featuredPropertySchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property", // Reference to Property model
    required: true,
  },
  featuredDate: {
    type: Date,
    default: Date.now, // Date when the property was featured
  },
  isActive: {
    type: Boolean,
    default: true, // Indicates if the featured property is currently active
  },
});

const FeaturedProject = mongoose.model("FeaturedProject", featuredProjectSchema);
const FeaturedProperty = mongoose.model("FeaturedProperty", featuredPropertySchema);

export { FeaturedProject, FeaturedProperty };
