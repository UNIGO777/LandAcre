import User from "../Models/User.js"; // Ensure this import is correct
import axios from "axios";
import bcrypt from "bcryptjs";
import sendEmail from "../Nodemailer/Controller/Controller.js";
import Welcome from "../Nodemailer/Tamplates/User/Welcome.js";
import WelcomeBack from "../Nodemailer/Tamplates/User/WelcomeBack.js";
import Update from "../Nodemailer/Tamplates/User/Update.js";
import ChangePassword from "../Nodemailer/Tamplates/ChangePassword.js";
import EmailVerificationOtp from "../Nodemailer/Tamplates/EmailVerificationOtp.js";
import createNotification from "../Hof/makeNotifiction.js";



const RegisterTempUserMap = new Map();
const AdminLoginTempUserMap = new Map();
const PasswordChangeTempUserMap = new Map();

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

const register = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    console.log(firstName)

    try {
        const validationErrors = [];

        if (!firstName?.trim() || firstName.length > 50)
            validationErrors.push("Invalid first name");
        if (!lastName?.trim() || lastName.length > 50)
            validationErrors.push("Invalid last name");
        if (!validateEmail(email)) validationErrors.push("Invalid email format");
        if (!validatePhone(phoneNumber))
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

        const existingUser = await User.findOne({
            $or: [{ email }, { phoneNumber }],
        });

        if (existingUser) {
            return res.status(400).json({
                message: "A user with this email or phone number already exists.",
            });
        }

        let profilePictureUrl = req.uploadedFiles?.[0]?.path || null; // Use optional chaining for safer access

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Format phone number - add 91 prefix if it's a 10-digit number
        const formattedPhone = phoneNumber.length === 10 ? `91${phoneNumber}` : phoneNumber;

        // WhatsApp API endpoint
        const otpAPIUrl = `https://allexpert.in/api/send`;
        const payload = {
            number: formattedPhone,
            type: "text",
            message: `Welcome to LandAcers! Your registration OTP is: ${otp}. Please enter this code to verify your account. This OTP will expire in 10 minutes.`,
            instance_id: process.env.WHATSAPP_INTANCE_ID,
            access_token: process.env.WHATSAPP_ACCESS_TOKEN
        };

        try {
            await axios.post(otpAPIUrl, payload);
        } catch (error) {
            res.status(500).json({
                message: "Failed to send OTP. Please verify the phone number exists on WhatsApp and try again.",
                error: error.message,
            });
        }

        const hashedOtp = await bcrypt.hash(otp, 10);
        const hashedPassword = password;

        const tempUser = {
            firstName,
            lastName,
            email,
            phoneNumber,
            password: hashedPassword,
            profilePicture: profilePictureUrl,
            otp: hashedOtp,
            otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
            isVerified: false,
        };

        // If the phone number already exists in the map, delete it first
        if (RegisterTempUserMap.has(phoneNumber)) {
            RegisterTempUserMap.delete(phoneNumber);
        }
        RegisterTempUserMap.set(phoneNumber, tempUser);

        res.status(200).json({
            message:
                "OTP sent to your Whatsapp. Please verify to complete registration.",
            phoneNumber: phoneNumber,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: `Registration failed. Please try again later.`,
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};

const verifyRegistrationOtp = async (req, res) => {
    const { phoneNumber, otp } = req.body;

    try {
        const tempUser = RegisterTempUserMap.get(phoneNumber);

        if (!tempUser) {
            return res.status(400).json({
                message: "Registration session not found. Please register again.",
                error: "NO_SESSION",
            });
        }

        if (new Date() > new Date(tempUser.otpExpiresAt)) {
            RegisterTempUserMap.delete(phoneNumber);
            return res.status(400).json({
                message: "OTP has expired. Please register again.",
                error: "OTP_EXPIRED",
            });
        }

        const isOtpValid = await bcrypt.compare(otp, tempUser.otp);
        if (!isOtpValid) {
            return res.status(400).json({
                message: "Invalid OTP code.",
                error: "INVALID_OTP",
            });
        }

        const userData = {
            firstName: tempUser.firstName,
            lastName: tempUser.lastName,
            email: tempUser.email,
            phoneNumber: tempUser.phoneNumber,
            password: tempUser.password,
            profilePicture: tempUser.profilePicture,
            isVerified: true,
            registeredAt: new Date(),
        };

        const user = new User(userData);
        await user.save();

        RegisterTempUserMap.delete(phoneNumber);

        await sendEmail(tempUser.email, "Welcome to LandAcers", Welcome, { firstName: tempUser.firstName });

        res.status(201).json({
            message: "Registration successful! You can now login.",
        });
    } catch (error) {
        console.error("OTP verification error:", error);
        res.status(500).json({
            message: "Server error during verification.",
            error: error.message,
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            email,
            role: { $in: ["user"] }
        });
        if (!user) {
            return res
                .status(404)
                .json({ message: "No account found with these credentials." });
        }

        // Check if the password is hashed and compare it correctly
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password." });
        }

        const token = await user.generateAuthToken();

        // Send login notification email
        await sendEmail(email, "Welcome Back", () => WelcomeBack({ userName: user.firstName }));

        const userData = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profilePicture: user.profilePicture,
            phoneNumber: user.phoneNumber,
            emailVerified: user.emailVerified
        };

        // Create login notification
        await createNotification({
            userType: 'User',
            userId: user._id,
            message: `New login detected for ${user.firstName} at ${new Date().toLocaleString()}`
        });

        res.status(200).json({
            message: "Login successful!",
            token,
            user: userData,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Server error. Please try again.",
            error: error.message,
        });
    }
};

