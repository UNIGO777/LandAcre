import express from 'express';
import { getNotifications } from '../Controllers/Notification.js';
import { authenticate } from '../middlewares/Authentication.js';
const router = express.Router();

router.get('/', authenticate, getNotifications);

export default router;
