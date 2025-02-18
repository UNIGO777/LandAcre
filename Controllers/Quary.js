import { Property } from "../Models/Property.js";
import Seller from "../Models/Seller.js";
import User from "../Models/User.js";
import sendEmail from "../Nodemailer/Controller/Controller.js";
import { sellerPropertyEnquiryTemplate, userPropertyEnquiryConfirmationTemplate } from "../Nodemailer/Tamplates/properties/propertyQuary.js";
import  Query  from "../Models/Query.js";
import { sellerProjectEnquiryTemplate, userProjectEnquiryConfirmationTemplate } from "../Nodemailer/Tamplates/Project.js";
import Project from "../Models/Projects.js";
import createNotification from "../Hof/makeNotifiction.js";



const createQueryForProperty = async (req, res, next) => {
    try {
        const userId = req.user;
        
        const propertyId = req.params.id;

        if (!userId || !propertyId ) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'UserId, propertyId are required'
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                message: 'The specified user does not exist'
            });
        }

        // Check if property exists
        const property = await Property.findOne({ _id: propertyId, status: 'active' });
        if (!property) {
            return res.status(404).json({
                error: 'Property not found or not active property',
                message: 'The specified property does not exist'
            });
        }

       




        const seller = await Seller.findOne({ _id: property.sellerId, status: 'active'})    
        if (!seller) {
            return res.status(404).json({
                error: 'Seller not found or not active Seller',
                message: 'The specified Seller does not exist'
            });
        }


        // Check for existing query within last 2 days for same user and property
        const existingQuery = await Query.findOne({
            user: userId,
            'item.ItemId': propertyId,
            createdAt: { $gte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
        });


        if (existingQuery) {
            return res.status(400).json({
                error: 'Duplicate query restriction',
                message: 'You can only make one enquiry for any property in every 48 hours'
            });
        }

        const newQuery = new Query({
            user: userId,
            item: {
                ItemId: propertyId,
                Itemtype: 'Property'
            },
        });

        const savedQuery = await newQuery.save();

        seller.queries.push(newQuery._id)
        await seller.save()


         // Create notification for seller about new enquiry
        await createNotification({
            userType: 'Seller',
            userId: property.sellerId,
            message: `New enquiry received from ${user.firstName} for your property "${property.propertyTitle}" (${property._id}), Query ID: ${savedQuery._id}`
        });

        // Send email to seller
        await sendEmail(
            seller.sellerDetails.email,
            "New Property Enquiry",
            ()=>sellerPropertyEnquiryTemplate(
                user.firstName,
                user.email,
                user.phoneNumber,
                {
                    title: property.propertyTitle,
                    _id: property._id
                },
                seller.sellerDetails.phone
            )
        );

        // Send confirmation email to user
        await sendEmail(
            user.email,
            "Enquiry Confirmation",
            ()=>userPropertyEnquiryConfirmationTemplate(
                user.firstName,
                {
                    title: property.propertyTitle,
                },
                seller.sellerDetails.phone
            )
        );

        res.status(201).json({
            message: 'Query created successfully',
            data: savedQuery
        });

    } catch (error) {
        console.error('Error creating property query:', error);
        res.status(500).json({
            error: error.message,
            message: 'Error creating property query'
        });
    }
};


const createQueryForProject = async (req, res, next) => {
    try {
        const userId = req.user;
        const projectId = req.params.id;

        if (!userId || !projectId) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'UserId and projectId are required'
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                message: 'The specified user does not exist'
            });
        }

        // Check if project exists and is active
        const project = await Project.findOne({ _id: projectId, status: 'active' });
        if (!project) {
            return res.status(404).json({
                error: 'Project not found or not active',
                message: 'The specified project does not exist or is not active'
            });
        }

        // Check if seller exists and is active
        const seller = await Seller.findOne({ _id: project.sellerId, status: 'active' });    
        if (!seller) {
            return res.status(404).json({
                error: 'Seller not found or not active',
                message: 'The specified seller does not exist or is not active'
            });
        }

        // Check for existing query within last 2 days
        const existingQuery = await Query.findOne({
            user: userId,
            'item.ItemId': projectId,
            createdAt: { $gte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
        });

        if (existingQuery) {
            return res.status(400).json({
                error: 'Duplicate query restriction',
                message: 'You can only make one enquiry for any project in every 48 hours'
            });
        }

        // Create new query
        const newQuery = new Query({
            user: userId,
            item: {
                ItemId: projectId,
                Itemtype: 'Project'
            },
        });

        const savedQuery = await newQuery.save();
        seller.queries.push(newQuery._id);
        await seller.save();

        // Create notification for seller
        await createNotification({
            userType: 'Seller',
            userId: project.sellerId,
            message: `New enquiry received from ${user.firstName} for your project "${project.projectName}" (${project._id}), Query ID: ${savedQuery._id}`
        });

        // Send email to seller
        await sendEmail(
            seller.sellerDetails.email,
            "New Project Enquiry",
            () => sellerProjectEnquiryTemplate(
                seller.sellerDetails.name,
                {
                    name: user.firstName,
                    email: user.email,
                    phone: user.phoneNumber
                },
                {
                    projectName: project.projectName,
                    _id: project._id
                },
                seller.sellerDetails.phone
            )
        );

        // Send confirmation email to user
        await sendEmail(
            user.email,
            "Enquiry Confirmation",
            () => userProjectEnquiryConfirmationTemplate(
                user.firstName,
                {
                    projectName: project.projectName,
                },
                {
                    phone: seller.sellerDetails.phone,
                    email:seller.sellerDetails.email
                }
            )
        );

        res.status(201).json({
            message: 'Project enquiry created successfully',
            data: savedQuery
        });

    } catch (error) {
        console.error('Error creating project enquiry:', error);
        res.status(500).json({
            error: error.message,
            message: 'Error creating project enquiry'
        });
    }
};


