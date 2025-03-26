export default (userName, otp) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification OTP</title>
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
        .otp-code {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            margin: 20px 0;
            padding: 10px 20px;
            background-color: #ecf0f1;
            border-radius: 4px;
            display: inline-block;
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
            <h1>Email Verification OTP</h1>
            <p>Hello ${userName},</p>
            <p>Your one-time password (OTP) for email verification is:</p>
            <div class="otp-code">${otp}</div>
            <p>This OTP will expire in 5 minutes. Please do not share this code with anyone.</p>
        </div>
        <div class="footer">
            <p>Need help? Contact us at <a href="mailto:support@landacers.com">support@landacers.com</a></p>
            <p>&copy; 2025 LandAcers. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
