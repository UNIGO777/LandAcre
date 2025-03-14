import mongoose from "mongoose";

const querySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  item: {
    ItemId: {
      type: String,
      required: true,
    },
    Itemtype: {
      type: String,
      enum: ["Property", "Project"],
      required: true,
    }
  },
  sellerId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    require: true
  },
  status: {
    type: String,
    enum: ["seen", "unseen"],
    default: "unseen",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Quary = mongoose.model("Query", querySchema)

export default Quary;
