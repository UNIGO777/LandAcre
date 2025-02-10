import Seller from "../Models/Seller.js";

import jsonwebtoken from "jsonwebtoken";
import axios from "axios";
import sendEmail from "../Nodemailer/Controller/Controller.js";
import AccountRegister from "../Nodemailer/Tamplates/BrokerBuilder/AccountRegister.js";
import WelcomeBack from "../Nodemailer/Tamplates/BrokerBuilder/WelcomeBackBrokerBuilder.js";
import AccoutUpdated from "../Nodemailer/Tamplates/BrokerBuilder/AccoutUpdated.js";
import PasswordChanged from "../Nodemailer/Tamplates/BrokerBuilder/PasswordChanged.js";
import EmailVerificationOtp from "../Nodemailer/Tamplates/EmailVerificationOtp.js";


const OTP_EXPIRY = 10 * 60 * 1000; // 10 minutes
const OTP_MAP = new Map(); // Temporary storage for OTP verification
const EMAIL_VERIFICATION_MAP = new Map();

const sendOTP = async (phone, otp) => {
    const otpAPIUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=lXTjyGuBrqdJ3keOPfzhxmMcoNUD0QZ1SanK48FYCAvLtV7EiI3apiPWobtmYB4UgrTuxhH8J0IklZKG&route=otp&variables_values=${otp}&flash=0&numbers=${phone}`;
    await axios.get(otpAPIUrl);
};

const validatePassword = (password) => {
    const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};

const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const validatePhone = (phone) => {
    const regex = /^\d{10}$/;
    return regex.test(phone);
};

// **REGISTER SELLER**
export const registerSeller = async (req, res) => {
    const { sellerType, name, email, phone, password, companyName, address } = req.body;
    const profilePicture = req.file ? req.file.path : null; // Get the profile picture path from req.file
    
    try {
        // Validate input
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const validationErrors = [];
        if (!name?.trim() || name.length > 50)
            validationErrors.push("Invalid name");
        if (!validateEmail(email)) validationErrors.push("Invalid email format");
        if (!validatePhone(phone))
            validationErrors.push("Invalid phone number");
        if (!validatePassword(password)) {
            validationErrors.push(
                "Password must be at least 8 characters long and contain uppercase, lowercase, number and special character"
            );
        }
        if (validationErrors.length > 0) {
            return res
                .status(400)
                .json({ message: "Validation failed", errors: validationErrors });
        }

        const existingSeller = await Seller.findOne({ $or: [{ email }, { phone }] });
        if (existingSeller) {
            return res.status(400).json({ message: "Seller with this email or phone already exists." });
        }

        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        try {
            await sendOTP(phone, otp);
        } catch (error) {
            return res.status(500).json({ message: "Failed to send OTP. Please try again after some time.", error: error.message });
        }

        // Store temporary user data with OTP
        OTP_MAP.set(phone, {
            sellerType, name, email, phone, password, companyName, address, profilePicture, otp, otpExpiresAt: Date.now() + OTP_EXPIRY
        });

        res.status(200).json({ message: "OTP sent to your phone. Please verify to complete registration.", phone });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error. Please try again.", error: error.message });
    }
};

// **VERIFY REGISTRATION OTP**
export const verifySellerRegistrationOTP = async (req, res) => {
    const { phone, otp } = req.body;
    const tempData = OTP_MAP.get(phone);

    if (!tempData) return res.status(400).json({ message: "Registration session not found. Please register again." });

    if (Date.now() > tempData.otpExpiresAt) {
        OTP_MAP.delete(phone);
        return res.status(400).json({ message: "OTP expired. Please register again." });
    }

    if (otp !== tempData.otp) {
        return res.status(400).json({ message: "Invalid OTP." });
    }

    // Save seller to database
    const seller = new Seller({
        sellerType: tempData.sellerType,
        sellerDetails: { 
            name: tempData.name, 
            email: tempData.email, 
            phone: tempData.phone, 
            companyName: tempData.companyName, 
            address: tempData.address,
            profilePicture: tempData.profilePicture // Include profile picture
        },
        password: tempData.password,
    });
    await seller.save();

    await sendEmail(tempData.email, "Welcome to LandAcers", ()=>AccountRegister(tempData.name));

    OTP_MAP.delete(phone);
    res.status(201).json({ message: "Registration successful! You can now log in." });
};

// **LOGIN SELLER (REQUEST OTP)**
export const loginSeller = async (req, res) => {
    const { email, password} = req.body;

    try {
        const seller = await Seller.findOne({ "sellerDetails.email": email });
        if (!seller) return res.status(404).json({ message: "Seller not found." });

        const isMatch = await seller.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password." });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const phoneNumber = seller.sellerDetails.phone;
        try {
            await sendOTP(seller.sellerDetails.phone, otp);
        } catch (error) {
            return res.status(500).json({ message: "Failed to send OTP. Please try again.", error: error.message });
        }

        OTP_MAP.set(seller.sellerDetails.phone, { otp, otpExpiresAt: Date.now() + OTP_EXPIRY, sellerId: seller._id });

        res.status(200).json({ message: "OTP sent. Please verify to log in.",  phoneNumber});
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error. Please try again.", error: error.message });
    }
};

// **VERIFY LOGIN OTP**
export const verifyLoginOTP = async (req, res) => {
    const { phone, otp } = req.body;
    const tempData = OTP_MAP.get(phone);

    if (!tempData) return res.status(400).json({ message: "Login session not found. Please request OTP again." });

    if (Date.now() > tempData.otpExpiresAt) {
        OTP_MAP.delete(phone);
        return res.status(400).json({ message: "OTP expired. Please request again." });
    }

    if (otp !== tempData.otp) {
        return res.status(400).json({ message: "Invalid OTP." });
    }

    const seller = await Seller.findById(tempData.sellerId);
    const token = jsonwebtoken.sign({ _id: seller._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    OTP_MAP.delete(phone);
    await sendEmail(tempData.email, "Welcome to LandAcers", ()=>WelcomeBack(tempData.name, seller.sellerType));
    res.status(200).json({ message: "Login successful!", token, seller: { sellerDetails, _id, sellerType, sellingProperties, queries, subscription, subscriptionExpiry, status, createdAt, updatedAt } });
};


// **UPDATE SELLER ACCOUNT**
export const updateSellerAccount = async (req, res) => {
    const sellerId = req.user._id; // Corrected to use params to get sellerId
    const { name, companyName, address } = req.body; // Removed email and phone from destructuring
    const profilePicture = req.file ? req.file.path : null; // Get the profile picture path from req.file

    try {
        // Validate input
        if (!sellerId) {
            return res.status(400).json({ message: "Seller ID is required." });
        }

        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ message: "Seller not found." });
        }

        // Update seller details
        seller.sellerDetails.name = name || seller.sellerDetails.name;
        seller.sellerDetails.companyName = companyName || seller.sellerDetails.companyName;
        seller.sellerDetails.address = address || seller.sellerDetails.address;
        if (profilePicture) {
            seller.sellerDetails.profilePicture = profilePicture;
        }

        await seller.save();
        await sendEmail(seller.sellerDetails.email, "Seller account updated", () => AccoutUpdated(seller.sellerDetails.name, seller.sellerType)); // Updated to use seller's email

        const { sellerDetails, _id, sellerType, sellingProperties, queries, subscription, subscriptionExpiry, status, createdAt, updatedAt } = seller;
        res.status(200).json({ message: "Seller account updated successfully!", seller: { sellerDetails, _id, sellerType, sellingProperties, queries, subscription, subscriptionExpiry, status, createdAt, updatedAt } });
    } catch (error) {
        console.error("Update seller account error:", error);
        res.status(500).json({ message: "Server error while updating seller account.", error: error.message });
    }
};

// Function to send OTP to seller's phone
export const sendChangePasswordOTP = async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ message: "Phone number is required." });
    }

    const seller = await Seller.findOne({ 'sellerDetails.phone': phone });
    if (!seller) {
        return res.status(404).json({ message: "Seller not found." });
    }
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    OTP_MAP.set(phone, { otp }); // Store OTP in the map with phone number as key

    // Send OTP to the seller's phone
    await sendOTP(phone, otp); // Assuming sendOTP is a function that sends the OTP via SMS

    res.status(200).json({ message: "OTP sent successfully!" });
};

// Function to change password after verifying OTP
export const changePassword = async (req, res) => {
    const { phone, otp, newPassword } = req.body;
    if (!phone || !otp || !newPassword) {
        return res.status(400).json({ message: "Phone number, OTP, and new password are required." });
    }

    const validationErrors = [];
    if (!validatePassword(newPassword)) {
        validationErrors.push(
            "Password must be at least 8 characters long and contain uppercase, lowercase, number and special character"
        );
    }
    if (validationErrors.length > 0) {
        return res
            .status(400)
            .json({ message: "Validation failed", errors: validationErrors });
    }

    // Validate input
   

    // Check if the OTP is valid
    const tempData = OTP_MAP.get(phone);
    if (!tempData || otp !== tempData.otp) {
        return res.status(400).json({ message: "Invalid OTP." });
    }

    // Find the seller by phone number
    const seller = await Seller.findOne({ 'sellerDetails.phone': phone });
    if (!seller) {
        return res.status(404).json({ message: "Seller not found." });
    }

    // Update the password
    seller.password = newPassword; // Set the new password
    await seller.save(); // Save the updated seller

    await sendEmail(seller.sellerDetails.email, "Seller Password changed", () => PasswordChanged(seller.sellerDetails.name)); // Updated to use seller's email

    // Clear the OTP from the map
    OTP_MAP.delete(phone);

    res.status(200).json({ message: "Password changed successfully!" });
};


// Function to send OTP to email for verification
export const sendEmailVerificationOTP = async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    // Find the seller by user ID
    const seller = await Seller.findOne({ _id: userId });
    if (!seller) {
        return res.status(404).json({ message: "Seller not found." });
    }

    const email = seller.sellerDetails.email;

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in a map with expiration time
    EMAIL_VERIFICATION_MAP.set(email, { otp, expiresAt: Date.now() + 300000 }); // OTP valid for 5 minutes

    // Send OTP to the seller's email
    await sendEmail(email, "Email Verification OTP", () => EmailVerificationOtp(seller.sellerDetails.name, otp));

    res.status(200).json({ message: "OTP sent to email successfully!" });
};

// Function to confirm email OTP for email verification
export const confirmEmailVerificationOTP = async (req, res) => {
    const { otp } = req.body;
    const userId = req.user._id;

    if (!userId || !otp) {
        return res.status(400).json({ message: "User ID and OTP are required." });
    }

    // Find the seller by user ID
    const seller = await Seller.findOne({ _id: userId });
    if (!seller) {
        return res.status(404).json({ message: "Seller not found." });
    }

    const email = seller.sellerDetails.email;

    // Check if the OTP is valid
    const tempData = EMAIL_VERIFICATION_MAP.get(email);
    if (!tempData || otp !== tempData.otp || Date.now() > tempData.expiresAt) {
        return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Mark the email as verified
    seller.emailVerified = true;
    await seller.save(); // Save the updated seller

    // Clear the OTP from the map
    EMAIL_VERIFICATION_MAP.delete(email);

    res.status(200).json({ message: "Email verified successfully!" });
};









