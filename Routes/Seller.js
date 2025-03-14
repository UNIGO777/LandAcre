import express from "express";
import { registerSeller, verifySellerRegistrationOTP, loginSeller, verifyLoginOTP, updateSellerAccount, sendChangePasswordOTP, changePassword, sendEmailVerificationOTP, confirmEmailVerificationOTP, switchSellerType, DeleteSeller, getSellersByType, getSellerDetails, getSellersByadmin, getSellerDetailsByToken, sellerAnalytics } from "../Controllers/Seller.js";
import { handleFileUpload, upload } from "../Config/multer.js";
import { authenticate, authenticateAdmin, authenticateBuilder, authenticateSeller } from "../middlewares/Authentication.js";


const router = express.Router();


router.post("/register",upload.single('profilePicture'), handleFileUpload, registerSeller);
router.post("/verify-registration", verifySellerRegistrationOTP);
router.post("/login", loginSeller);
router.get("/me", authenticateSeller ,getSellerDetailsByToken);
router.get("/myanalytics", authenticateSeller , sellerAnalytics);

router.post("/verify-login", verifyLoginOTP);
router.post("/update", authenticateSeller ,upload.single('profilePicture'), handleFileUpload, updateSellerAccount);
router.post("/send-change-password-otp", sendChangePasswordOTP);
router.post("/change-password", changePassword);
router.get("/send-email-verification-otp", authenticateSeller, sendEmailVerificationOTP);
router.post("/confirm-email-verification-otp", authenticateSeller, confirmEmailVerificationOTP);
router.post('/switchSellerType', authenticateSeller, switchSellerType)
router.post('/delete', authenticateSeller, DeleteSeller)

router.get("/", getSellersByType);







export default router;
