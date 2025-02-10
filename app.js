import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { transporter } from "./Nodemailer/InitializeEmailService.js";
import bodyParser from "body-parser";

import UserRoutes from "./Routes/User.js";
import AdminRoutes from "./Routes/Admin.js";
// import ChangePass from "./Routes/changePass.js";
import Seller from "./Routes/Seller.js"
// import  Property  from "./Routes/PropertyRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js";



// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error:", err));



transporter.verify((error, success) => {
    if (error) {
      console.error('Error verifying email transporter:', error);
    } else {
      console.log('Email transporter verified and ready to send emails.');
    }
});

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(async(req,res,next)=>{
    try {
        await transporter.verify();
        console.log("Email transporter is ready");
        next();
      } catch (error) {
        console.error("Email transporter error:", error);
        return res.status(500).json({ message: "Email service is unavailable" });
      }
});

// Database connection


// Routes
app.use("/api/users", UserRoutes);
app.use("/api/admin", AdminRoutes);
// app.use("/api/update/password", ChangePass)
app.use('/api/sellers', Seller)
// app.use('/api/properties', Property)
// app.use("/api/properties", propertyRoutes);
// app.use("/api/payments", paymentRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("LandAcers Portal API is running...");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
