import { Property } from '../Models/Property.js';
import Project from '../Models/Projects.js';
import User from '../Models/User.js';
import Seller from '../Models/Seller.js';
import Quary from '../Models/Query.js';

// Get analytics for admin dashboard
export const getAdminAnalytics = async (req, res) => {
    try {
        // Get property statistics
        const [totalProperties, activeProperties, recentProperties] = await Promise.all([
            Property.countDocuments(),
            Property.countDocuments({ status: 'active' }),
            Property.find({status: 'active'})
                .sort({ createdAt: -1 })
                .limit(5)
                .select('title sellerId createdAt propertyMedia transactionType propertyType isCommercial')
                .populate('sellerId', 'name email phoneNumber profilePicture')
        ]);

        // Get project statistics
        const [totalProjects, activeProjects, recentProjects] = await Promise.all([
            Project.countDocuments(),
            Project.countDocuments({ status: 'active' }),
            Project.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('projectName launchDate projectType images video sellerId createdAt')
                .populate('sellerId', 'name email phoneNumber profilePicture')
        ]);

        // Get user statistics
        const [totalUsers, activeUsers] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            User.countDocuments({ role: 'user', status: 'active' })
        ]);

        // Get seller statistics
        const [totalSellers, activeSellers] = await Promise.all([
            Seller.countDocuments(),
            Seller.countDocuments({ status: 'active' })
        ]);

        res.status(200).json({
            success: true,
            data: {
                properties: {
                    total: totalProperties,
                    active: activeProperties,
                    recent: recentProperties
                },
                projects: {
                    total: totalProjects,
                    active: activeProjects,
                    recent: recentProjects
                },
                users: {
                    total: totalUsers,
                    active: activeUsers
                },
                sellers: {
                    total: totalSellers,
                    active: activeSellers
                }
            }
        });

    } catch (error) {
        console.error('Error fetching admin analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching analytics data',
            error: error.message
        });
    }
};







// Verify admin token middleware
export const verifyAdminToken = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user exists and is admin
        const user = await User.findById(decoded.id);
        
        if (!user || user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Not authorized as admin.'
            });
        }

        // Add user info to request
        req.user = user;
        res.status(200).json({
            success: true,
            message: 'Admin token verified',
            data: user
        });

    } catch (error) {
        console.error('Error verifying admin token:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: error.message
        });
    }
};


// Get users by status
export const getUsersbyadmin = async (req, res) => {
    try {
        let { status, page } = req.query;
        
        if(!status) status = 'active';
        if(!page) page = 1;

        // Convert page to number
        page = parseInt(page);

        // Validate status parameter
        if (!status || !['active', 'blocked'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status parameter. Must be either "active" or "blocked"'
            });
        }

        // Calculate skip value for pagination
        const limit = 20;
        const skip = (page - 1) * limit;

        // Find users with the specified status with pagination
        const [users, totalUsers] = await Promise.all([
            User.find({ 
                role: 'user',
                status: status 
            })
            .select('firstName lastName email phoneNumber profilePicture status createdAt')
            .skip(skip)
            .limit(limit),
            User.countDocuments({
                role: 'user',
                status: status
            })
        ]);

        res.status(200).json({
            success: true,
            count: users.length,
            totalUsers,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            data: users
        });

    } catch (error) {
        console.error('Error fetching users by status:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};


// Search users by email, name or phone number
export const searchUsers = async (req, res) => {
    try {
        const { query, page = 1 } = req.query;

        if(query.includes('%20')) {
            query = query.replace('%20', ' ');
        }

        

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        // Convert page to number and set limit
        const limit = 20;
        const skip = (parseInt(page) - 1) * limit;

        // Create search criteria
        const searchCriteria = {
            role: 'user',
            $or: [
                { email: { $regex: query, $options: 'i' } },
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } },
                { phoneNumber: { $regex: query, $options: 'i' } }
            ]
        };

        // Find users matching search criteria with pagination
        const [users, totalUsers] = await Promise.all([
            User.find(searchCriteria)
                .select('firstName lastName email phoneNumber profilePicture status createdAt')
                .skip(skip)
                .limit(limit),
            User.countDocuments(searchCriteria)
        ]);

        res.status(200).json({
            success: true,
            count: users.length,
            totalUsers,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalUsers / limit),
            data: users
        });

    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching users',
            error: error.message
        });
    }
};


