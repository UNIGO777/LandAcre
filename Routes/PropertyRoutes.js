import express from "express";
import { approveProperty, createProperty, findPropertyById, searchProperties, updateProperty, updatePropertyStatus } from "../../LandAcers_backend_final/Controllers/Property.js";
import { upload } from "../Config/multer.js";
import { authenticateAdmin, authenticateAndChackSellerAcc } from "../middlewares/Authentication.js";


const router = express.Router();

router.post("/create", authenticateAndChackSellerAcc, upload.fields([{ name: "thumbnailImage", maxCount: 1 }, { name: "images", maxCount: 10 }]), createProperty);

router.put("/approve/:propertyId",authenticateAdmin, approveProperty);

router.put("/update/:propertyId", authenticateAndChackSellerAcc, upload.fields([{ name: "thumbnailImage", maxCount: 1 }, { name: "images", maxCount: 10 }]), updateProperty);



router.get("/search", searchProperties);

router.put("/update-status/:propertyId", authenticateAndChackSellerAcc, updatePropertyStatus);



router.get("/:id", findPropertyById);









export default router;
