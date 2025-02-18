import Notification from '../Models/Notification.js';
import User from '../Models/User.js';

// Get notifications for seller
export const getNotifications = async (req, res) => {
    const user = User.findById(req.user._id)
    const userType = !user.firstName ? 'Seller' : 'User'
    try {
        const notifications = await Notification.find({
            userType: userType,
            userId: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Seller notifications retrieved successfully',
            data: notifications
        });
    } catch (error) {
        console.error('Error fetching seller notifications:', error);
        res.status(500).json({
            error: error.message,
            message: 'Error retrieving seller notifications'
        });
    }
};




