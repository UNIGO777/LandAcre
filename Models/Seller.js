import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";

const SellerSchema = new mongoose.Schema(
  {
    sellerType: {
      type: String,
      enum: ["Individual", "Agent", "Builder"], // Three types of sellers
      required: true,
    },
    sellerDetails: {
      profilePicture: {type:String,required: true},
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      phone: { type: String, required: true, unique: true },
      companyName: { type: String }, // Only applicable for agents and builders
      address: { type: String }, // Optional
    },
    sellingProperties: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    ],
    queries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Query" }],
    subscription: {
      type: String,
      enum: ["monthly", "yearly", "Individual"],
      default: null, // Set to null when user requests to build an account
    },
    subscriptionExpiry: {
      type: Date,
      default: null,
    },
    projects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    }],
    emailVerified: {
      type: Boolean,
      default: false // Default value set to false for email verification status
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
    password: {
        type: String,
        required: true,
      }  
  },
  { timestamps: true }
);

SellerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Only hash if password is modified
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
SellerSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


SellerSchema.methods.generateAuthToken = async function () {
    const user = this;
  
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }
  
    let expiryDuration = '1d';
    
  
    const token = jsonwebtoken.sign(
      { _id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: expiryDuration }
    );
  
    return token;
  };
  
const Seller = mongoose.model("Seller", SellerSchema);
  
export default Seller;
