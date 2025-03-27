export const propertyApprovalNotificationTemplate = (User,propertyTitle) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Property Approval Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 20px 0;
        }
        .content {
            text-align: center;
            padding: 20px;
        }
        .content h1 {
            color: #333;
        }
        .content p {
            font-size: 16px;
            color: #666;
            line-height: 1.6;
        }
        .footer {
            text-align: center;
            padding: 15px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://drive.google.com/uc?export=view&id=1sA2OOgiZ_FGHwJ0oMaVxaeCpA8L4TqYd" height="50" width="80" alt="LandAcre Logo">
        </div>
        <div class="content">
            <h1>Property Approval Notification</h1>
            <p>Dear Valued ${User},</p>
            <p>We are pleased to inform you that your property titled <strong>"${propertyTitle}"</strong> has been successfully approved & listed on our platform.</p>
            <p>Thank you for choosing our platform to list your property. We wish you the best in your future endeavors.</p>
        </div>
        <div class="footer">
            <p>Best Regards,<br>Your Property Management Team</p>
            <p>Need help? Contact us at <a href="mailto:support@LandAcre.com">support@LandAcre.com</a></p>
            <p>&copy; 2025 LandAcre. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