const getPropertyQueries = async (req, res) => {
    try {
        const { id } = req.params;
        const sellerId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const perPage = 20;

        const property = await Property.findById(id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        if (property.sellerId.toString() !== sellerId.toString()) {
            return res.status(403).json({ message: 'Unauthorized access to property queries' });
        }

        const totalQueries = await Query.countDocuments({ 
            'item.ItemId': id,
            'item.Itemtype': 'Property'
        });
        const totalPages = Math.ceil(totalQueries / perPage);

        const queries = await Query.find({ 
            'item.ItemId': id,
            'item.Itemtype': 'Property'
        })
            .sort({ createdAt: -1 })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate('user', 'firstName email phoneNumber');

        res.status(200).json({
            message: 'Property queries retrieved successfully',
            data: {
                queries,
                pagination: {
                    totalQueries,
                    currentPage: page,
                    totalPages,
                    queriesPerPage: perPage
                }
            }
        });

    } catch (error) {
        console.error('Error fetching property queries:', error);
        res.status(500).json({
            error: error.message,
            message: 'Error retrieving property queries'
        });
    }
};

const getProjectQueries = async (req, res) => {
    try {
        const { id } = req.params;
        const sellerId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const perPage = 20;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.sellerId.toString() !== sellerId.toString()) {
            return res.status(403).json({ message: 'Unauthorized access to project queries' });
        }

        const totalQueries = await Query.countDocuments({ 
            'item.ItemId': id,
            'item.Itemtype': 'Project'
        });
        const totalPages = Math.ceil(totalQueries / perPage);

        const queries = await Query.find({ 
            'item.ItemId': id,
            'item.Itemtype': 'Project'
        })
            .sort({ createdAt: -1 })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate('user', 'firstName email phoneNumber');

        res.status(200).json({
            message: 'Project queries retrieved successfully',
            data: {
                queries,
                pagination: {
                    totalQueries,
                    currentPage: page,
                    totalPages,
                    queriesPerPage: perPage
                }
            }
        });

    } catch (error) {
        console.error('Error fetching project queries:', error);
        res.status(500).json({
            error: error.message,
            message: 'Error retrieving project queries'
        });
    }
};

const getQueryDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const query = await Query.findById(id)
            .populate({
                path: 'propertyId',
                select: 'sellerId',
                match: { sellerId: userId }
            })
            .populate({
                path: 'projectId',
                select: 'sellerId',
                match: { sellerId: userId }
            })
            .populate('userId', 'firstName lastName email phoneNumber');

        if (!query) {
            return res.status(404).json({ message: 'Query not found' });
        }

        // Check if user is either sender or recipient
        const isAuthorized = query.user._id.toString() === userId.toString() ||
                            query.propertyId?.sellerId?.toString() === userId.toString() ||
                            query.projectId?.sellerId?.toString() === userId.toString();

        if (!isAuthorized) {
            return res.status(403).json({ message: 'Unauthorized access to query details' });
        }

        res.status(200).json({
            message: 'Query details retrieved successfully',
            data: query
        });

    } catch (error) {
        console.error('Error fetching query details:', error);
        res.status(500).json({
            error: error.message,
            message: 'Error retrieving query details'
        });
    }
};

const getSellerQueries = async (req, res) => {
    try {
        const userId = req.user._id;

        const queries = await Query.find()
            .sort({ createdAt: -1 }) // Add sorting by createdAt in descending order
            .populate({
                path: 'item.ItemId',
                select: 'title location',
                match: { sellerId: userId },
                options: { strictPopulate: false }, // Handle cases where document might not exist
                refPath: 'item.Itemtype' // Use dynamic reference based on Itemtype
            })
            .populate('user', 'firstName lastName email phoneNumber')
            .exec();

        // Filter queries where seller is involved through populated item
        const sellerQueries = queries.filter(query => 
            query.item.ItemId // Only include queries where the item reference was successfully populated
        );

        res.status(200).json({
            message: 'Seller queries retrieved successfully',
            data: sellerQueries
        });

    } catch (error) {
        console.error('Error fetching seller queries:', error);
        res.status(500).json({
            error: error.message,
            message: 'Error retrieving seller queries'
        });
    }
};







export { createQueryForProperty, createQueryForProject,getPropertyQueries,getProjectQueries,getQueryDetail,getSellerQueries };
