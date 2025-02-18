import express from "express";
import { 
    createFeedback,
    deleteFeedback,
    getPropertyFeedbacks,
    getProjectFeedbacks,
    getWebsiteFeedbacks
} from "../Controllers/Feedback.js";
import { authenticate, authenticateUser, authenticateSeller, authenticateBuilder } from "../middlewares/Authentication.js";

const router = express.Router();

// Create feedback
router.post('/', authenticateUser, createFeedback);

// Get property feedbacks
router.get('/property/:propertyId',  getPropertyFeedbacks);

// Get project feedbacks
router.get('/project/:projectId',  getProjectFeedbacks);

// Get website feedbacks
router.get('/landacers',  getWebsiteFeedbacks);


// Delete feedback
router.delete('/:id', authenticateUser, deleteFeedback);


export default router



