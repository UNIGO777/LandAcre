import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { transporter } from "./Nodemailer/InitializeEmailService.js";
import bodyParser from "body-parser";
import path from 'path';
import UserRoutes from "./Routes/User.js";
import AdminRoutes from "./Routes/Admin.js";
import Seller from "./Routes/Seller.js"
import Property from "./Routes/PropertyRoutes.js";
import Quary from "./Routes/Quary.js";
import Project from "./Routes/Project.js";
import Feedback from "./Routes/FeedBack.js";
import Notification from "./Routes/Notifications.js";
import featured from "./Routes/FeaturedItems.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Increase timeout settings (default is 2 minutes, increase if needed)
const http = await import('http');
const server = http.createServer(app);
server.timeout = 300000; // 5 minutes (300,000 ms)

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

app.use('/storage', express.static(path.join(process.cwd(), 'storage')));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use(async (req, res, next) => {
  try {
    await transporter.verify();
    console.log("Email transporter is ready");
    next();
  } catch (error) {
    console.error("Email transporter error:", error);
    next();
  }
});

// Routes
app.use("/api/users", UserRoutes);
app.use("/api/admin", AdminRoutes);
app.use('/api/sellers', Seller);
app.use('/api/properties', Property);
app.use('/api/quary', Quary);
app.use('/api/projects', Project);
app.use('/api/feedback', Feedback);
app.use('/api/notifications', Notification);
app.use('/api/feature-items', featured);

// Root route
app.get("/", (req, res) => {
  res.send("LandAcre Portal API is running...");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server with the defined timeout
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
