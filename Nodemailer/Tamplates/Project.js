export const projectCreationRequestTemplate = (userName, projectDetails) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Submission Confirmation</title>
    <style>
        /* Reuse existing email template styles from property templates */
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; padding: 20px 0; }
        .header img { max-width: 150px; }
        .content { padding: 20px; }
        .content h1 { color: #333; text-align: center; }
        .content p { font-size: 16px; color: #666; line-height: 1.6; }
        .footer { text-align: center; padding: 15px; font-size: 14px; color: #777; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://drive.google.com/uc?export=view&id=1sqe0QiDvTwt_4MqEuoRjGrEPVOyXQPFv" alt="LandAcers Logo">
        </div>
        <div class="content">
            <h1>Project Submission Received</h1>
            <p>Hello ${userName},</p>
            <p>Your project submission has been received and is under review by our team.</p>
            <p><strong>Project Name:</strong> ${projectDetails?.projectName}</p>
            <p><strong>Project ID:</strong> ${projectDetails?._id}</p>
            <p>We will notify you once your project has been approved. This process typically takes 1-2 business days.</p>
        </div>
        <div class="footer">
            <p>Contact us at <a href="mailto:support@landacers.com">support@landacers.com</a></p>
            <p>&copy; 2025 LandAcers. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

export const projectApprovalTemplate = (userName, projectDetails) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Approved</title>
     <style>
        /* Reuse existing email template styles from property templates */
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; padding: 20px 0; }
        .header img { max-width: 150px; }
        .content { padding: 20px; }
        .content h1 { color: #333; text-align: center; }
        .content p { font-size: 16px; color: #666; line-height: 1.6; }
        .footer { text-align: center; padding: 15px; font-size: 14px; color: #777; }
    </style>
</head>
<body>
    <div class="header">
            <img src="https://drive.google.com/uc?export=view&id=1sqe0QiDvTwt_4MqEuoRjGrEPVOyXQPFv" alt="LandAcers Logo">
        </div>
    <div class="container">
        <div class="header">
            <img src="https://drive.google.com/uc?export=view&id=1sqe0QiDvTwt_4MqEuoRjGrEPVOyXQPFv" alt="LandAcers Logo">
        </div>
        <div class="content">
            <h1>Project Approved</h1>
            <p>Hello ${userName},</p>
            <p>Your project has been approved and is now live on our platform!</p>
            <p><strong>Project Name:</strong> ${projectDetails?.projectName}</p>
            <p><strong>Project ID:</strong> ${projectDetails?._id}</p>
            <p>You can view your live project here: <a href="${process.env.FRONTEND_URL}/projects/${projectDetails?._id}">View Project</a></p>
        </div>
        <div class="footer">
            <p>&copy; 2025 LandAcers. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

export const projectBlockedTemplate = (userName, projectDetails) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Blocked by admin</title>
    <style>
        /* Reuse existing email template styles from property templates */
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; padding: 20px 0; }
        .header img { max-width: 150px; }
        .content { padding: 20px; }
        .content h1 { color: #333; text-align: center; }
        .content p { font-size: 16px; color: #666; line-height: 1.6; }
        .footer { text-align: center; padding: 15px; font-size: 14px; color: #777; }
    </style>
</head>
<body>
<div class="header">
            <img src="https://drive.google.com/uc?export=view&id=1sqe0QiDvTwt_4MqEuoRjGrEPVOyXQPFv" alt="LandAcers Logo">
        </div>
    <div class="container">
        <div class="content">
            <h1>Project Blocked</h1>
            <p>Hello ${userName},</p>
            <p>Your project has been blocked by our administration team.</p>
            <p><strong>Project Name:</strong> ${projectDetails?.projectName}</p>
            <p>Please contact support for resolution.</p>
        </div>
    </div>
    <div class="footer">
            <p>&copy; 2025 LandAcers. All rights reserved.</p>
        </div>
</body>
</html>`;

export const projectDeletedTemplate = (userName, projectDetails) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project deleted</title>
    <style>
        /* Reuse existing email template styles from property templates */
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; padding: 20px 0; }
        .header img { max-width: 150px; }
        .content { padding: 20px; }
        .content h1 { color: #333; text-align: center; }
        .content p { font-size: 16px; color: #666; line-height: 1.6; }
        .footer { text-align: center; padding: 15px; font-size: 14px; color: #777; }
    </style>
</head>
<body>
<div class="header">
            <img src="https://drive.google.com/uc?export=view&id=1sqe0QiDvTwt_4MqEuoRjGrEPVOyXQPFv" alt="LandAcers Logo">
        </div>
    <div class="container">
        <div class="content">
            <h1>Project Deletion Confirmation</h1>
            <p>Hello ${userName},</p>
            <p>Your project has been successfully deleted:</p>
            <p><strong>Project Name:</strong> ${projectDetails?.projectName}</p>
            <p><strong>Project ID:</strong> ${projectDetails?._id}</p>
            <p>This project is no longer visible on our platform.</p>
        </div>
    </div>
    <div class="footer">
            <p>&copy; 2025 LandAcers. All rights reserved.</p>
        </div>
</body>
</html>`;

export const sellerProjectEnquiryTemplate = (userName, userDetails, projectDetails, message) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Enquiry</title>
    <style>
        /* Reuse existing email template styles from property templates */
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; padding: 20px 0; }
        .header img { max-width: 150px; }
        .content { padding: 20px; }
        .content h1 { color: #333; text-align: center; }
        .content p { font-size: 16px; color: #666; line-height: 1.6; }
        .footer { text-align: center; padding: 15px; font-size: 14px; color: #777; }
    </style>
</head>
<body>
<div class="header">
            <img src="https://drive.google.com/uc?export=view&id=1sqe0QiDvTwt_4MqEuoRjGrEPVOyXQPFv" alt="LandAcers Logo">
        </div>
    <div class="container">
        <div class="content">
            <h1>New Project Enquiry</h1>
            <p>Hello ${userName},</p>
            <p>You have a new enquiry for your project:</p>
            <p><strong>Project:</strong> ${projectDetails?.projectName} with id ${projectDetails?._id}</p>
            <p><strong>From:</strong> ${userDetails.name} (${userDetails.email}, ${userDetails.phone})</p>
            <p><strong>Message:</strong> ${message}</p>
        </div>
    </div>
    <div class="footer">
            <p>&copy; 2025 LandAcers. All rights reserved.</p>
        </div>
</body>
</html>`;

export const userProjectEnquiryConfirmationTemplate = (userName, projectDetails, sellerContect) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Enquiry</title>
    <style>
        /* Reuse existing email template styles from property templates */
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; padding: 20px 0; }
        .header img { max-width: 150px; }
        .content { padding: 20px; }
        .content h1 { color: #333; text-align: center; }
        .content p { font-size: 16px; color: #666; line-height: 1.6; }
        .footer { text-align: center; padding: 15px; font-size: 14px; color: #777; }
    </style>
</head>
<body>
<div class="header">
            <img src="https://drive.google.com/uc?export=view&id=1sqe0QiDvTwt_4MqEuoRjGrEPVOyXQPFv" alt="LandAcers Logo">
        </div>
    <div class="container">
        <div class="content">
            <h1>Enquiry Received</h1>
            <p>Hello ${userName},</p>
            <p>Thank you for your interest in <strong>${projectDetails?.projectName}</strong>.</p>
            <p>The seller/builder will contact you shortly regarding your enquiry. You can also contact them directly at ${sellerContect.phone} or via email at ${sellerContect.email}.</p>
        </div>
    </div>
    <div class="footer">
            <p>&copy; 2025 LandAcers. All rights reserved.</p>
        </div>
</body>
</html>`;


export const adminProjectSubmissionNotificationTemplate = (projectDetails, builderDetails) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Project Submission</title>
    <style>
        /* Consistent styling with existing templates */
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; padding: 20px 0; }
        .header img { max-width: 150px; }
        .content { padding: 20px; }
        .content h1 { color: #333; text-align: center; }
        .content p { font-size: 16px; color: #666; line-height: 1.6; }
        .footer { text-align: center; padding: 15px; font-size: 14px; color: #777; }
        .highlight { background-color: #f8f9fa; padding: 10px; border-radius: 4px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="header">
        <img src="https://drive.google.com/uc?export=view&id=1sqe0QiDvTwt_4MqEuoRjGrEPVOyXQPFv" alt="LandAcers Logo">
    </div>
    <div class="container">
        <div class="content">
            <h1>New Project Submission</h1>
            <p>A new project has been submitted for approval:</p>
            
            <div class="highlight">
                <p><strong>Project Name:</strong> ${projectDetails?.projectName}</p>
                <p><strong>Project ID:</strong> ${projectDetails?._id}</p>
                ${builderDetails?.companyName && `<p><strong>Submitted by:</strong> ${builderDetails?.companyName}</p>`}
                <p><strong>Builder Contact:</strong> ${builderDetails?.name} (${builderDetails?.email})</p>
            </div>

            <p>Please review the project details in the admin dashboard and take appropriate action.</p>
        </div>
    </div>
    <div class="footer">
        <p>Need assistance? Contact our support team at <a href="mailto:support@landacers.com">support@landacers.com</a></p>
        <p>&copy; 2025 LandAcers. All rights reserved.</p>
    </div>
</body>
</html>`;




