import express from 'express';
import { register, verifyRegistrationOtp, login, updateProfile, changePassword, passChangeOtpVerify, initiateEmailVerification, verifyEmail} from '../Controllers/User.js'; // Import the user controller
import {handleFileUpload, upload} from '../Config/multer.js'; // Import the file upload middleware
import { authenticateUser } from "../middlewares/Authentication.js"

const router = express.Router();

// Allow multiple files to be uploaded


// Register a new user with OTP verification
router.post('/register', upload.single('profilePicture'), handleFileUpload, register);

// Verify OTP for registration
router.post('/register/verify-otp', verifyRegistrationOtp);

router.post('/login', login);

router.post('/changePassword', changePassword);

router.post('/changePassword/verify', passChangeOtpVerify);

router.post('/update', authenticateUser ,upload.array('profilePicture'), handleFileUpload, updateProfile);

// Initiate email verification
router.get('/initiateEmailVerification', authenticateUser, initiateEmailVerification);

// Verify email with OTP
router.post('/verifyEmail', authenticateUser, verifyEmail);






export default router; // Corrected to export the router instance properly