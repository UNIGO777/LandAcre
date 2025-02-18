export const SellerPropertyDeletedTemplate = (userName, propertyDetails) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Property Deletion Confirmation</title>
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
            <img src="https://drive.google.com/uc?export=view&id=1sqe0QiDvTwt_4MqEuoRjGrEPVOyXQPFv" alt="LandAcers Logo">
        </div>
        <div class="content">
            <h1>Property Deletion Confirmation</h1>
            <p>Hello ${userName},</p>
            <p>Your property has been successfully deleted. Below are the details of the removed property:</p>
            <p><strong>Property Title:</strong> ${propertyDetails?.title}</p>
            <p><strong>Property ID:</strong> ${propertyDetails?._id}</p>
            <p>This property is no longer visible on our platform.</p>
        </div>
        <div class="footer">
            <p>Need help? Contact us at <a href="mailto:support@landacers.com">support@landacers.com</a></p>
            <p>&copy; 2025 LandAcers. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

export const adminPropertyDeletedNotificationTemplate = (userName, propertyDetails) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Property Deletion Notification</title>
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
            <img src="https://drive.google.com/uc?export=view&id=1sqe0QiDvTwt_4MqEuoRjGrEPVOyXQPFv" alt="LandAcers Logo">
        </div>
        <div class="content">
            <h1>Property Deleted by Admin</h1>
            <p>Hello ${userName},</p>
            <p>Your property has been deleted by the LandAcers administration team. Here are the details:</p>
            <p><strong>Property Title:</strong> ${propertyDetails.title}</p>
            <p><strong>Property ID:</strong> ${propertyDetails._id}</p>
            <p>This property has been permanently removed from our system.</p>
        </div>
        <div class="footer">
            <p>Contact support at <a href="mailto:support@landacers.com">support@landacers.com</a></p>
            <p>&copy; 2025 LandAcers. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

