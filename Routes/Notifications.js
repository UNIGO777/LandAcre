import express from 'express';
import { getNotifications, notificationsMarkAsReadAll } from '../Controllers/Notification.js';
import { authenticate } from '../middlewares/Authentication.js';
const router = express.Router();

router.get('/', authenticate, getNotifications);
router.put('/mark-all-read', authenticate, notificationsMarkAsReadAll)

export default router;