const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password, "kdsjhakf")

    try {
        const adminUser = await User.findOne({
            email,
            role: { $in: ["admin"] }
        });
        if (!adminUser) {
            return res
                .status(404)
                .json({ message: "No admin account found with these credentials." });
        }

        // Check if the password is hashed and compare it correctly
        const isPasswordValid = await bcrypt.compare(password, adminUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password." });
        }
        const phoneNumber = adminUser.phoneNumber

        const otp = generateOtp();

        // If the phone number already exists in the map, delete it first
        if (AdminLoginTempUserMap.has(phoneNumber)) {
            AdminLoginTempUserMap.delete(phoneNumber);
        }
        // Store the phone number and token in the AdminLoginTempUserMap
        AdminLoginTempUserMap.set(phoneNumber, { otp: otp });

        // Send OTP to the admin's phone number
        // const otpAPIUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=lXTjyGuBrqdJ3keOPfzhxmMcoNUD0QZ1SanK48FYCAvLtV7EiI3apiPWobtmYB4UgrTuxhH8J0IklZKG&route=otp&variables_values=${otp}&flash=0&numbers=${adminUser.phoneNumber}`;
        try {
            const otpAPIUrl = `https://allexpert.in/api/send`;
            // Format phone number - add 91 prefix if it's a 10-digit number
            const formattedPhone = phoneNumber.length === 10 ? `91${phoneNumber}` : phoneNumber;
            const payload = {
                number: formattedPhone,
                type: "text",
                message: `Welcome to LandAcers! Your Admin login OTP is: ${otp}. Please enter this code to verify your account. This OTP will expire in 10 minutes.`,
                instance_id: process.env.WHATSAPP_INTANCE_ID,
                access_token: process.env.WHATSAPP_ACCESS_TOKEN
            };
            await axios.post(otpAPIUrl, payload);
        } catch (error) {
            console.error("Error sending OTP via WhatsApp:", error);
            throw new Error("Failed to send OTP via WhatsApp");
        }
        // await axios.get(otpAPIUrl);



        res.status(200).json({
            message: "Login successful! OTP sent to your Whatsapp number.",
        });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({
            message: "Server error. Please try again.",
            error: error.message,
        });
    }
};

// Function to generate a random OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

const verifyAdminOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Find the admin user by email
        const adminUser = await User.findOne({ email, role: { $in: ["admin"] } });
        if (!adminUser) {
            return res.status(404).json({ message: "No admin account found with this email." });
        }

        // Check if the phone number exists in the AdminLoginTempUserMap
        if (!AdminLoginTempUserMap.has(adminUser.phoneNumber)) {
            return res.status(400).json({ message: "No login request found for this phone number." });
        }

        const adminData = AdminLoginTempUserMap.get(adminUser.phoneNumber);

        // Verify the OTP
        if (adminData.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP." });
        }

        const token = await adminUser.generateAuthToken();

        // Send login notification email
        await sendEmail(adminUser.email, "Welcome Back Admin", () => WelcomeBack({ userName: adminUser.firstName }));

        const adminDataResponse = {
            _id: adminUser._id,
            firstName: adminUser.firstName,
            lastName: adminUser.lastName,
            email: adminUser.email,
            profilePicture: adminUser.profilePicture,
            phoneNumber: adminUser.phoneNumber,
        };

        await createNotification({
            userType: 'User',
            userId: adminUser._id,
            message: `New login detected for ${adminUser.firstName} at ${new Date().toLocaleString()}`
        });

        // Remove the admin's entry from the temporary map
        AdminLoginTempUserMap.delete(adminUser.phoneNumber);

        res.status(200).json({
            message: "Admin login successful!",
            token,
        });
    } catch (error) {
        console.error("Admin OTP verification error:", error);
        res.status(500).json({
            message: "Server error. Please try again.",
            error: error.message,
        });
    }
};

const changePassword = async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        // Find the user by phone number and role
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({ message: `No account found with this phone number.` });
        }

        // Generate and send OTP
        const otp = generateOtp(); // Assuming generateOtp method is available

        // Format phone number - add 91 prefix if it's a 10-digit number
        try {
            const formattedPhone = phoneNumber.length === 10 ? `91${phoneNumber}` : phoneNumber;

            // WhatsApp API endpoint
            const otpAPIUrl = `https://allexpert.in/api/send`;
            const payload = {
                number: formattedPhone,
                type: "text",
                message: `Welcome to LandAcers! Your change password OTP is: ${otp}. Please enter this code to verify your account. This OTP will expire in 10 minutes.`,
                instance_id: process.env.WHATSAPP_INTANCE_ID,
                access_token: process.env.WHATSAPP_ACCESS_TOKEN
            };

            // Uncomment to enable OTP sending
            await axios.post(otpAPIUrl, payload);
        } catch (error) {
            res.status(500).json({
                message: "Failed to send OTP. Please verify the phone number exists on WhatsApp and try again.",
                error: error.message,
            });
        }

        // If the phone number already exists in the map, delete it first
        if (PasswordChangeTempUserMap.has(phoneNumber)) {
            PasswordChangeTempUserMap.delete(phoneNumber);
        }
        PasswordChangeTempUserMap.set(phoneNumber, otp);

        // Create password change OTP notification


        res.status(200).json({ message: "OTP sent to user's phone number." });
    } catch (error) {
       
        res.status(500).json({ message: "Server error. Please try again.", error: error.message });
    }
};

