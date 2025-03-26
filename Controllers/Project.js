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
        // console.log(req.body)
        const sellerId = req.user._id;

        // Check if seller exists
        const seller = await Seller.findOne({ _id: sellerId, sellerType: 'Builder' });
        const Admin = await User.findOne({ role: 'admin' });
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

      

        // Handle file uploads
        const images = req.files?.images?.map(file => file.path.split('/').pop()) || [];
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
            amenities: JSON.parse(amenities),
            launchDate,
            completionDate,
            projectType,
            sellerId,
            isUpcomming: req.body.isUpcoming || false,
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
            () => projectCreationRequestTemplate(
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
            () => adminProjectSubmissionNotificationTemplate(
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

// Add this new function to your Project.js controller

export const searchProjectsByAdmin = async (req, res) => {
    try {
        const { projectType, state, city, locality, page = 1, status, searchQuery, isUpcoming } = req.query;

        // Build base query
        let query = {};

        // Add status filter if provided
        if (status && ['requested', 'active', 'closed', 'blocked'].includes(status)) {
            query.status = status;
        }

        // Add isUpcoming filter if provided
        if (isUpcoming === 'true') {
            query.isUpcomming = true;
        } else if (isUpcoming === 'false' || isUpcoming === 'undefined') {
            query.isUpcomming = false;
        }

        // Get projects with seller info
        let projects = await Project.find(query)
            .populate([
                { 
                    path: 'sellerId',
                    select: 'sellerDetails.name sellerDetails.email sellerType'
                }
            ])
            .select('-__v')
            .lean();

        // Calculate relevance scores and filter projects
        projects = projects.map(project => {
            const matchesProjectType = !projectType || project.projectType === projectType;
            
            // Location matching with scoring
            let locationScore = 0;
            let locationMatches = false;

            if (project.location) {
                if (state && project.location.state?.match(new RegExp(state, 'i'))) {
                    locationScore += 1;
                    locationMatches = true;
                }
                if (city && project.location.city?.match(new RegExp(city, 'i'))) {
                    locationScore += 2;
                    locationMatches = true;
                }
                if (locality && project.location.locality?.match(new RegExp(locality, 'i'))) {
                    locationScore += 3;
                    locationMatches = true;
                }
            }
            const matchesLocation = !city && !locality && !state || locationMatches;

            // Search query matching with enhanced scoring
            let searchScore = 0;
            if (searchQuery) {
                const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);
                
                // Project name matching
                if (project.projectName) {
                    const projectNameWords = project.projectName.toLowerCase().trim().split(/\s+/);
                    const projectNameFullText = project.projectName.toLowerCase();
                    
                    // Full phrase match in project name
                    if (projectNameFullText.includes(searchQuery.toLowerCase())) {
                        searchScore += 15;
                    }

                    for (const searchTerm of searchTerms) {
                        for (const word of projectNameWords) {
                            // Exact word match
                            if (word === searchTerm) {
                                searchScore += 10;
                            }
                            // Start of word match
                            else if (word.startsWith(searchTerm) || searchTerm.startsWith(word)) {
                                searchScore += 7;
                            }
                            // Partial match
                            else if (word.includes(searchTerm) || searchTerm.includes(word)) {
                                searchScore += 5;
                            }
                            // Fuzzy match
                            else if (calculateLevenshteinDistance(word, searchTerm) <= 2) {
                                searchScore += 2;
                            }
                        }
                    }
                }

                // Location matching
                if (project.location) {
                    const locationFields = {
                        locality: { value: project.location.locality, weight: 3 },
                        city: { value: project.location.city, weight: 2 },
                        state: { value: project.location.state, weight: 1 }
                    };

                    for (const [field, { value, weight }] of Object.entries(locationFields)) {
                        if (!value) continue;
                        
                        const locationWords = value.toLowerCase().trim().split(/\s+/);
                        const locationFullText = value.toLowerCase();

                        if (locationFullText.includes(searchQuery.toLowerCase())) {
                            searchScore += weight * 3;
                        }

                        for (const searchTerm of searchTerms) {
                            for (const locationWord of locationWords) {
                                if (locationWord === searchTerm) {
                                    searchScore += weight * 2;
                                } else if (locationWord.includes(searchTerm) || searchTerm.includes(locationWord)) {
                                    searchScore += weight;
                                }
                            }
                        }
                    }
                }

                // Description matching
                if (project.description) {
                    const descWords = project.description.toLowerCase().trim().split(/\s+/);
                    const descFullText = project.description.toLowerCase();

                    if (descFullText.includes(searchQuery.toLowerCase())) {
                        searchScore += 4;
                    }

                    for (const searchTerm of searchTerms) {
                        for (const descWord of descWords) {
                            if (descWord === searchTerm) {
                                searchScore += 2;
                            } else if (descWord.includes(searchTerm) || searchTerm.includes(descWord)) {
                                searchScore += 1;
                            }
                        }
                    }
                }
            }

            // Calculate total relevance score
            const relevanceScore = searchScore + locationScore;

            return {
                ...project,
                relevanceScore,
                matches: matchesProjectType && matchesLocation && (searchQuery ? searchScore > 0 : true)
            };
        }).filter(project => project.matches)
          .sort((a, b) => b.relevanceScore - a.relevanceScore);

        // Apply pagination
        const limit = 20;
        const total = projects.length;
        const totalPages = Math.ceil(total / limit);
        const paginatedProjects = projects.slice((page - 1) * limit, page * limit);

        // Remove scoring fields from final output
        paginatedProjects.forEach(project => {
            delete project.relevanceScore;
            delete project.matches;
        });

        res.status(200).json({
            data: paginatedProjects,
            totalPages,
            currentPage: parseInt(page),
            totalRecords: total
        });

    } catch (error) {
        console.error('Error searching projects:', error);
        res.status(500).json({
            error: error.message,
            message: 'Error searching projects'
        });
    }
};

// Helper function for fuzzy matching
function calculateLevenshteinDistance(str1, str2) {
    if (Math.abs(str1.length - str2.length) > 3) return Infinity;
    
    const track = Array(str2.length + 1).fill(null).map(() =>
        Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) track[0][i] = i;
    for (let j = 0; j <= str2.length; j++) track[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
            const indicator = str1[i - 1].toLowerCase() === str2[j - 1].toLowerCase() ? 0 : 1;
            track[j][i] = Math.min(
                track[j][i - 1] + 1,
                track[j - 1][i] + 1,
                track[j - 1][i - 1] + indicator
            );
        }
    }
    
    return track[str2.length][str1.length];
}


