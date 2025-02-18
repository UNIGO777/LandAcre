import express from "express";
import { createQueryForProject, createQueryForProperty, getProjectQueries, getPropertyQueries, getQueryDetail, getSellerQueries } from "../Controllers/Quary.js";
import { authenticate, authenticateBuilder, authenticateSeller, authenticateUser } from "../middlewares/Authentication.js";


const router = express.Router();

// Create query for property
router.get('/property/create/:id', authenticateUser, createQueryForProperty);
router.get('/project/create/:id', authenticateUser, createQueryForProject);
router.get('/property/:id',  authenticateSeller,getPropertyQueries);
router.get('/project/:id', authenticateBuilder, getProjectQueries);
router.get('/seller', authenticateSeller, getSellerQueries)
router.get('/:id', authenticate, getQueryDetail);



export default router;
