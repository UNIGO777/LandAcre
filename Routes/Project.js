import express from 'express';
const router = express.Router();
import { createProject, deleteProjectbyBuilder, getProjects, getProjectsBySeller, getProjectsBySellerIdAdmin, getSingleProject, searchProjectsByLocation} from '../Controllers/Project.js';
import { authenticateAdmin, authenticateBuilder } from '../middlewares/Authentication.js';
import { upload } from '../Config/multer.js';
import { deletePropertyBySeller } from '../Controllers/Property.js';






// Create new project (Builder only)
router.post('/', authenticateBuilder, upload.fields([{ name: 'photos', maxCount: 10 }, { name: 'video', maxCount: 1 }]), createProject);

router.get('/searchByLocation', searchProjectsByLocation)



router.delete('/delete/:id', authenticateBuilder, deleteProjectbyBuilder)


router.get('/projectsbyseller', authenticateBuilder, getProjectsBySeller)


router.get('/getsellerprojectbyadmin/:id', authenticateAdmin, getProjectsBySellerIdAdmin)

router.get('/projectDetails/:id', getSingleProject);



router.get('/', getProjects);





// Get single project (Public)







export default router;




    