const passChangeOtpVerify = async (req, res) => {
    const { phoneNumber, otp, newPassword } = req.body;

    try {
        // Check if the OTP is valid
        const storedOtp = PasswordChangeTempUserMap.get(phoneNumber);
        if (!storedOtp || storedOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP." });
        }

        // Find the user by phone number
        const user = await User.findOne({ phoneNumber });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Update the user's password
        user.password = newPassword;
        await user.save();

        await sendEmail(user.email, "Password Change Notification", () => ChangePassword(user.firstName));

        // Remove the OTP from the temporary map
        PasswordChangeTempUserMap.delete(phoneNumber);

        await createNotification({
            userType: 'User',
            userId: user._id,
            message: `Password change OTP sent to ${phoneNumber} on ${new Date().toLocaleString()}`
        });

        res.status(200).json({ message: "Password changed successfully." });
    } catch (error) {
        console.error("Error in passChangeOtpVerify:", error);
        res.status(500).json({ message: "Server error. Please try again.", error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        // Find the user by ID from the request parameters
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Filter out fields that should not be updated
        const updates = Object.keys(req.body).filter(update =>
            update !== 'password' && update !== 'email' && update !== 'phoneNumber'
        );

        // Update the user object with the new values from req.body
        updates.forEach((update) => {
            if (user[update] !== undefined) {
                user[update] = req.body[update];
            }
        });
        let profilePictureUrl = req.uploadedFiles?.[0]?.path || null;
        // If a profile picture is provided, update it
        if (profilePictureUrl) {
            user.profilePicture = profilePictureUrl; // Assuming the profile picture is uploaded
        }

        // Save the updated user information in the database
        const updatedUser = await user.save();

        // Send profile update notification email
        await sendEmail(updatedUser.email, "Profile Updated", () => Update(updatedUser.firstName));

        // Respond with the updated user information
        // Create profile update notification
        await createNotification({
            userType: 'User',
            userId: updatedUser._id,
            message: `Your profile was updated on ${new Date().toLocaleString()}`
        });


        res.status(200).json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            profilePicture: updatedUser.profilePicture,
            phoneNumber: updatedUser.phoneNumber,
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(400).json({ message: "Failed to update profile. Please try again." });
    }
};

const verifyEmail = async (req, res) => {
    const userId = req.user._id
    const { otp } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const tempUser = RegisterTempUserMap.get(user.email);

        if (!tempUser) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        if (tempUser.otp !== otp) {
            return res.status(400).json({ message: "Incorrect OTP." });
        }

        // OTP is correct, mark email as verified

        if (user) {
            user.emailVerified = true;
            await user.save();
        }

        // Create email verification confirmation notification
        await createNotification({
            userType: 'User',
            userId: user._id,
            message: `Your email ${user.email} has been successfully verified`
        });

        // Remove the temporary user from the map
        RegisterTempUserMap.delete(user.email);

        res.status(200).json({ message: "Email verified successfully." });
    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const initiateEmailVerification = async (req, res) => {
    const userId = req.user._id

    try {
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Generate OTP and store it in the temporary user map
        const otp = generateOtp();
        RegisterTempUserMap.set(user.email, { otp });

        // Send OTP to the user's email
        await sendEmail(user.email, "Email Verification OTP", () => EmailVerificationOtp(user.firstName, otp));

        res.status(200).json({ message: "OTP sent to email. Please verify your email." });
    } catch (error) {
        console.error("Error initiating email verification:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};


// Add this new function after your existing exports

const blockUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user is already blocked
        if (user.status === 'blocked') {
            return res.status(400).json({ message: "User is already blocked" });
        }

        // Update user status to blocked
        user.status = 'blocked';
        user.blockReason = reason;
        user.blockedAt = new Date();
        await user.save();

        // Send email notification to user
        await sendEmail(
            user.email,
            "Account Blocked",
            `Dear ${user.firstName},\n\nYour account has been blocked by the administrator.\nReason: ${reason}\n\nIf you believe this is a mistake, please contact support.`
        );

        // Create notification for user
        await createNotification({
            userType: 'User',
            userId: user._id,
            message: `Your account has been blocked. Reason: ${reason}`
        });

        res.status(200).json({
            message: "User blocked successfully",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                status: user.status,
                blockReason: user.blockReason,
                blockedAt: user.blockedAt
            }
        });

    } catch (error) {
        console.error("Error blocking user:", error);
        res.status(500).json({
            message: "Server error while blocking user",
            error: error.message
        });
    }
};

const unblockUser = async (req, res) => {
    try {
        const { userId } = req.params;



        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user is already unblocked
        if (user.status !== 'blocked') {
            return res.status(400).json({ message: "User is not blocked" });
        }

        // Update user status to active
        user.status = 'active';
        user.blockReason = undefined;
        user.blockedAt = undefined;
        await user.save();

        // Send email notification to user
        await sendEmail(
            user.email,
            "Account Unblocked",
            `Dear ${user.firstName},\n\nYour account has been unblocked. You can now access your account normally.\n\nThank you for your patience.`
        );

        // Create notification for user
        await createNotification({
            userType: 'User',
            userId: user._id,
            message: `Your account has been unblocked. You can now access your account normally.`
        });

        res.status(200).json({
            message: "User unblocked successfully",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                status: user.status
            }
        });

    } catch (error) {
        console.error("Error unblocking user:", error);
        res.status(500).json({
            message: "Server error while unblocking user",
            error: error.message
        });
    }
};







export { register, blockUser, unblockUser, verifyRegistrationOtp, login, updateProfile, adminLogin, verifyAdminOtp, changePassword, passChangeOtpVerify, initiateEmailVerification, verifyEmail };
