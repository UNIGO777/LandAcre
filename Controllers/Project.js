import createNotification from '../Hof/makeNotifiction.js';
import Project from '../Models/Projects.js';
import Seller from '../Models/Seller.js';
import User from '../Models/User.js';
import sendEmail from '../Nodemailer/Controller/Controller.js';
import { adminProjectSubmissionNotificationTemplate, projectBlockedTemplate, projectCreationRequestTemplate, projectDeletedTemplate } from '../Nodemailer/Tamplates/Project.js';


// Create Project
export const createProject = async (req, res) => {
    try {
        const { projectName, state, city, locality, totalUnits, availableUnits, amenities, launchDate, completionDate, projectType, description } = req.body;
        const sellerId = req.user._id;

        // Check if seller exists
        const seller = await Seller.findOne({ _id: sellerId, sellerType: 'Builder' });
        const Admin = await User.findOne({ role: 'admin' });
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        // Handle file uploads
        const images = req.files?.images?.map(file => file.path) || [];
        const video = req.files?.video?.[0]?.path || null;

        const newProject = new Project({
            projectName,
            location: {
                state,
                city,
                locality
            },
            totalUnits,
            availableUnits,
            amenities,
            launchDate,
            completionDate,
            projectType,
            sellerId,
            description,
            images,
            video
        });

        const savedProject = await newProject.save();

        // Add project to seller's projects array
        seller.projects.push(savedProject._id);
        await seller.save();  
        
        
        
        // Create notification for seller
        await createNotification({
            userType: 'Seller',
            userId: seller._id,
            message: `Your project ${savedProject.projectName} (${savedProject._id}) has been submitted for admin approval`
        });

        // Create notification for admin
        await createNotification({
            userId: Admin._id,
            userType: 'User',
            message: `New project submission from ${seller.sellerDetails.name} - ${savedProject.projectName} (${savedProject._id}) requires approval`
        });

        // Send project submission confirmation email
        await sendEmail(
            seller.sellerDetails.email,
            "Project Submission Confirmation",
            ()=>projectCreationRequestTemplate(
                seller.sellerDetails.name,
                {
                    projectName: savedProject.projectName,
                    _id: savedProject._id
                }
            )
        );

        // Send notification email to admin
        await sendEmail(
            process.env.ADMIN_EMAIL,
            "New Project Submission for Approval",
            ()=>adminProjectSubmissionNotificationTemplate(
                savedProject,
                {
                    companyName: seller.sellerDetails.companyName,
                    name: seller.sellerDetails.name,
                    email: seller.sellerDetails.email
                }
            )
        );

        res.status(201).json(savedProject);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};

// Get All Projects
export const getProjects = async (req, res) => {
    try {
        const { sellerId, page = 1 } = req.query;
        const filter = sellerId ? { sellerId } : {};
        const limit = 20;
        const skip = (page - 1) * limit;
        
        const [projects, totalProjects] = await Promise.all([
            Project.find({ ...filter, status: 'active' })
                .sort({ createdAt: -1 }) // Add sorting by createdAt descending
                .skip(skip)
                .limit(limit)
                .populate('sellerId', 'sellerDetails.profilePicture sellerDetails.name sellerType'),
            Project.countDocuments(filter)
        ]);
            
        res.status(200).json({
            data: projects,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalProjects / limit),
                totalProjects
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProjectsBySeller = async (req, res) => {
    try {
        const { page = 1, status = "active" } = req.query;
        const sellerId = req.user._id;
        const limit = 20;
        const skip = (page - 1) * limit;
        
        if (!status || !["active", "requested", "closed"].includes(status)) {
            return res.status(400).json({ message: "Valid status parameter required" });
        }

        const filter = { 
            sellerId: sellerId,
            status: status
        };

        const [projects, totalProjects] = await Promise.all([
            Project.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('sellerId', 'sellerDetails.profilePicture sellerDetails.name sellerType'),
            Project.countDocuments(filter)
        ]);

        res.status(200).json({
            data: projects,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalProjects / limit),
                totalProjects
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProjectsBySellerIdAdmin = async (req, res) => {
    try {
        const { page = 1, status = "active" } = req.query;
        const sellerId = req.params.id;
        const limit = 20;
        const skip = (page - 1) * limit;

        if (!status || !["active", "requested", "closed", "blocked"].includes(status)) {
            return res.status(400).json({ message: "Valid status parameter required" });
        }

        const filter = { 
            sellerId: sellerId,
            status: status
        };

        const [projects, totalProjects] = await Promise.all([
            Project.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('sellerId', 'sellerDetails.profilePicture sellerDetails.name sellerType'),
            Project.countDocuments(filter)
        ]);

        

        res.status(200).json({
            data: projects,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalProjects / limit),
                totalProjects
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get Single Project
export const getSingleProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('sellerId', 'sellerDetails.name sellerDetails.email sellerType');


        const relatedProjects = await Project.find({
            sellerId: project.sellerId._id,
            status: 'active',
            _id: { $ne: project._id }
        })
        .sort({ createdAt: -1 })
        .limit(4)
        .select('projectName location launchDate images');
            
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json({projectDetail: project, relatedProjects: relatedProjects});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



export const aprooveProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: { status: 'active' } },
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // If project was in requested state, update seller's projects array
        if (project.status === 'requested') {
            await Seller.findByIdAndUpdate(
                project.sellerId,
                { $addToSet: { projects: { projectId: project._id } } },
                { new: true }
            );
        }

        // Create notification for seller about project approval
        await createNotification({
            userType: 'Seller',
            userId: project.sellerId,
            message: `Your project ${project.projectName} (${project._id}) has been approved by admin`
        });

        res.status(200).json({ message: "Project status updated successfully", project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Delete Project
export const deleteProjectbyAdmin = async (req, res) => {
    try {
       
        const project = await Project.findById(req.params.id);
        
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if(project.status === "blocked"){
            return res.status(500).json({message: "Project is alrady blocked"})
        }

        project.status = "blocked"

        project.save()

        // Remove project from seller's projects array
        const seller = await Seller.findById(project.sellerId);
        if (seller) {
            console.log(seller.projects)
            seller.projects = seller.projects.filter(
                proj => proj.toString() !== project._id.toString()
            );
            await seller.save();
        }


        // Send project blocked notification to seller
        await createNotification({
            userType: 'Seller',
            userId: seller._id,
            message: `Your project ${project.projectName} (${project._id}) has been deleted by admin`
        });
        
        await sendEmail(
            seller.sellerDetails.email,
            "Project Blocked by Admin", 
            ()=>projectBlockedTemplate(seller.sellerDetails.name, project)
        );

        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {

        console.log(error)
        res.status(500).json({ error: error.message });
    }
};


export const deleteProjectbyBuilder = async (req, res) => {
    try {
        const SellerId = req.user._id
       
        const project = await Project.findById(req.params.id);
        
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.sellerId.toString() !== SellerId.toString()) {
            return res.status(403).json({ message: "Unauthorized access to project" });
        }

        if(project.status === "blocked"){
            return res.status(500).json({message: "Project is alrady deleted"})
        }

        project.status = "blocked"

        project.save()

        // Remove project from seller's projects array
        const seller = await Seller.findById(project.sellerId);
        if (seller) {
            console.log(seller.projects)
            seller.projects = seller.projects.filter(
                proj => proj.toString() !== project._id.toString()
            );
            await seller.save();
        }

        await createNotification({
            userType: 'Seller',
            userId: seller._id,
            message: `Your project ${project.projectName} (${project._id}) has been successfully deleted`
        });


        // Send project blocked notification to seller
        
        await sendEmail(
            seller.sellerDetails.email,
            "Project Blocked by Admin", 
            ()=>projectDeletedTemplate(seller.sellerDetails.name, project)
        );

        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {

        console.log(error)
        res.status(500).json({ error: error.message });
    }
};

export const searchProjectsByLocation = async (req, res) => {
    try {
        const { city, state, locality, page = 1 } = req.query;
        const pageNumber = parseInt(page);
        const perPage = 20;

        // Validate page number
        if (isNaN(pageNumber) || pageNumber < 1) {
            return res.status(400).json({ error: 'Invalid page number' });
        }

        // Build location filter
        const filter = {
            status: 'active',
            $or: []
        };

        if (city) filter.$or.push({ 'location.city': { $regex: city, $options: 'i' } });
        if (state) filter.$or.push({ 'location.state': { $regex: state, $options: 'i' } });
        if (locality) filter.$or.push({ 'location.locality': { $regex: locality, $options: 'i' } });
        // Remove $or if empty to prevent empty query
        if (filter.$or.length === 0) delete filter.$or;

        const totalProjects = await Project.countDocuments(filter);
        const totalPages = Math.ceil(totalProjects / perPage);

        const projects = await Project.find(filter)
            .sort({ createdAt: -1 }) // Add sorting by creation date (newest first)
            .skip((pageNumber - 1) * perPage)
            .limit(perPage)
            .populate('sellerId', 'sellerDetails.profilePicture sellerDetails.name sellerType')
            .select('-__v -createdAt -updatedAt')
            .lean();

        res.status(200).json({
            projects,
            totalPages,
            currentPage: pageNumber,
            totalProjects
        });
    } catch (error) {
        console.error('Error searching projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};







