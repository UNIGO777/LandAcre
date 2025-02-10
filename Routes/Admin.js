import express from 'express';
import { adminLogin, verifyAdminOtp } from '../controllers/User.js'; // Import the user controller


const router = express.Router();


// Register a new user with OTP verification
router.post('/login',  adminLogin);
router.post('/verify',  verifyAdminOtp);

// Verify OTP for registration



export default router; // Corrected to export the router instance properly