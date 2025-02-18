import express from 'express';
import { adminLogin, verifyAdminOtp } from '../Controllers/User.js'; // Import the user controller
import { aprooveProperty, deletePropertyByAdmin } from '../Controllers/Property.js';
import { authenticateAdmin } from '../middlewares/Authentication.js';
import { blockSeller } from '../Controllers/Seller.js';
import { aprooveProject, deleteProjectbyAdmin } from '../Controllers/Project.js';



const router = express.Router();


// Register a new user with OTP verification
router.post('/login',  adminLogin);
router.post('/verify',  verifyAdminOtp);


router.put('/block/seller/:id', authenticateAdmin, blockSeller);
router.put('/approve/property/:id', authenticateAdmin, aprooveProperty);
router.put('/approve/project/:id', authenticateAdmin, aprooveProject);
router.delete('/delete/project/:id', authenticateAdmin, deleteProjectbyAdmin);
router.delete('/delete/property/:id', authenticateAdmin, deletePropertyByAdmin);



// Verify OTP for registration



export default router; // Corrected to export the router instance properly