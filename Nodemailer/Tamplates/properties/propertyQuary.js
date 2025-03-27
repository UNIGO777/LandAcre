export const sellerPropertyEnquiryTemplate = (enquirerName, enquirerEmail, enquirerPhone, propertyDetails, sellerPhone) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Property Enquiry</title>
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
            padding: 20px;
        }
        .details-table {
            width: 100%;
            margin: 20px 0;
        }
        .details-table td {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
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
            <h1 style="text-align: center; color: #333;">New Property Enquiry</h1>
            <p>Dear Seller,</p>
            <p>A potential buyer has shown interest in your property:</p>
            
            <table class="details-table">
                <tr><td><strong>Property Title:</strong></td><td>${propertyDetails?.title}</td></tr>
                <tr><td><strong>Property ID:</strong></td><td>${propertyDetails?._id}</td></tr>
                <tr><td><strong>Enquirer Name:</strong></td><td>${enquirerName}</td></tr>
                <tr><td><strong>Enquirer Email:</strong></td><td>${enquirerEmail}</td></tr>
                <tr><td><strong>Enquirer Phone:</strong></td><td>${enquirerPhone}</td></tr>
                <tr><td><strong>Your Contact Number:</strong></td><td>${sellerPhone}</td></tr>
            </table>
            
            <p>Please contact the enquirer directly using the provided contact information.</p>
        </div>
        <div class="footer">
            <p>Best Regards,<br>LandAcre Team</p>
            <p>&copy; 2025 LandAcre. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

export const userPropertyEnquiryConfirmationTemplate = (userName, propertyDetails, sellerPhone) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enquiry Confirmation</title>
    <style>
        /* Shared styles from previous templates */
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; padding: 20px 0; }
        .content { padding: 20px; }
        .footer { text-align: center; padding: 15px; font-size: 14px; color: #777; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://drive.google.com/uc?export=view&id=1sA2OOgiZ_FGHwJ0oMaVxaeCpA8L4TqYd" height="50" width="80" alt="LandAcre Logo">
        </div>
        <div class="content">
            <h1 style="text-align: center; color: #333;">Enquiry Received</h1>
            <p>Dear ${userName},</p>
            <p>Thank you for your interest in the property:</p>
            <p><strong>${propertyDetails?.title}</strong></p>
            <p>We've successfully delivered your enquiry to the seller.</p>
            <p style="margin-top: 20px;"><strong>Seller's Contact Number:</strong> ${sellerPhone}</p>
            <p>The seller will contact you directly to discuss the property details.</p>
        </div>
        <div class="footer">
            <p>Need assistance? Contact us at <a href="mailto:support@LandAcre.com">support@LandAcre.com</a></p>
            <p>&copy; 2025 LandAcre. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
