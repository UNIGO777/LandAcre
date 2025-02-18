import { Feedback } from "../Models/Feedback.js";
import { Property } from "../Models/Property.js";
import Project from '../Models/Projects.js';
import createNotification from "../Hof/makeNotifiction.js";



const createFeedback = async (req, res) => {
    try {
        const { feedbackType, propertyId, projectId, rating, comment } = req.body;
        const userId = req.user._id;

        // Validate existence of related entity based on feedback type
        if (feedbackType === 'property') {
            const property = await Property.findById(propertyId);
            if (!property) {
                return res.status(404).json({ message: 'Property not found' });
            }
        } else if (feedbackType === 'project') {
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }
        }

        // Check for existing feedback from same user
        let existingFeedback;
        if (feedbackType === 'property') {
            existingFeedback = await Feedback.findOne({ 
                user: userId,
                feedbackType: 'property',
                propertyId
            });
        } else if (feedbackType === 'project') {
            existingFeedback = await Feedback.findOne({ 
                user: userId,
                feedbackType: 'project',
                projectId
            });
        } else if (feedbackType === 'website') {
            existingFeedback = await Feedback.findOne({ 
                user: userId,
                feedbackType: 'website'
            });
        }

        if (existingFeedback) {
            const entityType = feedbackType === 'website' ? 'website' : 'this ' + feedbackType;
            return res.status(400).json({ 
                message: `You have already submitted feedback for ${entityType}`
            });
        }

        const newFeedback = new Feedback({
            feedbackType,
            propertyId: feedbackType === 'property' ? propertyId : undefined,
            projectId: feedbackType === 'project' ? projectId : undefined,
            user: userId,
            rating,
            comment
        });

        const savedFeedback = await newFeedback.save();

        // Create notification for seller
        if (savedFeedback.feedbackType === 'property' || savedFeedback.feedbackType === 'project') {
            let entityType = savedFeedback.feedbackType;
            const entity = entityType === 'property' 
                ? await Property.findById(savedFeedback.propertyId)
                : await Project.findById(savedFeedback.projectId);
            
            if (entity && entity.sellerId) {
                await createNotification({
                    userType: 'Seller',
                    userId: entity.sellerId,
                    message: `New ${entityType} feedback received for ${entity.title || entity.projectName} (ID: ${entity._id}): Rating ${savedFeedback.rating}, Comment: ${savedFeedback.comment}`
                });
            }
        }

        res.status(201).json({
            message: 'Feedback submitted successfully',
            data: savedFeedback
        });
    } catch (error) {
        console.error('Error creating feedback:', error);
        res.status(400).json({
            error: error.message,
            message: 'Error submitting feedback'
        });
    }
};

// const getFeedbackById = async (req, res) => {
//     try {
//         const feedback = await Feedback.findById(req.params.id)
//             .populate('user', 'firstName lastName email')
//             .populate('propertyId', 'title location')
//             .populate('projectId', 'title location');

//         if (!feedback) {
//             return res.status(404).json({ message: 'Feedback not found' });
//         }

//         res.status(200).json({
//             message: 'Feedback retrieved successfully',
//             data: feedback
//         });
//     } catch (error) {
//         console.error('Error fetching feedback:', error);
//         res.status(500).json({
//             error: error.message,
//             message: 'Error retrieving feedback'
//         });
//     }
// };


const deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        if (req.user._id.toString() !== feedback.user.toString()) {
            return res.status(403).json({ message: 'Unauthorized to delete this feedback' });
        }

        await Feedback.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: 'Feedback deleted successfully',
            data: feedback
        });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({
            error: error.message,
            message: 'Error deleting feedback'
        });
    }
};

const getPropertyFeedbacks = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        
        if (page < 1) {
            return res.status(400).json({ 
                message: 'Invalid page number' 
            });
        }

        const skip = (page - 1) * limit;
        const feedbacks = await Feedback.find({ 
            feedbackType: 'property',
            propertyId: propertyId
        })
        .skip(skip)
        .limit(limit)
        .populate('propertyId', 'title location')
        .populate('user', 'firstName lastName email')
        .sort({ createdAt: -1 });

        const total = await Feedback.countDocuments({ 
            feedbackType: 'property',
            propertyId: propertyId
        });

        res.status(200).json({
            message: 'Property feedbacks retrieved successfully',
            data: {
                page,
                totalPages: Math.ceil(total / limit),
                results: feedbacks
            }
        });
    } catch (error) {
        console.error('Error fetching property feedbacks:', error);
        res.status(500).json({
            error: error.message,
            message: 'Error retrieving property feedbacks'
        });
    }
};

const getProjectFeedbacks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        
        if (page < 1) {
            return res.status(400).json({ 
                message: 'Invalid page number' 
            });
        }

        const skip = (page - 1) * limit;
        const feedbacks = await Feedback.find({ 
            feedbackType: 'project',
            projectId: projectId
        })
        .skip(skip)
        .limit(limit)
        .populate('projectId', 'title location')
        .populate('user', 'firstName lastName email')
        .sort({ createdAt: -1 });

        const total = await Feedback.countDocuments({ 
            feedbackType: 'project',
            projectId: projectId
        });

        res.status(200).json({
            message: 'Project feedbacks retrieved successfully',
            data: {
                page,
                totalPages: Math.ceil(total / limit),
                results: feedbacks
            }
        });
    } catch (error) {
        console.error('Error fetching project feedbacks:', error);
        res.status(500).json({
            error: error.message,
            message: 'Error retrieving project feedbacks'
        });
    }
};

const getWebsiteFeedbacks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        
        if (page < 1) {
            return res.status(400).json({ 
                message: 'Invalid page number' 
            });
        }

        const skip = (page - 1) * limit;
        const feedbacks = await Feedback.find({ feedbackType: 'website' })
            .skip(skip)
            .limit(limit)
            .populate('user', 'firstName lastName email')
            .sort({ createdAt: -1 });

        const total = await Feedback.countDocuments({ feedbackType: 'website' });

        res.status(200).json({
            message: 'Website feedbacks retrieved successfully',
            data: {
                page,
                totalPages: Math.ceil(total / limit),
                results: feedbacks
            }
        });
    } catch (error) {
        console.error('Error fetching website feedbacks:', error);
        res.status(500).json({
            error: error.message,
            message: 'Error retrieving website feedbacks'
        });
    }
};

export { 
        createFeedback,
        deleteFeedback,
        getPropertyFeedbacks,
        getProjectFeedbacks,
        getWebsiteFeedbacks
};
