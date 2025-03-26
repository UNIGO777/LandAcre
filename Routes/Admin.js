import express from 'express';
import { adminLogin, blockUser, unblockUser, verifyAdminOtp } from '../Controllers/User.js'; // Import the user controller
import { aprooveProperty, deletePropertyByAdmin, searchProperties, searchPropertiesByAdmin } from '../Controllers/Property.js';
import { authenticateAdmin } from '../middlewares/Authentication.js';
import { blockSeller, getSellersByadmin, searchSellers, unblockSeller } from '../Controllers/Seller.js';
import { aprooveProject, deleteProjectbyAdmin, searchProjectsByAdmin } from '../Controllers/Project.js';
import { get } from 'mongoose';
import { getAdminAnalytics, getUsersbyadmin, searchUsers, verifyAdminToken } from '../Controllers/Admin.js';
import { createFeaturedItem, deleteFeaturedItem } from '../Controllers/FeaturedProperties.js';



const router = express.Router();


// Register a new user with OTP verification
router.post('/login',  adminLogin);
router.post('/verify',  verifyAdminOtp);
router.post('/verify-admin-token', authenticateAdmin, (req, res) => res.json({ success: true,  message: 'Admin token verified' }))



router.get('/get-users', authenticateAdmin, getUsersbyadmin);
router.put('/block/user/:userId',  authenticateAdmin, blockUser);
router.put('/unblock/user/:userId',  authenticateAdmin, unblockUser);
router.get('/search/users', authenticateAdmin, searchUsers);
router.get("/get-sellers-by-status", authenticateAdmin, getSellersByadmin)
router.get('/search/properties', authenticateAdmin, searchPropertiesByAdmin);
router.get('/search/projects', authenticateAdmin, searchProjectsByAdmin);
router.get('/search-sellers', authenticateAdmin, searchSellers);
router.get('/my-analytics', authenticateAdmin, getAdminAnalytics);
router.put('/block/seller/:id', authenticateAdmin, blockSeller);
router.put('/unblock/seller/:id', authenticateAdmin, unblockSeller);
router.post('/featured-item',authenticateAdmin,createFeaturedItem);
router.delete('/featured-item/:id', authenticateAdmin, deleteFeaturedItem);
router.put('/approve/property/:id', authenticateAdmin, aprooveProperty);
router.put('/project/:id', authenticateAdmin, aprooveProject);
router.delete('/project/:id', authenticateAdmin, deleteProjectbyAdmin);
router.delete('/property/:id', authenticateAdmin, deletePropertyByAdmin);



// Verify OTP for registration



export default router; // Corrected to export the router instance properly