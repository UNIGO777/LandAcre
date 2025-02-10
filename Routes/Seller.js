import express from "express";
import { registerSeller, verifySellerRegistrationOTP, loginSeller, verifyLoginOTP, updateSellerAccount, sendChangePasswordOTP, changePassword, sendEmailVerificationOTP, confirmEmailVerificationOTP } from "../Controllers/Seller.js";
import { handleFileUpload, upload } from "../Config/multer.js";
import { authenticate, authenticateSeller } from "../middlewares/Authentication.js";

const router = express.Router();


router.post("/register",upload.single('profilePicture'), handleFileUpload, registerSeller);
router.post("/verify-registration", verifySellerRegistrationOTP);
router.post("/login", loginSeller);
router.post("/verify-login", verifyLoginOTP);
router.post("/update", authenticateSeller ,upload.single('profilePicture'), handleFileUpload, updateSellerAccount);
router.post("/send-change-password-otp", sendChangePasswordOTP);
router.post("/change-password", changePassword);
router.get("/send-email-verification-otp", authenticateSeller, sendEmailVerificationOTP);
router.post("/confirm-email-verification-otp", authenticateSeller, confirmEmailVerificationOTP);




export default router;
