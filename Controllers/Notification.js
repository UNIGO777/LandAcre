import Notification from '../Models/Notification.js';
import User from '../Models/User.js';

// Get notifications for seller
export const getNotifications = async (req, res) => {
    
    
    try {
        const { page = 1, perPage = 20 } = req.query;
        const pageNumber = parseInt(page);
        const itemsPerPage = parseInt(perPage);

        // Validate pagination parameters
        if (isNaN(pageNumber) || pageNumber < 1 || isNaN(itemsPerPage) || itemsPerPage < 1) {
            return res.status(400).json({ error: 'Invalid pagination parameters' });
        }

        const skip = (pageNumber - 1) * itemsPerPage;
        
        const notifications = await Notification.find({
            userId: req.user._id
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(itemsPerPage);

        const totalNotifications = await Notification.countDocuments({
            userId: req.user._id
        });

        res.status(200).json({
            message: 'Seller notifications retrieved successfully',
            data: {
                notifications,
                pagination: {
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalNotifications / itemsPerPage),
                    totalNotifications
                }
            }
        });
    } catch (error) {
        console.error('Error fetching seller notifications:', error);
        res.status(500).json({
            error: error.message,
            message: 'Error retrieving seller notifications'
        });
    }
};


export const notificationsMarkAsReadAll = async(req,res)=>{
    try {
        await Notification.updateMany(
            { userId: req.user._id },
            { $set: { isRead: true } }
        );

        res.status(200).json({ 
            message: 'All notifications marked as read successfully',
            data: { success: true }
        });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        res.status(500).json({
            error: error.message,
            message: 'Error marking notifications as read'
        });
    }
}



