export const userPropertyUpdateTemplate = (userName, propertyDetails) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Property Update Confirmation</title>
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
        .header img {
            max-width: 150px;
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
            <img src="https://drive.google.com/uc?export=view&id=1sA2OOgiZ_FGHwJ0oMaVxaeCpA8L4TqYd" height="50" width="80" alt="LandAcers Logo">
        </div>
        <div class="content">
            <h1>Property Update Confirmation</h1>
            <p>Hello ${userName},</p>
            <p>Your property has been successfully updated. Here are the details:</p>
            <p><strong>Property Title:</strong> ${propertyDetails.title}</p>
            <p><strong>Property Type:</strong> ${propertyDetails.type}</p>
            <p><strong>Description:</strong> ${propertyDetails.description}</p>
            <p><strong>PropertyId:</strong> ${propertyDetails._id}</p>
            <p>If you have any questions, feel free to reach out to us.</p>
        </div>
        <div class="footer">
            <p>Need help? Contact us at <a href="mailto:support@landacers.com">support@landacers.com</a></p>
            <p>&copy; 2025 LandAcers. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

export const adminPropertyUpdateNotificationTemplate = (propertyDetails) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Property Update Notification</title>
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
        .header img {
            max-width: 150px;
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
            <img src="https://drive.google.com/uc?export=view&id=1sA2OOgiZ_FGHwJ0oMaVxaeCpA8L4TqYd" height="50" width="80" alt="LandAcers Logo">
        </div>
        <div class="content">
            <h1>Property Update Notification</h1>
            <p>Hello Admin,</p>
            <p>A property has been updated. Here are the details:</p>
            <p><strong>Property Title:</strong> ${propertyDetails.title}</p>
            <p><strong>Property Type:</strong> ${propertyDetails.type}</p>
            <p><strong>Description:</strong> ${propertyDetails.description}</p>
            <p><strong>PropertyId:</strong> ${propertyDetails._id}</p>
            <p>Please review the changes and take any necessary actions.</p>
        </div>
        <div class="footer">
            <p>Need help? Contact us at <a href="mailto:support@landacers.com">support@landacers.com</a></p>
            <p>&copy; 2025 LandAcers. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
