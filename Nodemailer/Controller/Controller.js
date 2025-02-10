import { transporter } from "../InitializeEmailService.js";

const sendEmail = async (to, subject, template) => {
  try {
    const html = template(); // Call the template function to generate the HTML
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    
    console.log("Email sent successfully");
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email" };
  }
};

export default sendEmail;