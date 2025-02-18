import Notification from '../Models/Notification.js';

const createNotification = async ({ userType, userId, message }) => {
    try {
        const notification = new Notification({
            userType,
            userId,
            message
        });
        
        await notification.save();
        return notification;
    } catch (error) {
        throw error;
    }
};



export default createNotification;
