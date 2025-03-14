import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken"; // Sorted jwt import


const jwt = jsonwebtoken

dotenv.config();

const secret_key = process.env.JWT_SECRET || "your_default_secret_key";
const access_token_expiry = "1h"; // Token expiry set to 1 hour

const userSchema = new mongoose.Schema(
  {
    firstName: { 
      type: String, 
      required: [true, "First name is required"], 
    },
    lastName: { 
      type: String, 
      required: [true, "Last name is required"], 
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits long"],
    },
    profilePicture: {
      type: String,
    },
    role: { 
      type: String, 
      default: "user", 
      enum: ["user", "admin"] 
    },
    queries: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Query" }
    ],
    emailVerified: { 
      type: Boolean, 
      default: false 
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active"
    },
    createdAt: { type: Date, default: Date.now },
  },
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;

  if (!secret_key) {
    throw new Error("Secret key is not defined in environment variables.");
  }

  let expiryDuration;
  switch (user.role) {
    case "user":
      expiryDuration = '7d'; // 7 days
      break;
    case "admin":
      expiryDuration = '7d'; // 1 hour
      break;
    default:
      expiryDuration = '7d'; // Default to 7 days if role is not recognized
  }

  const token = jsonwebtoken.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: expiryDuration }
  );

  return token;
};

const User = mongoose.model("User", userSchema);

export default User;
