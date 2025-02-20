import { FeaturedItem } from '../Models/FeaturedProjects&Properties.js';
import Project from '../Models/Projects.js';
import {Property} from '../Models/Property.js';

// Create featured item
export const createFeaturedItem = async (req, res) => {
    try {
        const { itemType, itemId, endDate } = req.body;

        // Validate date format and values
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(endDate)) {
            return res.status(400).json({ message: 'Invalid date format. Use DD/MM/YYYY' });
        }

        const [day, month, year] = endDate.split('/').map(Number);
        const parsedEndDate = new Date(year, month - 1, day);
        
        // Check if date components match input (prevent Date auto-correction)
        if (parsedEndDate.getDate() !== day || 
            parsedEndDate.getMonth() + 1 !== month || 
            parsedEndDate.getFullYear() !== year) {
            return res.status(400).json({ message: 'Invalid date values' });
        }

        // Check if date is in future (including time comparison)
        const now = new Date();
        parsedEndDate.setHours(23, 59, 59, 999); // Consider full day validity
        if (parsedEndDate <= now) {
            return res.status(400).json({ message: 'End date must be in the future' });
        }

        // Check if the active item exists
        const itemModel = itemType === 'Project' ? Project : Property;
        const existingItem = await itemModel.findOne({ 
            _id: itemId,
            status: "active"
        });
        
        if (!existingItem) {
            return res.status(404).json({ message: `${itemType} not found` });
        }

        const newFeaturedItem = new FeaturedItem({
            itemType,
            itemId,
            endDate: parsedEndDate,
            featuredDate: now,
            isActive: true
        });

        const savedItem = await newFeaturedItem.save();
        res.status(201).json({
            message: 'Item featured successfully',
            data: savedItem
        });
    } catch (error) {
        console.error('Error creating featured item:', error);
        res.status(500).json({
            error: error.message,
            message: 'Error featuring item'
        });
    }
};

// Delete featured item
export const deleteFeaturedItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await FeaturedItem.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({
                message: 'Featured item not found'
            });
        }

        res.status(200).json({
            message: 'Featured item removed successfully',
            data: deletedItem
        });
    } catch (error) {
        console.error('Error deleting featured item:', error);
        res.status(500).json({
            error: error.message,
            message: 'Error removing featured item'
        });
    }
};

// Get all active featured items
export const getActiveFeaturedItems = async (req, res) => {
    try {
        const { itemType, upcomming } = req.query;
        const now = new Date();
        
        const isUpcomingRequested = upcomming == 'true' ;
        
        // Build base query
        const query = { 
            isActive: true,
            endDate: { $gt: now }
        };

        // Add itemType filter if specified in query
        if (itemType) {
            if (!['Project', 'Property'].includes(itemType)) {
                return res.status(400).json({
                    message: 'Invalid itemType. Must be "Project" or "Property"'
                });
            }
            query.itemType = itemType;
        }

        const featuredItems = await FeaturedItem.find(query)
            .populate({
                path: 'itemId',
                // Add match condition for upcoming projects if requested
                match: {status: 'active'},
                populate: itemType === "Property" ? [
                    { path: 'locationSchemaId', model: 'PropertyLocation' },
                    { path: 'pricingDetails', model: 'Pricing' }
                ] : []
            })
            .sort({ featuredDate: -1 });

        // Filter out null results from upcoming match condition
        
        const filteredItems = featuredItems.filter(item => {
            return item.itemId.status == 'active' && item.itemId !== null && 
            (item.itemType !== 'Project' || item.itemId.isUpcomming === isUpcomingRequested)}
        );

        res.status(200).json({
            message: 'Active featured items retrieved successfully',
            data: filteredItems
        });
    } catch (error) {
        console.error('Error fetching featured items:', error);
        res.status(500).json({
            error: error.message,
            message: 'Error retrieving featured items'
        });
    }
};