export const getProjectsBySeller = async (req, res) => {
    try {
       
        const { page = 1, status = "active", type = "all", isUpcoming } = req.query;
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

        // Add isUpcomming filter if provided
        if (isUpcoming == 'true') {
            console.log("isUpcomming");
            filter.isUpcomming = true;
        }

        // Handle project type filtering
        if (type === "all" || !type || type === '') {
            filter.projectType = { $in: ["Residential", "Commercial", "Mixed-use"] };
        } else {
            filter.projectType = type;
        }

        console.log(filter);

        const [projects, totalProjects] = await Promise.all([
            Project.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('sellerId', 'sellerDetails.profilePicture sellerDetails.name sellerType'),
            Project.countDocuments(filter)
        ]);

        // console.log(projects);

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
        const { page = 1, status = "active", type = "all", isUpcomming } = req.query;
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

        // Add isUpcomming filter if provided
        if (isUpcomming === 'true') {
            filter.isUpcomming = true;
        }

        // Handle project type filtering
        if (type === "all" || !type || type === '') {
            filter.projectType = { $in: ["Residential", "Commercial", "Mixed-use"] };
        } else {
            filter.projectType = type;
        }

        console.log(filter);

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

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

       

        res.status(200).json({ projectDetail: project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Related Projects
export const getRelatedProjects = async (req, res) => {
    try {
        const projectId = req.params.id;
        
        // Get the original project
        const originalProject = await Project.findById(projectId)
            .populate('sellerId')
            .lean();

        if (!originalProject) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Try multiple matching strategies in order of relevance
        let relatedProjects = [];
        
        // Strategy 1: Exact match on project type in same city
        if (relatedProjects.length < 5) {
            const exactMatchQuery = {
                _id: { $ne: projectId },
                status: 'active',
                projectType: originalProject.projectType,
                'location.city': originalProject.location?.city
            };
            
            const exactMatches = await Project.find(exactMatchQuery)
                .populate('sellerId', 'sellerDetails.name sellerDetails.profilePicture sellerType')
                .limit(10)
                .lean();

            relatedProjects.push(...exactMatches);
        }

        // Strategy 2: Same project type, different city
        if (relatedProjects.length < 5) {
            const sameTypeQuery = {
                _id: { $ne: projectId },
                status: 'active',
                projectType: originalProject.projectType,
                'location.city': { $ne: originalProject.location?.city }
            };
            
            const sameTypeMatches = await Project.find(sameTypeQuery)
                .populate('sellerId', 'sellerDetails.name sellerDetails.profilePicture sellerType')
                .limit(10)
                .lean();

            relatedProjects.push(...sameTypeMatches);
        }

        // Strategy 3: Same city, any project type
        if (relatedProjects.length < 5 && originalProject.location?.city) {
            const sameCityMatches = await Project.find({
                _id: { $ne: projectId },
                status: 'active',
                'location.city': originalProject.location.city,
                projectType: { $ne: originalProject.projectType }
            })
            .populate('sellerId', 'sellerDetails.name sellerDetails.profilePicture sellerType')
            .limit(10)
            .lean();

            relatedProjects.push(...sameCityMatches);
        }

        // Strategy 4: Same state, any project type
        if (relatedProjects.length < 5 && originalProject.location?.state) {
            const sameStateMatches = await Project.find({
                _id: { $ne: projectId },
                status: 'active',
                'location.state': originalProject.location.state,
                'location.city': { $ne: originalProject.location?.city }
            })
            .populate('sellerId', 'sellerDetails.name sellerDetails.profilePicture sellerType')
            .limit(10)
            .lean();

            relatedProjects.push(...sameStateMatches);
        }

        // Strategy 5: Fallback - just get some active projects if we still don't have enough
        if (relatedProjects.length < 5) {
            const fallbackMatches = await Project.find({
                _id: { $ne: projectId },
                status: 'active'
            })
            .populate('sellerId', 'sellerDetails.name sellerDetails.profilePicture sellerType')
            .limit(10)
            .lean();

            relatedProjects.push(...fallbackMatches);
        }

        // Remove duplicates by converting to Set and back
        const uniqueIds = new Set();
        relatedProjects = relatedProjects.filter(project => {
            const id = project._id.toString();
            if (uniqueIds.has(id)) {
                return false;
            }
            uniqueIds.add(id);
            return true;
        });

        // Calculate similarity scores
        relatedProjects = relatedProjects.map(project => {
            let similarityScore = 0;

            // Project type match
            if (project.projectType === originalProject.projectType) {
                similarityScore += 30;
            }

            // Location similarity - with null checks
            if (project.location && originalProject.location) {
                if (project.location.city === originalProject.location.city) {
                    similarityScore += 20;
                }
                if (project.location.state === originalProject.location.state) {
                    similarityScore += 10;
                }
                if (project.location.locality === originalProject.location.locality) {
                    similarityScore += 15;
                }
            }

            // Same seller
            if (project.sellerId && originalProject.sellerId && 
                project.sellerId._id.toString() === originalProject.sellerId._id.toString()) {
                similarityScore += 10;
            }

            // Upcoming status match
            if (project.isUpcomming === originalProject.isUpcomming) {
                similarityScore += 5;
            }

            return {
                ...project,
                similarityScore
            };
        });

        // Sort by similarity score and take top 5
        relatedProjects.sort((a, b) => b.similarityScore - a.similarityScore);
        relatedProjects = relatedProjects.slice(0, 5);

        // Remove similarity scores from final response
        relatedProjects = relatedProjects.map(project => {
            const { similarityScore, ...projectWithoutScore } = project;
            return projectWithoutScore;
        });

        res.status(200).json({
            success: true,
            message: 'Related projects retrieved successfully',
            data: relatedProjects
        });

    } catch (error) {
        console.error('Error getting related projects:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error getting related projects'
        });
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

        if (project.status === "blocked") {
            return res.status(500).json({ message: "Project is alrady blocked" })
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
            () => projectBlockedTemplate(seller.sellerDetails.name, project)
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

        if (project.status === "blocked") {
            return res.status(500).json({ message: "Project is alrady deleted" })
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
            () => projectDeletedTemplate(seller.sellerDetails.name, project)
        );

        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {

        console.log(error)
        res.status(500).json({ error: error.message });
    }
};

export const searchProjectsByLocation = async (req, res) => {
    try {
        const { city, state, locality, page = 1, projectType } = req.query;
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

        // Add project type filter if provided
        if (projectType) {
            filter.projectType = { $in: [projectType] };
        }

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


// Mark project as closed
export const markProjectAsClosed = async (req, res) => {
    try {
        const projectId = req.params.id;
        const sellerId = req.user._id;

        // Find the project and verify seller ownership
        const project = await Project.findOne({ _id: projectId, sellerId });

        if (!project) {
            return res.status(404).json({ message: "Project not found or you don't have permission to modify it" });
        }

        // Update project status to closed
        project.status = 'closed';
        await project.save();

        // Create notification for seller
        await createNotification({
            userType: 'Seller',
            userId: sellerId,
            message: `Your project ${project.projectName} has been marked as closed`
        });

        res.status(200).json({ 
            message: "Project marked as closed successfully",
            project
        });

    } catch (error) {
        console.error('Error marking project as closed:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};










