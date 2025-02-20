import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true // Mandatory field for project name
  },
  location: {
    state:{
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    locality: {
      type: String,
      required: true
    },
  },
  totalUnits: {
    type: Number,
    required: true // Total number of units in the project
  },
  availableUnits: {
    type: Number,
    required: true // Number of available units
  },
  amenities: {
    type: [String], // Array for amenities available in the project
  },
  launchDate: {
    type: Date,
    required: true // Mandatory field for project launch date
  },
  completionDate: {
    type: Date,
    required: true // Mandatory field for project completion date
  },
  projectType: {
    type: String,
    enum: ['Residential', 'Commercial', 'Mixed-use'], // Types of projects
    required: true // Mandatory field for project type
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller", // Reference to the BrokerBuilder model
    required: true // Mandatory field for seller ID
  },
  description: {
    type: String, // Description of the project
  },
  status: {
    type: String,
    enum: ["requested", "active", "closed", "blocked" ],
    default: "requested",
  },
  images: {
    type: [String], // Array for image URLs related to the project
  },
  isUpcomming:{
    type:Boolean,
    default: false,
    require: true
  },
  video: {
    type: String, // URL for a video related to the project
  }
});

const Project = mongoose.model('Project', projectSchema);

export default  Project;
