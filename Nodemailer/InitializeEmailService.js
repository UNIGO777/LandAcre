import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();


const transporter = nodemailer.createTransport({
  service: 'gmail', // You can replace this with your email service (e.g., Outlook, custom SMTP)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // App password
  },
});

// Export the transporter



  

export { transporter};
