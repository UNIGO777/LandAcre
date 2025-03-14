export default (userName, action) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account ${action === 'deleted' ? 'Deleted' : action === 'unblocked' ? 'Unblocked' : 'Blocked'}</title>
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
            <h1>Account ${action === 'deleted' ? 'Permanently Deleted' : action === 'unblocked' ? 'Unblocked' : 'Blocked'}</h1>
            <p>Hello ${userName},</p>
            ${action === 'deleted' 
                ? `<p>Your account has been successfully deleted from our system. All your data has been permanently removed and you will no longer have access to our services.</p>`
                : action === 'unblocked'
                ? `<p>Great news! Your account has been unblocked by the administrator. You now have full access to all our services again. Thank you for your patience.</p>`
                : `<p>Your account has been blocked by the administrator due to violations of our terms of service. If you believe this is a mistake, please contact our support team.</p>`
            }
        </div>
        <div class="footer">
            <p>Need help? Contact us at <a href="mailto:support@landacers.com">support@landacers.com</a></p>
            <p>&copy; 2025 LandAcers. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;