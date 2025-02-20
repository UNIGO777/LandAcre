import express from "express";
import { createFeaturedItem, deleteFeaturedItem, getActiveFeaturedItems } from "../Controllers/FeaturedProperties.js";
import { authenticateAdmin } from "../middlewares/Authentication.js";

const router = express.Router();

// Create featured item
router.post('/', authenticateAdmin,createFeaturedItem);

// Delete featured item
router.delete('/:id', authenticateAdmin, deleteFeaturedItem);

// Get active featured items
router.get('/', getActiveFeaturedItems);

export default router;
