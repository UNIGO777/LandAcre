import express from "express";
import { createProperty, updateProperty, getProperty, markPropertyAsSold, deletePropertyByAdmin, deletePropertyBySeller, searchProperties, getProperties, getSellerProperties, getPropertiesBySeller, getPropertiesBySellerIdAdmin, getSimilarProperties } from "../Controllers/Property.js";
import {  authenticateAdmin, authenticateSeller } from "../middlewares/Authentication.js";
import { upload } from "../Config/multer.js";
const router = express.Router();


router.get('/propertiesbyseller',  authenticateSeller, getPropertiesBySeller)
router.post("/create", authenticateSeller, upload.fields([{ name: 'photos', maxCount: 10 }, { name: 'video', maxCount: 1 }]), createProperty);
router.put("/update/:id", authenticateSeller, upload.fields([{ name: 'photos', maxCount: 10 }, { name: 'video', maxCount: 1 }]), updateProperty);
router.get('/seller/:sellerId', getSellerProperties)
router.get('/getsellerpropertiesbyadmin/:id', authenticateAdmin, getPropertiesBySellerIdAdmin)
router.get('/', getProperties)
router.get('/search', searchProperties);
router.get('/similar/:id', getSimilarProperties);
router.get('/:id', getProperty);
router.put('/:id/mark-sold', authenticateSeller, markPropertyAsSold);
router.delete('/:id', authenticateSeller, deletePropertyBySeller);











export default router;
