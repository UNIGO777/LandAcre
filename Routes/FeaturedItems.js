import express from "express";
import { createFeaturedItem, deleteFeaturedItem, getActiveFeaturedItems } from "../Controllers/FeaturedProperties.js";
import { authenticateAdmin } from "../middlewares/Authentication.js";

const router = express.Router();

// Create featured item


// Delete featured item


// Get active featured items
router.get('/', getActiveFeaturedItems);

export default router;
