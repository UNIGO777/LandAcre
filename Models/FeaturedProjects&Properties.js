import mongoose from "mongoose";

const featuredItemSchema = new mongoose.Schema({
  itemType: {
    type: String,
    enum: ["Project", "Property"], // Type of featured item
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "itemType", // Dynamic reference based on itemType
    required: true,
  },
  featuredDate: {
    type: Date,
    default: Date.now, // Date when the item was featured
  },
  endDate:{
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true, // Indicates if the featured item is currently active
  },
});

const FeaturedItem = mongoose.model("FeaturedItem", featuredItemSchema);

export { FeaturedItem };
