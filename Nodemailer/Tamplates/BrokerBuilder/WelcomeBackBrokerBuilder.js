export default ( name, role ) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Back to LandAcers</title>
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
        .cta-button {
            display: inline-block;
            padding: 12px 25px;
            margin-top: 20px;
            font-size: 16px;
            color: #fff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
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
            <h1>Welcome Back, ${name}!</h1>
            <p>As a ${role}, we're excited to have you back. Explore verified listings, connect with trusted sellers, and make secure transactions effortlessly.</p>
            <a href="${process.env.Full_path}" class="cta-button">Explore Now</a>
        </div>
        <div class="footer">
            <p>Need help? Contact us at <a href="mailto:support@landacers.com">support@landacers.com</a></p>
            <p>&copy; 2025 LandAcers. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`
