import mongoose from 'mongoose';
import { Property, FlatApartment, HouseVilla, Location, StudioApartment, Amenities, RetailShop, office, Farmhouse, plot, land, Pricing, independentBuilderFloor, servicedApartment,  storage, industry, hospitality, othersProperties } from '../Models/Property.js';
import Seller from '../Models/Seller.js';
import sendEmail from '../Nodemailer/Controller/Controller.js';
import { userPropertyRequestTemplate, adminPropertyRequestNotificationTemplate } from '../Nodemailer/Tamplates/properties/propertyRequested.js'
import { adminPropertyDeletedNotificationTemplate, SellerPropertyDeletedTemplate } from '../Nodemailer/Tamplates/properties/propertyDeleted.js';
import User from '../Models/User.js';
import { propertyApprovalNotificationTemplate } from '../Nodemailer/Tamplates/properties/propertyApprovalNotificationTemplate.js';
import createNotification from '../Hof/makeNotifiction.js';
import { json } from 'express';
import { userPropertyUpdateTemplate, adminPropertyUpdateNotificationTemplate } from '../Nodemailer/Tamplates/properties/updatePropertyRequest.js';

// Middleware for creating property details
const createPropertyDetails = async (req, res, next) => {
    try {
        const { propertyType } = req.body;
        

        let propertyDetailSchema;
        switch (propertyType) {
            case 'FlatApartment':
                const flatApartmentDetails = { ...req.body };

                // Validation checks for required fields
                const requiredFields = ['floorNumber', 'totalFloors', 'bedrooms', 'bathrooms', 'carpetArea', 'areaUnitForCarpet', 'furnishing', 'reservedParking', 'availabilityStatus', 'propertyAge'];
                for (const field of requiredFields) {
                    if (!flatApartmentDetails[field]) {
                        return res.status(400).json({ error: `${field} is required for Flat/Apartment` });
                    }
                }

                propertyDetailSchema = new FlatApartment({
                    floorNumber: flatApartmentDetails.floorNumber,
                    totalFloors: flatApartmentDetails.totalFloors,
                    bedrooms: flatApartmentDetails.bedrooms,
                    bathrooms: flatApartmentDetails.bathrooms,
                    areaDetails: {
                        carpetArea: flatApartmentDetails.carpetArea,
                        builtUpArea: flatApartmentDetails.builtUpArea,
                        superBuiltUpArea: flatApartmentDetails.superBuiltUpArea,
                        areaUnitForCarpet: flatApartmentDetails.areaUnitForCarpet,
                        areaUnitForBuiltUp: flatApartmentDetails.areaUnitForBuiltUp,
                        areaUnitForSuperBuiltUp: flatApartmentDetails.areaUnitForSuperBuiltUp
                    },
                    balconies: flatApartmentDetails.balconies,
                    otherRooms: flatApartmentDetails.otherRooms,
                    furnishing: flatApartmentDetails.furnishing,
                    furnishingItems: flatApartmentDetails.furnishingItems,
                    reservedParking: flatApartmentDetails.reservedParking,
                    availabilityStatus: flatApartmentDetails.availabilityStatus,
                    propertyAge: flatApartmentDetails.propertyAge
                });

                break;
            case 'IndependentHouseVilla':
                const houseVillaDetails = { ...req.body };

                // Validation checks for required fields
                const houseVillaRequiredFields = ['bedrooms', 'bathrooms', 'plotArea', 'areaUnitForPlot', 'furnishing', 'totalFloors', 'availabilityStatus', 'propertyAge', 'reservedParking'];
                for (const field of houseVillaRequiredFields) {
                    if (!houseVillaDetails[field]) {
                        return res.status(400).json({ error: `${field} is required for Independent House/Villa` });
                    }
                }

                propertyDetailSchema = new HouseVilla({
                    bedrooms: houseVillaDetails.bedrooms,
                    bathrooms: houseVillaDetails.bathrooms,
                    balconies: houseVillaDetails.balconies,
                    areaDetails: {
                        plotArea: houseVillaDetails.plotArea,
                        carpetArea: houseVillaDetails.carpetArea,
                        builtUpArea: houseVillaDetails.builtUpArea,
                        areaUnitForPlot: houseVillaDetails.areaUnitForPlot,
                        areaUnitForCarpet: houseVillaDetails.areaUnitForCarpet,
                        areaUnitForBuiltUp: houseVillaDetails.areaUnitForBuiltUp
                    },
                    otherRooms: houseVillaDetails.otherRooms,
                    furnishing: houseVillaDetails.furnishing,
                    furnishingItems: houseVillaDetails.furnishingItems,
                    reservedParking: houseVillaDetails.reservedParking, // Fixed typo here
                    totalFloors: houseVillaDetails.totalFloors,
                    availabilityStatus: houseVillaDetails.availabilityStatus,
                    propertyAge: houseVillaDetails.propertyAge
                });
                break;
            case 'IndependentBuilderFloor':
                const builderFloorDetails = { ...req.body };

                // Validation checks for required fields
                const builderFloorRequiredFields = ['floorType', 'totalFloors', 'propertyOnFloor', 'bedrooms', 'bathrooms', 'carpetArea', 'areaUnitForCarpet', 'furnishing', 'availabilityStatus', 'reservedParking'];
                for (const field of builderFloorRequiredFields) {
                    if (!builderFloorDetails[field]) {
                        return res.status(400).json({ error: `${field} is required for Builder Floor` });
                    }
                }

                

                if(builderFloorDetails.reservedParking === undefined){
                    builderFloorDetails.reservedParking = 'none';
                }else{
                    if(builderFloorDetails.reservedParking.toLowerCase() === 'covered'){
                        builderFloorDetails.reservedParking = 'Covered';
                    }else if(builderFloorDetails.reservedParking.toLowerCase() === 'open'){
                        builderFloorDetails.reservedParking = 'Open';
                    }else{
                        builderFloorDetails.reservedParking = 'none';
                    }
                }

                propertyDetailSchema = new independentBuilderFloor({
                    floorType: builderFloorDetails.floorType,
                    totalFloors: builderFloorDetails.totalFloors,
                    propertyOnFloor: builderFloorDetails.propertyOnFloor,
                    bedrooms: builderFloorDetails.bedrooms,
                    bathrooms: builderFloorDetails.bathrooms,
                    balconies: builderFloorDetails.balconies,
                    areaDetails: {
                        carpetArea: builderFloorDetails.carpetArea,
                        builtUpArea: builderFloorDetails.builtUpArea,
                        superBuiltUpArea: builderFloorDetails.superBuiltUpArea,
                        areaUnitForCarpet: builderFloorDetails.areaUnitForCarpet,
                        areaUnitForBuiltUp: builderFloorDetails.areaUnitForBuiltUp,
                        areaUnitForSuperBuiltUp: builderFloorDetails.areaUnitForSuperBuiltUp
                    },
                    otherRooms: builderFloorDetails.otherRooms,
                    furnishing: builderFloorDetails.furnishing,
                    furnishingItems: builderFloorDetails.furnishingItems,
                    reservedParking: builderFloorDetails.reservedParking,
                    availabilityStatus: builderFloorDetails.availabilityStatus
                });
                break;
            case 'Land':
                const landDetails = { ...req.body };
                const landRequiredFields = ['plotArea', 'areaUnitForPlot', 'boundaryWall', 'openSides', 'constructionDone', 'possessionDate'];
                for (const field of landRequiredFields) {
                    if (!landDetails[field]) {
                        return res.status(400).json({ error: `${field} is required for Land` });
                    }
                }
                if (req.body.isCommercial && !landDetails.commercialType) {
                    return res.status(400).json({ error: 'commercialType is required for Commercial Land' });

                }

                const parsedPossessionDate = new Date(JSON.parse(landDetails.possessionDate));
                propertyDetailSchema = new land({
                    landType: req.body.isCommercial ? 'Commercial' : 'Residential',
                    commercialType: landDetails.commercialType,
                    areaDetails: {
                        plotArea: landDetails.plotArea,
                        areaUnitForPlot: landDetails.areaUnitForPlot
                    },
                    lengthOfPlot: landDetails.lengthOfPlot,
                    breadthOfPlot: landDetails.breadthOfPlot,
                    floorsAllowed: landDetails.floorsAllowed,
                    boundaryWall: landDetails.boundaryWall,
                    openSides: landDetails.openSides,
                    constructionDone: landDetails.constructionDone,
                    possessionDate: parsedPossessionDate
                });
                break;

            case 'Plot':
                const plotDetails = { ...req.body };
                const plotRequiredFields = [ 'plotArea', 'areaUnitForPlot', 'boundaryWall', 'openSides', 'constructionDone', 'possessionDate'];
                
                if (plotDetails.isCommercial && !plotDetails.commercialType) {
                    return res.status(400).json({ error: 'commercialType is required for Commercial Plot' });
                }
                // Parse the possessionDate string properly by removing extra quotes
                // Parse the possession date string directly without JSON.parse
                const updatedparsedPossessionDate = new Date(plotDetails.possessionDate);

                propertyDetailSchema = new plot({
                    plotType: plotDetails.isCommercial ? 'Commercial' : 'Residential',
                    commercialType: plotDetails.commercialType,
                    areaDetails: {
                        plotArea: plotDetails.plotArea,
                        areaUnitForPlot: plotDetails.areaUnitForPlot
                    },
                    lengthOfPlot: plotDetails.lengthOfPlot,
                    breadthOfPlot: plotDetails.breadthOfPlot,
                    floorsAllowed: plotDetails.floorsAllowed,
                    boundaryWall: plotDetails.boundaryWall,
                    openSides: plotDetails.openSides,
                    constructionDone: plotDetails.constructionDone,
                    possessionDate: updatedparsedPossessionDate
                });
                break;
            case 'RKStudioApartment':
                const studioApartmentDetails = { ...req.body };
                const studioApartmentRequiredFields = ['bedrooms', 'bathrooms', 'carpetArea', 'areaUnitForCarpet', 'furnishing', 'availabilityStatus'];
                for (const field of studioApartmentRequiredFields) {
                    if (!studioApartmentDetails[field]) {
                        return res.status(400).json({ error: `${field} is required for 1 RK/Studio Apartment` });
                    }
                }
                propertyDetailSchema = new StudioApartment({
                    bedrooms: studioApartmentDetails.bedrooms,
                    bathrooms: studioApartmentDetails.bathrooms,
                    balconies: studioApartmentDetails.balconies,
                    areaDetails: {
                        carpetArea: studioApartmentDetails.carpetArea,
                        builtUpArea: studioApartmentDetails.builtUpArea,
                        superBuiltUpArea: studioApartmentDetails.superBuiltUpArea,
                        areaUnitForCarpet: studioApartmentDetails.areaUnitForCarpet,
                        areaUnitForBuiltUp: studioApartmentDetails.areaUnitForBuiltUp,
                        areaUnitForSuperBuiltUp: studioApartmentDetails.areaUnitForSuperBuiltUp
                    },
                    furnishing: studioApartmentDetails.furnishing,
                    furnishingItems: studioApartmentDetails.furnishingItems,
                    reservedParking: studioApartmentDetails.reservedParking,
                    availabilityStatus: studioApartmentDetails.availabilityStatus,
                    floorNumber: studioApartmentDetails.floorNumber,
                    totalFloors: studioApartmentDetails.totalFloors,
                    propertyAge: studioApartmentDetails.propertyAge
                });
                break;
            case 'ServicedApartment':
                const servicedApartmentDetails = { ...req.body };
                const servicedApartmentRequiredFields = ['bedrooms', 'bathrooms', 'carpetArea', 'areaUnitForCarpet', 'furnishing', 'availabilityStatus', 'reservedParking', 'propertyAge', 'totalFloors', 'floorNumber'];
                for (const field of servicedApartmentRequiredFields) {
                    if (!servicedApartmentDetails[field]) {
                        return res.status(400).json({ error: `${field} is required for Serviced Apartment` });
                    }
                }
                propertyDetailSchema = new servicedApartment({
                    bedrooms: servicedApartmentDetails.bedrooms,
                    bathrooms: servicedApartmentDetails.bathrooms,
                    balconies: servicedApartmentDetails.balconies,
                    areaDetails: {
                        carpetArea: servicedApartmentDetails.carpetArea,
                        builtUpArea: servicedApartmentDetails.builtUpArea,
                        superBuiltUpArea: servicedApartmentDetails.superBuiltUpArea,
                        areaUnitForCarpet: servicedApartmentDetails.areaUnitForCarpet,
                        areaUnitForBuiltUp: servicedApartmentDetails.areaUnitForBuiltUp,
                        areaUnitForSuperBuiltUp: servicedApartmentDetails.areaUnitForSuperBuiltUp
                    },
                    otherRooms: servicedApartmentDetails.otherRooms,
                    furnishing: servicedApartmentDetails.furnishing,
                    furnishingItems: servicedApartmentDetails.furnishingItems,
                    reservedParking: servicedApartmentDetails.reservedParking,
                    availabilityStatus: servicedApartmentDetails.availabilityStatus,
                    floorNumber: servicedApartmentDetails.floorNumber,
                    totalFloors: servicedApartmentDetails.totalFloors,
                    propertyAge: servicedApartmentDetails.propertyAge
                });
                break;
            case 'Farmhouse':
                const farmhouseDetails = { ...req.body };
                const farmhouseRequiredFields = ['bedrooms', 'bathrooms', 'carpetArea', 'plotArea', 'areaUnitForCarpet', 'areaUnitForPlot', 'furnishing', 'reservedParking', 'availabilityStatus', 'floorNumber', 'totalFloors', 'propertyAge'];
                for (const field of farmhouseRequiredFields) {
                    if (!farmhouseDetails[field]) {
                        return res.status(400).json({ error: `${field} is required for Farmhouse` });
                    }
                }
                propertyDetailSchema = new Farmhouse({
                    bedrooms: farmhouseDetails.bedrooms,
                    bathrooms: farmhouseDetails.bathrooms,
                    balconies: farmhouseDetails.balconies || 0,
                    areaDetails: {
                        carpetArea: farmhouseDetails.carpetArea,
                        plotArea: farmhouseDetails.plotArea,
                        builtUpArea: farmhouseDetails.builtUpArea,
                        areaUnitForCarpet: farmhouseDetails.areaUnitForCarpet,
                        areaUnitForPlot: farmhouseDetails.areaUnitForPlot,
                        areaUnitForBuiltUp: farmhouseDetails.areaUnitForBuiltUp
                    },
                    otherRooms: farmhouseDetails.otherRooms,
                    furnishing: farmhouseDetails.furnishing,
                    furnishingItems: farmhouseDetails.furnishingItems,
                    reservedParking: farmhouseDetails.reservedParking,
                    availabilityStatus: farmhouseDetails.availabilityStatus,
                    floorNumber: farmhouseDetails.floorNumber,
                    totalFloors: farmhouseDetails.totalFloors,
                    propertyAge: farmhouseDetails.propertyAge || 0
                });
                break;
            case 'Office':
                const officeDetails = { ...req.body };
                const officeRequiredFields = ['WhatKindOfOfficeIsit', 'carpetArea', 'areaUnitForCarpet', 'availabilityStatus', 'totalFloors'];
                
                propertyDetailSchema = new office({
                    WhatKindOfOfficeIsit: officeDetails.WhatKindOfOfficeIsit,
                    areaDetails: {
                        carpetArea: officeDetails.carpetArea,
                        superBuiltUpArea: officeDetails.superBuiltUpArea,
                        areaUnitForCarpet: officeDetails.areaUnitForCarpet,
                        areaUnitForSuperBuiltUp: officeDetails.areaUnitForSuperBuiltUp
                    },
                    constructionStatus: officeDetails.constructionStatus,
                    doorsConstructed: officeDetails.doorsConstructed,
                    minSeats: officeDetails.minSeats,
                    maxSeats: officeDetails.maxSeats,
                    cabins: officeDetails.cabins,
                    meetingRooms: officeDetails.meetingRooms,
                    washrooms: officeDetails.washrooms,
                    conferenceRoom: officeDetails.conferenceRoom,
                    receptionArea: officeDetails.receptionArea,
                    pantryType: officeDetails.pantryType,
                    fireSafetyMeasures: officeDetails.fireSafetyMeasures,
                    totalFloors: officeDetails.totalFloors,
                    occupiedFloors: officeDetails.occupiedFloors,
                    staircases: officeDetails.staircases,
                    lifts: officeDetails.lifts,
                    parking: officeDetails.parking,
                    availabilityStatus: officeDetails.availabilityStatus,
                    facilities: officeDetails.facilities
                });
                break;
            case 'Retail':
                const retailDetails = { ...req.body };
                const retailRequiredFields = ['retailType', 'locationType', 'plotArea', 'areaUnitForPlot', 'availabilityStatus', 'totalFloors', 'propertyOnFloor'];
                for (const field of retailRequiredFields) {
                    if (!retailDetails[field]) {
                        return res.status(400).json({ error: `${field} is required for Retail` });
                    }
                }
                propertyDetailSchema = new RetailShop({
                    retailType: retailDetails.retailType,
                    locationType: retailDetails.locationType,
                    areaDetails: {
                        carpetArea: retailDetails.carpetArea,
                        plotArea: retailDetails.plotArea,
                        builtUpArea: retailDetails.builtUpArea,
                        areaUnitForCarpet: retailDetails.areaUnitForCarpet,
                        areaUnitForPlot: retailDetails.areaUnitForPlot,
                        areaUnitForBuiltUp: retailDetails.areaUnitForBuiltUp
                    },
                    entranceWidth: retailDetails.entranceWidth,
                    ceilingHeight: retailDetails.ceilingHeight,
                    totalFloors: retailDetails.totalFloors,
                    propertyOnFloor: retailDetails.propertyOnFloor,
                    washrooms: retailDetails.washrooms,
                    parkingType: retailDetails.parkingType,
                    availabilityStatus: retailDetails.availabilityStatus,
                    suitableForBusinessTypes: retailDetails.suitableForBusinessTypes
                });
                break;
            case 'Storage':
                const storageDetails = { ...req.body };
                const storageRequiredFields = ['StorageType', 'plotArea', 'areaUnitForPlot', 'availabilityStatus'];
                for (const field of storageRequiredFields) {
                    if (!storageDetails[field]) {
                        return res.status(400).json({ error: `${field} is required for Storage` });
                    }
                }
                propertyDetailSchema = new storage({
                    StorageType: storageDetails.StorageType,
                    areaDetails: {
                        carpetArea: storageDetails.carpetArea,
                        plotArea: storageDetails.plotArea,
                        builtUpArea: storageDetails.builtUpArea,
                        areaUnitForCarpet: storageDetails.areaUnitForCarpet,
                        areaUnitForPlot: storageDetails.areaUnitForPlot,
                        areaUnitForBuiltUp: storageDetails.areaUnitForBuiltUp
                    },
                    washrooms: storageDetails.washrooms,
                    availabilityStatus: storageDetails.availabilityStatus
                });
                break;
            case 'Industry':
                const industryDetails = { ...req.body };
                const industryRequiredFields = ['IndustryType', 'plotArea', 'areaUnitForPlot', 'availabilityStatus'];
                for (const field of industryRequiredFields) {
                    if (!industryDetails[field]) {
                        return res.status(400).json({ error: `${field} is required for Industry` });
                    }
                }
                propertyDetailSchema = new industry({
                    IndustryType: industryDetails.IndustryType,
                    areaDetails: {
                        carpetArea: industryDetails.carpetArea,
                        plotArea: industryDetails.plotArea,
                        builtUpArea: industryDetails.builtUpArea,
                        areaUnitForCarpet: industryDetails.areaUnitForCarpet,
                        areaUnitForPlot: industryDetails.areaUnitForPlot,
                        areaUnitForBuiltUp: industryDetails.areaUnitForBuiltUp
                    },
                    washrooms: industryDetails.washrooms,
                    availabilityStatus: industryDetails.availabilityStatus
                });
                break;
            case 'Hospitality':
                const hospitalityDetails = { ...req.body };
                const hospitalityRequiredFields = ['HospitalityType', 'totalRooms', 'washrooms', 'balconies', 'plotArea', 'areaUnitForPlot', 'furnishing', 'availabilityStatus'];
                for (const field of hospitalityRequiredFields) {
                    if (!hospitalityDetails[field]) {
                        return res.status(400).json({ error: `${field} is required for Hospitality` });
                    }
                }
                propertyDetailSchema = new hospitality({
                    HospitalityType: hospitalityDetails.HospitalityType,
                    totalRooms: hospitalityDetails.totalRooms,
                    washrooms: hospitalityDetails.washrooms,
                    balconies: hospitalityDetails.balconies,
                    areaDetails: {
                        carpetArea: hospitalityDetails.carpetArea,
                        plotArea: hospitalityDetails.plotArea,
                        builtUpArea: hospitalityDetails.builtUpArea,
                        areaUnitForCarpet: hospitalityDetails.areaUnitForCarpet,
                        areaUnitForPlot: hospitalityDetails.areaUnitForPlot,
                        areaUnitForBuiltUp: hospitalityDetails.areaUnitForBuiltUp
                    },
                    otherRooms: hospitalityDetails.otherRooms,
                    furnishing: hospitalityDetails.furnishing,
                    furnishingItems: hospitalityDetails.furnishingItems,
                    availabilityStatus: hospitalityDetails.availabilityStatus,
                    qualityRating: hospitalityDetails.qualityRating
                });
                break;
            default:
                const otherPropertyDetails = { ...req.body };
                const otherPropertyRequiredFields = ['plotArea', 'areaUnitForPlot', 'availabilityStatus'];
                for (const field of otherPropertyRequiredFields) {
                    if (!otherPropertyDetails[field]) {
                        return res.status(400).json({ error: `${field} is required for Other Properties` });
                    }
                }
                propertyDetailSchema = new othersProperties({
                    areaDetails: {
                        plotArea: otherPropertyDetails.plotArea,
                        areaUnitForPlot: otherPropertyDetails.areaUnitForPlot
                    },
                    otherRooms: otherPropertyDetails.otherRooms,
                    totalFloors: otherPropertyDetails.totalFloors,
                    propertyOnFloor: otherPropertyDetails.propertyOnFloor,
                    availabilityStatus: otherPropertyDetails.availabilityStatus
                });
                break;
        }

        await propertyDetailSchema.save();
        req.body.propertyDetailSchemaId = {
            refId: propertyDetailSchema._id,
            refType: (() => {
                switch (propertyType) {
                    case 'FlatApartment':
                        return 'FlatApartment';
                    case 'IndependentHouseVilla':
                        return 'IndependentHouseVilla';
                    case 'IndependentBuilderFloor':
                        return 'IndependentBuilderFloor';
                    case 'Land':
                        return 'Land';
                    case 'Plot':
                        return 'Plot';
                    case 'RKStudioApartment':
                        return 'StudioApartment';
                    case 'ServicedApartment':
                        return 'ServicedApartment';
                    case 'Farmhouse':
                        return 'Farmhouse';
                    case 'Office':
                        return 'Office';
                    case 'Retail':
                        return 'RetailShop';
                    case 'Storage':
                        return 'Storage';
                    case 'Industry':
                        return 'Industry';
                    case 'Hospitality':
                        return 'Hospitality';
                    case 'others':
                        return 'OthersProperties';
                }
            })()
        };
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });

    }
};

// Middleware for creating location details
const createLocationDetails = async (req, res, next) => {
    try {
        const { city, locality } = req.body;

        // Validation checks for required fields
        if (!city || !locality) {
            return res.status(400).json({ error: 'City and Locality are required for Location' });
        }

        const locationDetails = new Location({
            state: req.body.state,
            city: req.body.city,
            locality: req.body.locality,
            subLocality: req.body.subLocality,
            apartmentSociety: req.body.apartmentSociety,
            houseNo: req.body.houseNo
        });
        await locationDetails.save();
        console.log(locationDetails)
        req.body.locationSchemaId = locationDetails;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Middleware for creating pricing details
const createPricingDetails = async (req, res, next) => {
    try {
        const { transactionType, rent, salePrice, pgPrice, securityDeposit } = req.body;
        // Validation checks for required fields

        if (!transactionType) {
            return res.status(400).json({ error: 'Transaction Type is required' });
        }

        if (transactionType === 'Rent' && (!rent || !securityDeposit)) {
            return res.status(400).json({ error: 'Rent and Security Deposit are required for Pricing Type Rent' });
        }

        if (transactionType === 'Sell' && !salePrice) {
            return res.status(400).json({ error: 'Sale Price required for Pricing Type Sell' });
        }

        if (transactionType === 'PG' && !pgPrice) {
            return res.status(400).json({ error: 'PG Price is required for Pricing Type PG' });
        }

        const pricingDetails = new Pricing({
            type: transactionType,
            rent: rent,
            securityDeposit: securityDeposit,
            salePrice: salePrice,
            pgPrice: pgPrice,
            foodIncluded: req.body.foodIncluded || false
        });

        await pricingDetails.save();
        req.body.pricingDetails = pricingDetails;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Middleware for creating amenities details
const createAmenitiesDetails = async (req, res, next) => {
    try {
        const amenitiesDetails = new Amenities(JSON.parse(req.body.amenities));
        await amenitiesDetails.save();
        req.body.amenitiesSchemaId = {
            refId: amenitiesDetails._id,
        };
        
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Property Controllers
// Start of Selection
const createProperty = async (req, res) => {
    try {
        const { propertyType } = req.body;
        console.log(req.body)

        const validPropertyTypes = [
            'FlatApartment', 'IndependentHouseVilla', 'IndependentBuilderFloor', 'Plot', 'Land',
            'RKStudioApartment', 'ServicedApartment', 'Farmhouse', 'Office', 'Retail',  'Storage', 'Industry', 'Hospitality', 'others'
        ];

        if (!validPropertyTypes.includes(propertyType)) {
            return res.status(400).json({ error: 'Invalid property type' });
        }

        await createLocationDetails(req, res, async () => {
            await createAmenitiesDetails(req, res, async () => {
                await createPricingDetails(req, res, async () => {
                    await createPropertyDetails(req, res, async () => {
                        console.log(req.body,"kasjdhf")
                        const {
                            transactionType, propertyTitle, description, locationSchemaId,
                            propertyDetailSchemaId, amenitiesSchemaId, pricingDetails,
                            availableFrom, facingDirection, availableDate,
                            willingToRentOut, availableFor, suitableFor,
                        } = req.body;

                        // console.log(
                        //     transactionType, "transaction---", propertyTitle, "property----",
                        //     description, "description----", locationSchemaId, "location----",
                        //     propertyDetailSchemaId, "propertyy---", amenitiesSchemaId, "amenitiesScema----",  availableFrom, "availableFrom----", facingDirection, "facingDirection----",
                        // );

                        // Validation checks for required fields
                        const requiredFields = [
                            propertyType, transactionType, propertyTitle, description,
                            locationSchemaId, propertyDetailSchemaId,
                            amenitiesSchemaId, pricingDetails, availableFrom,
                            facingDirection
                        ];

                        if (requiredFields.some(field => !field)) {
                            return res.status(400).json({ error: 'All required fields must be provided' });
                        }

                        if (transactionType === 'Rent' && !willingToRentOut) {
                            return res.status(400).json({ error: 'Willing to Rent Out is required for Rent transaction type' });
                        }

                        if (transactionType === 'PG' && (!availableFor || !suitableFor)) {
                            return res.status(400).json({ error: 'Available For and Suitable For are required for PG transaction type' });
                        }


                        console.log(req.files,"req.files")
                        
                        


                        // Parse the date string properly by removing extra quotes
                        const availableFromDate = new Date(JSON.parse(req.body.availableFrom));

                        const property = new Property({
                            propertyType,
                            transactionType: req.body.transactionType,
                            propertyTitle: req.body.propertyTitle,
                            description: req.body.description,
                            locationSchemaId: req.body.locationSchemaId,
                            propertyDetailSchemaId: req.body.propertyDetailSchemaId,
                            amenitiesSchemaId: req.body.amenitiesSchemaId,
                            pricingDetails: req.body.pricingDetails,
                            sellerId: req.user._id,
                            availableFrom: availableFromDate,
                            facingDirection: req.body.facingDirection,
                            propertyMedia: {
                                photos: req.files.photos ? req.files.photos.map(file => file.path.split('/').pop()) : [],
                                video: req.files.video ? req.files.video[0].path.split('/').pop() : ''
                            },
                            willingToRentOut: req.body.willingToRentOut,
                            availableFor: req.body.availableFor,
                            suitableFor: req.body.suitableFor,
                            isCommercial: req.body.isCommercial,
                        });
                        await property.save();

                        const seller = await Seller.findById(req.user._id);

                        seller.sellingProperties.push(property._id);
                        await seller.save();

                        const Admin = await User.findOne({ role: 'admin' });

                        // Create notification for seller
                        await createNotification({
                            userType: 'Seller',
                            userId: req.user._id,
                            message: `Your property ${property.propertyTitle} (${property._id}) has been submitted for admin approval`
                        });

                        // Create notification for admin
                        await createNotification({
                            userId: Admin._id,
                            userType: 'User',
                            message: `New property submission from ${seller.sellerDetails.name} - ${property.propertyTitle} (${property._id}) requires approval`
                        });

                        await sendEmail(
                            seller.sellerDetails.email,
                            "Property request received",
                            () => userPropertyRequestTemplate(seller.sellerDetails.name, {
                                title: property.propertyTitle,
                                type: property.propertyType,
                                transactionType: property.transactionType,
                                _id: property._id
                            })
                        );

                        await sendEmail(
                            process.env.ADMIN_EMAIL,
                            "New property request received",
                            () => adminPropertyRequestNotificationTemplate({
                                title: property.propertyTitle,
                                type: property.propertyType,
                                transactionType: property.transactionType,
                                _id: property._id
                            })
                        );

                        res.status(201).json(property);
                    });
                });
            });
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const markPropertyAsSold = async (req, res) => {
    try {

        const existingProperty = await Property.findOne({
            _id: req.params.id,
            status: { $in: ['active', 'requested'] }
        });

        if (!existingProperty) {
            return res.status(404).json({ error: 'Property not found or the property is blocked so it can not mark as sold' });
        }

        if (existingProperty.sellerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized to mark this property as sold' });
        }

        await createNotification({
            userType: 'Seller',
            userId: existingProperty.sellerId,
            message: `Your property ${existingProperty.propertyTitle} (${existingProperty._id}) has been marked as sold`
        });

        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { $set: { status: 'sold' } },
            { new: true, runValidators: true }
        );

        if (!property) {
            return res.status(404).json({ error: 'Property not found or the property is blocked so it can not mark as sold' });
        }



        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const getProperty = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid property ID' });
        }

        // Fetch property with standard population
        let property = await Property.findById(id)
            .select('-__v -createdAt -updatedAt')
            .populate('locationSchemaId', '-_id -createdAt -updatedAt')
            .populate('pricingDetails', '-_id -createdAt -updatedAt')
            .populate({
                path: 'sellerId',
                select: 'sellerDetails.profilePicture sellerDetails.name sellerType'
            })
            .lean();

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Dynamically populate propertyDetailSchemaId
        if (property.propertyDetailSchemaId && property.propertyDetailSchemaId.refType) {
            try {
                const modelName = property.propertyDetailSchemaId.refType;
                if (mongoose.models[modelName]) {
                    const DynamicModel = mongoose.model(modelName);
                    const details = await DynamicModel.findById(property.propertyDetailSchemaId.refId)
                        .select('-_id -createdAt -updatedAt')
                        .lean();
                    
                    if (details) {
                        property.propertyDetailSchemaId.refId = details;
                    }
                }
            } catch (err) {
                console.error(`Error populating property details: ${err.message}`);
            }
        }

        // Populate amenities if they exist
        if (property.amenitiesSchemaId && property.amenitiesSchemaId.refId) {
            try {
                const amenities = await Amenities.findById(property.amenitiesSchemaId.refId)
                    .select('-_id -createdAt -updatedAt')
                    .lean();
                
                if (amenities) {
                    property.amenitiesSchemaId.refId = amenities;
                }
            } catch (err) {
                console.error(`Error populating amenities: ${err.message}`);
            }
        }

        res.status(200).json(property);
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
};




const deletePropertyBySeller = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        const seller = await Seller.findById(property.sellerId);
        if (!seller) {
            return res.status(404).json({ error: 'Seller not found' });
        }



        // Verify seller ownership

        if (req.user._id.toString() !== property.sellerId.toString()) {
            return res.status(403).json({ error: 'Unauthorized to delete this property' });
        }



        if (property.status === 'blocked') {
            return res.status(400).json({ error: 'property is alrady deleted' });
        }

        // Update status to blocked
        await Property.findByIdAndUpdate(
            req.params.id,
            { $set: { status: 'blocked' } }
        );

        // Remove property from seller's sellingProperties array
        await Seller.findByIdAndUpdate(
            property.sellerId,
            { $pull: { sellingProperties: property._id } }
        );


        await createNotification({
            userType: 'Seller',
            userId: property.sellerId,
            message: `Your property ${property.propertyTitle} (${property._id}) has been successfully deleted by you`
        });



        // Notify seller via email

        await sendEmail(
            req.userDetails.sellerDetails.email,
            "Property Deletion Confirmation",
            () => SellerPropertyDeletedTemplate(req.userDetails.sellerDetails.name, {
                title: property.propertyTitle, _id: property._id
            })
        );

        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const deletePropertyByAdmin = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }



        // Verify admin privileges
        const Admin = await User.findById(req.user._id)



        if (Admin.role !== 'admin') {
            return res.status(400).json({ error: 'You are not a admin' });
        }

        if (property.status === 'blocked') {
            return res.status(400).json({ error: 'property is alrady deleted' });
        }

        // Update status to blocked
        await Property.findByIdAndUpdate(
            req.params.id,
            { $set: { status: 'blocked' } }
        );

        // Notify both admin and seller
        const seller = await Seller.findById(property.sellerId);
        if (!seller) {
            return res.status(404).json({ error: 'Seller not found' });
        }

        await Seller.findByIdAndUpdate(
            property.sellerId,
            { $pull: { sellingProperties: property._id } }
        );

        // Create notification for admin

        // Create notification for seller
        await createNotification({
            userType: 'Seller',
            userId: seller._id,
            message: `Your property ${property.propertyTitle} (${property._id}) has been blocked by admin`
        });

        // Notify seller
        await sendEmail(
            seller.sellerDetails.email,
            "Property Blocked by Admin",
            () => adminPropertyDeletedNotificationTemplate(seller.sellerDetails.name, {
                title: property.propertyTitle,
                _id: property._id
            })
        );

        res.status(200).json({ message: 'Property blocked successfully and notifications sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




const searchProperties = async (req, res) => {
    try {
        let { propertyType, transactionType, minPrice, maxPrice, locality, city, page = 1, state, searchQuery, isCommercial, commercialLandType, commercialPlotType } = req.query;
        
        // Set default values and normalize inputs
        if(searchQuery == null){
            searchQuery = '';
        }

        if(transactionType == "Buy"){
            transactionType = "Sell"
        }

        // Initialize commercial property variables at function scope
        let isCommercialProperty = false;
        

        // Natural language query processing
        if (searchQuery) {
            searchQuery = searchQuery.toLowerCase();
            
            // Extract property type
            const propertyTypeMap = {
                'flat': 'FlatApartment',
                'flats': 'FlatApartment', 
                'apartment': 'FlatApartment',
                'apartments': 'FlatApartment',
                'independent house': 'IndependentHouseVilla',
                'villa': 'IndependentHouseVilla',
                'villas': 'IndependentHouseVilla',
                'plot': 'Plot',
                'plots': 'Plot',
                'land': 'Land',
                'agricultural land': 'Land',
                'commercial land': 'Land',
                'farm land': 'Land',
                'agricultural farm land': 'Land',
                'industrial land': 'Land',
                'office': 'Office',
                'office space': 'Office', 
                'shop': 'Retail',
                'shops': 'Retail',
                'warehouse': 'Storage',
                'pg': 'RKStudioApartment'
            };
            
            // Check for commercial land types
            if (searchQuery.includes('commercial land')) {
                isCommercialProperty = true;
                commercialLandType = 'Commercial Land';
                propertyType = 'Land';
            } else if (searchQuery.includes('agricultural farm land') || 
                       searchQuery.includes('agricultural land') || 
                       searchQuery.includes('farm land')) {
                isCommercialProperty = true;
                commercialLandType = 'Agricultural / Farm Land';
                propertyType = 'Land';
            } else if (searchQuery.includes('industrial land')) {
                isCommercialProperty = true;
                commercialLandType = 'Industrial Land';
                propertyType = 'Land';
            } else if (searchQuery.includes('industrial plot')) {
                isCommercialProperty = true;
                commercialLandType = 'Industrial Plot';
                propertyType = 'Plot';
            } else if (searchQuery.includes('commercial plot')) {
                isCommercialProperty = true;
                commercialLandType = 'Commercial Plot';
                propertyType = 'Plot';
            }
            
            // Direct search for commercial types
            if (searchQuery === 'agricultural / farm land' || searchQuery === 'agricultural farm land') {
                isCommercialProperty = true;
                commercialLandType = 'Agricultural / Farm Land';
                propertyType = 'Land';
            } else if (searchQuery === 'industrial land') {
                isCommercialProperty = true;
                commercialLandType = 'Industrial Land';
                propertyType = 'Land';
            } else if (searchQuery === 'commercial land') {
                isCommercialProperty = true;
                commercialLandType = 'Commercial Land';
                propertyType = 'Land';
            } else if (searchQuery === 'industrial plot') {
                isCommercialProperty = true;
                commercialLandType = 'Industrial Plot';
                propertyType = 'Plot';
            } else if (searchQuery === 'commercial plot') {
                isCommercialProperty = true;
                commercialLandType = 'Commercial Plot';
                propertyType = 'Plot';
            }

            // Extract transaction type
            const transactionTypeMap = {
                'rent': 'Rent',
                'for rent': 'Rent',
                'sale': 'Sell',
                'for sale': 'Sell',
                'resale': 'Sell',
                'buy': 'Sell',
                'pg': 'PG'
            };

            // Extract city/location
            const words = searchQuery.split(' ');
            for (const word of words) {
                if (word === 'in' || word === 'at') {
                    const locationIndex = words.indexOf(word);
                    if (locationIndex < words.length - 1) {
                        city = words[locationIndex + 1];
                        city = city.charAt(0).toUpperCase() + city.slice(1);
                    }
                }
            }

            // Extract property type from query
            for (const [key, value] of Object.entries(propertyTypeMap)) {
                if (searchQuery.includes(key)) {
                    propertyType = value;
                    break;
                }
            }

            // Extract transaction type from query
            for (const [key, value] of Object.entries(transactionTypeMap)) {
                if (searchQuery.includes(key)) {
                    transactionType = value;
                    break;
                }
            }

            // Extract BHK configuration
            const bhkMatch = searchQuery.match(/(\d+)\s*bhk/);
            if (bhkMatch) {
                searchQuery += ` ${bhkMatch[1]} bedroom`;
            }

            // Extract property status
            if (searchQuery.includes('ready to move') || searchQuery.includes('ready-to-move')) {
                searchQuery += ' ready for possession';
            }
            if (searchQuery.includes('under construction') || searchQuery.includes('under-construction')) {
                searchQuery += ' under construction';
            }

            // Extract price range indicators
            if (searchQuery.includes('affordable') || searchQuery.includes('budget')) {
                maxPrice = '5000000'; // 50 lakhs threshold
            }
            if (searchQuery.includes('luxury')) {
                minPrice = '10000000'; // 1 crore threshold
            }
        }

        if (propertyType == 'Flat-Apartment') {
            propertyType = 'Flat/Apartment'
        }
        if (transactionType == 'Buy') {
            transactionType = 'Sell'
        }

        // Build the query object
        let queryObj = { status: 'active' };
        
        if (propertyType) {
            queryObj.propertyType = propertyType;
        }
        
        if (transactionType) {
            queryObj.transactionType = transactionType;
        }

        if(isCommercial != 'undefined'){
            queryObj.isCommercial = isCommercial;
        }
        
        // Handle commercial land types
        if (isCommercialProperty || commercialLandType || commercialPlotType) {
            queryObj.isCommercial = true;
            
            // Store commercialLandType to use when populating property details
            req.commercialLandType = commercialLandType;
            req.commercialPlotType = commercialPlotType;
        }
        
        // If propertyType is directly specified as a commercial type, handle it
        if (propertyType === 'Agricultural / Farm Land' || 
            propertyType === 'Industrial Land' || 
            propertyType === 'Commercial Land') {
            // Set the actual property type to Land
            queryObj.propertyType = 'Land';
            queryObj.isCommercial = true;
            req.commercialLandType = propertyType;
        } else if (propertyType === 'Industrial Plot' || propertyType === 'Commercial Plot') {
            // Set the actual property type to Plot
            queryObj.propertyType = 'Plot';
            queryObj.isCommercial = true;
            req.commercialPlotType = propertyType;
        }
        
        // Get active properties with populated fields
        let properties = await Property.find(queryObj)
            .populate([
                { path: 'locationSchemaId', select: '-_id -createdAt -updatedAt' },
                { path: 'pricingDetails', select: '-_id -createdAt -updatedAt' }
            ])
            .sort({ createdAt: -1 })
            .select('-__v -sellerId -status -createdAt -updatedAt')
            .lean();

        // Helper function for Levenshtein Distance calculation
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

        // Calculate relevance scores and filter properties
        properties = properties.map(property => {
            const matchesPropertyType = !propertyType || property.propertyType === propertyType;
            const matchesTransactionType = !transactionType || property.transactionType === transactionType;
            
            // Price matching
            const matchesPrice = (() => {
                if (!minPrice && !maxPrice) return true;
                const priceField = {
                    'Rent': 'rent',
                    'Sell': 'salePrice',
                    'PG': 'pgPrice'
                }[transactionType] || 'rent';

                // Check if pricingDetails exists and has the relevant price field
                if (!property.pricingDetails) return false;
                
                const price = property.pricingDetails[priceField];
                // If price is undefined or null, it can't match any price filter
                if (price === undefined || price === null) return false;
                
                const minPriceNum = minPrice ? Number(minPrice) : null;
                const maxPriceNum = maxPrice ? Number(maxPrice) : null;
                
                return (
                    (!minPriceNum || price >= minPriceNum) &&
                    (!maxPriceNum || price <= maxPriceNum)
                );
            })();

            // Location matching with scoring
            let locationScore = 0;
            let locationMatches = false;
            if (property.locationSchemaId) {
                if (state && property.locationSchemaId.state?.match(new RegExp(state, 'i'))) {
                    locationScore += 1;
                    locationMatches = true;
                }
                if (city && property.locationSchemaId.city?.match(new RegExp(city, 'i'))) {
                    locationScore += 2;
                    locationMatches = true;
                }
                if (locality && property.locationSchemaId.locality?.match(new RegExp(locality, 'i'))) {
                    locationScore += 3;
                    locationMatches = true;
                }
            }
            const matchesLocation = !city && !locality && !state || locationMatches;

            // Search query matching with scoring
            let searchScore = 0;
            if (searchQuery) {
                const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);
                
                // Title matching
                if (property.propertyTitle) {
                    const titleWords = property.propertyTitle.toLowerCase().trim().split(/\s+/);
                    const titleFullText = property.propertyTitle.toLowerCase();
                    
                    if (titleFullText.includes(searchQuery.toLowerCase())) {
                        searchScore += 15;
                    }

                    for (const searchTerm of searchTerms) {
                        for (const titleWord of titleWords) {
                            if (titleWord === searchTerm) {
                                searchScore += 10;
                            }
                            else if (titleWord.startsWith(searchTerm) || searchTerm.startsWith(titleWord)) {
                                searchScore += 7;
                            }
                            else if (titleWord.includes(searchTerm) || searchTerm.includes(titleWord)) {
                                searchScore += 5;
                            }
                            else if (calculateLevenshteinDistance(titleWord, searchTerm) <= 1) {
                                searchScore += 4;
                            }
                            else if (calculateLevenshteinDistance(titleWord, searchTerm) <= 2) {
                                searchScore += 2;
                            }
                        }
                    }
                }

                // Location matching
                if (property.locationSchemaId) {
                    const locationFields = {
                        apartmentSociety: { value: property.locationSchemaId.apartmentSociety, weight: 5 },
                        subLocality: { value: property.locationSchemaId.subLocality, weight: 4 },
                        locality: { value: property.locationSchemaId.locality, weight: 3 },
                        city: { value: property.locationSchemaId.city, weight: 2 },
                        state: { value: property.locationSchemaId.state, weight: 1 }
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
                                }
                                else if (locationWord.includes(searchTerm) || searchTerm.includes(locationWord)) {
                                    searchScore += weight;
                                }
                                else if (calculateLevenshteinDistance(locationWord, searchTerm) <= 2) {
                                    searchScore += weight * 0.5;
                                }
                            }
                        }
                    }
                }

                // Description matching
                if (property.description) {
                    const descWords = property.description.toLowerCase().trim().split(/\s+/);
                    const descFullText = property.description.toLowerCase();

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

            const relevanceScore = searchScore + locationScore;

            return {
                ...property,
                relevanceScore,
                matches: matchesPropertyType && matchesTransactionType && matchesPrice && matchesLocation && (searchQuery ? searchScore > 0 : true)
            };
        }).filter(property => property.matches)
          .sort((a, b) => b.relevanceScore - a.relevanceScore);

        // Populate property details and filter by commercialType if needed
        const filteredProperties = [];
        for (const property of properties) {
            let matchesCommercialType = true;
            
            if (property.propertyDetailSchemaId?.refType) {
                if (mongoose.models[property.propertyDetailSchemaId.refType]) {
                    const DynamicModel = mongoose.model(property.propertyDetailSchemaId.refType);
                    property.propertyDetailSchemaId.refId = await DynamicModel.findById(property.propertyDetailSchemaId.refId)
                        .select('-_id -createdAt -updatedAt')
                        .lean();
                    
                    // Filter by commercialType if specified
                    if (property.isCommercial) {
                        // For Land property type
                        if (property.propertyType === 'Land' && 
                            property.propertyDetailSchemaId.refId) {
                            // Check if landType is Commercial and commercialType matches
                            if (property.propertyDetailSchemaId.refId.landType === 'Commercial') {
                                const requestedLandType = req.commercialLandType || req.query.commercialLandType;
                                if (requestedLandType && property.propertyDetailSchemaId.refId.commercialType !== requestedLandType) {
                                    matchesCommercialType = false;
                                }
                            } else if (property.propertyDetailSchemaId.refId.landType === 'Residential') {
                                // If residential land but commercial land type requested
                                if (req.commercialLandType || req.query.commercialLandType) {
                                    matchesCommercialType = false;
                                }
                            } else if (req.commercialLandType === 'Agricultural / Farm Land' && 
                                     property.propertyDetailSchemaId.refId.commercialType !== 'Agricultural / Farm Land') {
                                matchesCommercialType = false;
                            }
                        }
                        
                        // For Plot property type
                        if (property.propertyType === 'Plot' && 
                            property.propertyDetailSchemaId.refId) {
                            // Check if plotType is Commercial and commercialType matches
                            if (property.propertyDetailSchemaId.refId.plotType === 'Commercial') {
                                const requestedPlotType = req.commercialPlotType || req.query.commercialPlotType;
                                if (requestedPlotType && property.propertyDetailSchemaId.refId.commercialType !== requestedPlotType) {
                                    matchesCommercialType = false;
                                }
                            } else if (property.propertyDetailSchemaId.refId.plotType === 'Residential') {
                                // If residential plot but commercial plot type requested
                                if (req.commercialPlotType || req.query.commercialPlotType) {
                                    matchesCommercialType = false;
                                }
                            }
                        }
                    }
                }
            }
            
            delete property.relevanceScore;
            delete property.matches;
            
            // Only add properties that match the commercial type criteria
            if (matchesCommercialType) {
                filteredProperties.push(property);
            }
        }
        
        // Replace the properties array with the filtered one
        properties = filteredProperties;

        const limit = 20;
        const total = properties.length;
        const totalPages = Math.ceil(total / limit);
        const paginatedProperties = properties.slice((page - 1) * limit, page * limit);

        res.status(200).json({
            data: paginatedProperties,
            totalPages,
            currentPage: parseInt(page),
            totalRecords: total
        });

    } catch (error) {
        console.error('Error searching properties:', error);
        res.status(500).json({
            error: error.message,
            message: 'Error searching properties'
        });
    }
};

const searchPropertiesByAdmin = async (req, res) => {
    try {
        let { propertyType, transactionType, minPrice, maxPrice, locality, city, page = 1, state, status, searchQuery } = req.query;

        if (propertyType == 'Flat-Apartment') {
            propertyType = 'FlatApartment'
        }
        if (transactionType == 'Buy') {
            transactionType = 'Sell'
        }

        // Build base query
        let query = {};

        // Add status filter if provided
        if (status && ['active', 'sold', 'blocked', 'requested'].includes(status)) {
            query.status = status;
        }

        // Get properties with seller info
        let properties = await Property.find(query)
            .populate([
                { path: 'locationSchemaId', select: '-_id -createdAt -updatedAt' },
                { path: 'pricingDetails', select: '-_id -createdAt -updatedAt' },
                { 
                    path: 'sellerId',
                    select: 'sellerDetails.name sellerDetails.email -_id'
                }
            ])
            .sort({ createdAt: -1 })
            .select('-__v -createdAt -updatedAt')
            .lean();

        // Helper function for Levenshtein Distance calculation
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

        // Calculate relevance scores and filter properties
        properties = properties.map(property => {
            const matchesPropertyType = !propertyType || property.propertyType === propertyType;
            const matchesTransactionType = !transactionType || property.transactionType === transactionType;
            
            // Price matching
            const matchesPrice = (() => {
                if (!minPrice && !maxPrice) return true;
                const priceField = {
                    'Rent': 'rent',
                    'Sell': 'salePrice',
                    'PG': 'pgPrice'
                }[transactionType] || 'rent';

                // Check if pricingDetails exists and has the relevant price field
                if (!property.pricingDetails) return false;
                
                const price = property.pricingDetails[priceField];
                // If price is undefined or null, it can't match any price filter
                if (price === undefined || price === null) return false;
                
                const minPriceNum = minPrice ? Number(minPrice) : null;
                const maxPriceNum = maxPrice ? Number(maxPrice) : null;
                
                return (
                    (!minPriceNum || price >= minPriceNum) &&
                    (!maxPriceNum || price <= maxPriceNum)
                );
            })();

            // Location matching with scoring
            let locationScore = 0;
            let locationMatches = false;
            if (property.locationSchemaId) {
                if (state && property.locationSchemaId.state?.match(new RegExp(state, 'i'))) {
                    locationScore += 1;
                    locationMatches = true;
                }
                if (city && property.locationSchemaId.city?.match(new RegExp(city, 'i'))) {
                    locationScore += 2;
                    locationMatches = true;
                }
                if (locality && property.locationSchemaId.locality?.match(new RegExp(locality, 'i'))) {
                    locationScore += 3;
                    locationMatches = true;
                }
            }
            const matchesLocation = !city && !locality && !state || locationMatches;

            // Search query matching with enhanced scoring
            let searchScore = 0;
            if (searchQuery) {
                const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);
                
                // Title matching with enhanced scoring
                if (property.propertyTitle) {
                    const titleWords = property.propertyTitle.toLowerCase().trim().split(/\s+/);
                    const titleFullText = property.propertyTitle.toLowerCase();
                    
                    // Full phrase match in title (highest weight)
                    if (titleFullText.includes(searchQuery.toLowerCase())) {
                        searchScore += 15;
                    }

                    for (const searchTerm of searchTerms) {
                        for (const titleWord of titleWords) {
                            // Exact word match in title
                            if (titleWord === searchTerm) {
                                searchScore += 10;
                            }
                            // Start of word match (high weight)
                            else if (titleWord.startsWith(searchTerm) || searchTerm.startsWith(titleWord)) {
                                searchScore += 7;
                            }
                            // Partial match in title
                            else if (titleWord.includes(searchTerm) || searchTerm.includes(titleWord)) {
                                searchScore += 5;
                            }
                            // Close fuzzy match
                            else if (calculateLevenshteinDistance(titleWord, searchTerm) <= 1) {
                                searchScore += 4;
                            }
                            // Loose fuzzy match
                            else if (calculateLevenshteinDistance(titleWord, searchTerm) <= 2) {
                                searchScore += 2;
                            }
                        }
                    }
                }

                // Location matching with improved relevance
                if (property.locationSchemaId) {
                    const locationFields = {
                        apartmentSociety: { value: property.locationSchemaId.apartmentSociety, weight: 5 },
                        subLocality: { value: property.locationSchemaId.subLocality, weight: 4 },
                        locality: { value: property.locationSchemaId.locality, weight: 3 },
                        city: { value: property.locationSchemaId.city, weight: 2 },
                        state: { value: property.locationSchemaId.state, weight: 1 }
                    };

                    for (const [field, { value, weight }] of Object.entries(locationFields)) {
                        if (!value) continue;
                        
                        const locationWords = value.toLowerCase().trim().split(/\s+/);
                        const locationFullText = value.toLowerCase();

                        // Full phrase match in location
                        if (locationFullText.includes(searchQuery.toLowerCase())) {
                            searchScore += weight * 3;
                        }

                        for (const searchTerm of searchTerms) {
                            for (const locationWord of locationWords) {
                                // Exact match
                                if (locationWord === searchTerm) {
                                    searchScore += weight * 2;
                                }
                                // Partial match
                                else if (locationWord.includes(searchTerm) || searchTerm.includes(locationWord)) {
                                    searchScore += weight;
                                }
                                // Fuzzy match
                                else if (calculateLevenshteinDistance(locationWord, searchTerm) <= 2) {
                                    searchScore += weight * 0.5;
                                }
                            }
                        }
                    }
                }

                // Description matching (lower priority)
                if (property.description) {
                    const descWords = property.description.toLowerCase().trim().split(/\s+/);
                    const descFullText = property.description.toLowerCase();

                    // Full phrase match in description
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
                ...property,
                relevanceScore,
                matches: matchesPropertyType && matchesTransactionType && matchesPrice && matchesLocation && (searchQuery ? searchScore > 0 : true)
            };
        }).filter(property => property.matches)
          .sort((a, b) => b.relevanceScore - a.relevanceScore);

        // Rest of your existing code for populating property details and pagination
        for (const property of properties) {
            if (property.propertyDetailSchemaId?.refType) {
                if (mongoose.models[property.propertyDetailSchemaId.refType]) {
                    const DynamicModel = mongoose.model(property.propertyDetailSchemaId.refType);
                    property.propertyDetailSchemaId.refId = await DynamicModel.findById(property.propertyDetailSchemaId.refId)
                        .select('-_id -createdAt -updatedAt')
                        .lean();
                } else {
                    console.warn(`Model "${property.propertyDetailSchemaId.refType}" not registered`);
                }
            }
            delete property.relevanceScore;
            delete property.matches;
        }

        const limit = 20;
        const total = properties.length;
        const totalPages = Math.ceil(total / limit);
        const paginatedProperties = properties.slice((page - 1) * limit, page * limit);

        res.status(200).json({
            data: paginatedProperties,
            totalPages,
            currentPage: parseInt(page),
            totalRecords: total
        });

    } catch (error) {
        console.error('Error searching properties:', error);
        res.status(500).json({
            error: error.message,
            message: 'Error searching properties'
        });
    }
};


const getSimilarProperties = async (req, res) => {
    try {
        const propertyId = req.params.id;
        
        // Get the original property
        const originalProperty = await Property.findById(propertyId)
            .populate('locationSchemaId')
            .populate('pricingDetails')
            .populate('propertyDetailSchemaId.refId')
            .lean();

        if (!originalProperty) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Try multiple matching strategies in order of relevance
        let similarProperties = [];
        
        // Strategy 1: Exact match on property type and transaction type
        if (similarProperties.length < 5) {
            const exactMatchQuery = {
                _id: { $ne: propertyId },
                status: 'active',
                propertyType: originalProperty.propertyType,
                transactionType: originalProperty.transactionType
            };
            
            // Only add city filter if locationSchemaId exists
            if (originalProperty.locationSchemaId && originalProperty.locationSchemaId.city) {
                exactMatchQuery['locationSchemaId.city'] = originalProperty.locationSchemaId.city;
            }

            const exactMatches = await Property.find(exactMatchQuery)
                .populate('locationSchemaId')
                .populate('pricingDetails')
                .limit(10)
                .lean();

            similarProperties.push(...exactMatches);
        }

        // Strategy 2: Same property type, different transaction type
        if (similarProperties.length < 5) {
            const samePropertyTypeQuery = {
                _id: { $ne: propertyId },
                status: 'active',
                propertyType: originalProperty.propertyType,
                transactionType: { $ne: originalProperty.transactionType }
            };
            
            // Only add city filter if locationSchemaId exists
            if (originalProperty.locationSchemaId && originalProperty.locationSchemaId.city) {
                samePropertyTypeQuery['locationSchemaId.city'] = originalProperty.locationSchemaId.city;
            }

            const samePropertyTypeMatches = await Property.find(samePropertyTypeQuery)
                .populate('locationSchemaId')
                .populate('pricingDetails')
                .limit(10)
                .lean();

            similarProperties.push(...samePropertyTypeMatches);
        }

        // Strategy 3: Same city, any property type
        if (similarProperties.length < 5 && originalProperty.locationSchemaId && originalProperty.locationSchemaId.city) {
            const sameCityMatches = await Property.find({
                _id: { $ne: propertyId },
                status: 'active',
                'locationSchemaId.city': originalProperty.locationSchemaId.city
            })
            .populate('locationSchemaId')
            .populate('pricingDetails')
            .limit(10)
            .lean();

            similarProperties.push(...sameCityMatches);
        }

        // Strategy 4: Similar price range, any location
        if (similarProperties.length < 5 && originalProperty.pricingDetails) {
            const priceField = originalProperty.transactionType === 'Rent' ? 'rent' : 'salePrice';
            const targetPrice = originalProperty.pricingDetails[priceField];
            
            // Only proceed if targetPrice exists and is a number
            if (targetPrice && !isNaN(targetPrice)) {
                const priceRange = {
                    min: targetPrice * 0.7, // 30% below
                    max: targetPrice * 1.3  // 30% above
                };

                const priceQuery = {
                    _id: { $ne: propertyId },
                    status: 'active'
                };
                
                // Use dot notation for nested fields
                priceQuery[`pricingDetails.${priceField}`] = {
                    $gte: priceRange.min,
                    $lte: priceRange.max
                };

                const similarPriceMatches = await Property.find(priceQuery)
                    .populate('locationSchemaId')
                    .populate('pricingDetails')
                    .limit(10)
                    .lean();

                similarProperties.push(...similarPriceMatches);
            }
        }

        // Strategy 5: Fallback - just get some active properties if we still don't have enough
        if (similarProperties.length < 5) {
            const fallbackMatches = await Property.find({
                _id: { $ne: propertyId },
                status: 'active'
            })
            .populate('locationSchemaId')
            .populate('pricingDetails')
            .limit(10)
            .lean();

            similarProperties.push(...fallbackMatches);
        }

        // Remove duplicates by converting to Set and back
        const uniqueIds = new Set();
        similarProperties = similarProperties.filter(property => {
            const id = property._id.toString();
            if (uniqueIds.has(id)) {
                return false;
            }
            uniqueIds.add(id);
            return true;
        });

        // Calculate similarity scores
        similarProperties = similarProperties.map(property => {
            let similarityScore = 0;

            // Property type match
            if (property.propertyType === originalProperty.propertyType) {
                similarityScore += 30;
            }

            // Transaction type match
            if (property.transactionType === originalProperty.transactionType) {
                similarityScore += 20;
            }

            // Location similarity - with null checks
            if (property.locationSchemaId && originalProperty.locationSchemaId) {
                if (property.locationSchemaId.city === originalProperty.locationSchemaId.city) {
                    similarityScore += 15;
                }
                if (property.locationSchemaId.locality === originalProperty.locationSchemaId.locality) {
                    similarityScore += 10;
                }
            }

            // Price similarity - with null checks
            if (property.pricingDetails && originalProperty.pricingDetails) {
                const priceField = property.transactionType === 'Rent' ? 'rent' : 'salePrice';
                
                // Only calculate if both prices exist
                if (property.pricingDetails[priceField] && originalProperty.pricingDetails[priceField]) {
                    const priceDiff = Math.abs(
                        property.pricingDetails[priceField] - originalProperty.pricingDetails[priceField]
                    );
                    const priceThreshold = originalProperty.pricingDetails[priceField] * 0.3; // 30% threshold
                    if (priceDiff <= priceThreshold) {
                        similarityScore += 15;
                    }
                }
            }

            return {
                ...property,
                similarityScore
            };
        });

        // Sort by similarity score and take top 5
        similarProperties.sort((a, b) => b.similarityScore - a.similarityScore);
        similarProperties = similarProperties.slice(0, 5);

        // Remove similarity scores from final response
        similarProperties = similarProperties.map(property => {
            const { similarityScore, ...propertyWithoutScore } = property;
            return propertyWithoutScore;
        });

        res.status(200).json({
            success: true,
            message: 'Similar properties retrieved successfully',
            data: similarProperties
        });

    } catch (error) {
        console.error('Error getting similar properties:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error getting similar properties'
        });
    }
};





const aprooveProperty = async (req, res, next) => {
    try {
        const { id } = req.params;
        const property = await Property.findById(id).populate('sellerId');

        if (!property) {
            return res.status(404).json({ message: "Property not found." });
        }

        if (property.status === 'active') {
            return res.status(400).json({ message: "Property is already active." });
        }

        // Update status to active and set approval timestamp
        property.status = 'active';
        await property.save();


        // Create notification for seller about property approval
        await createNotification({
            userType: 'Seller',
            userId: property.sellerId._id,
            message: `Your property "${property.propertyTitle}" (${property._id}) has been approved by admin and is now active`
        });

        // Send activation notification email to seller
        await sendEmail(
            property.sellerId.sellerDetails.email,
            "Property Activated Successfully",
            ()=> propertyApprovalNotificationTemplate(property.sellerId.sellerDetails.name, property.propertyTitle)
        );

        res.status(200).json({
            message: "Property activated successfully!",
            property: {
                ...property._doc,
                status: 'active',
                approvedAt: property.approvedAt
            }
        });

    } catch (error) {
        console.error('Error searching properties:', error);
        res.status(500).json({
            error: error.message,
            message: 'Error searching properties'
        });
    }
};



const getProperties = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1; // Get page number from query params
        const limit = 20; // Number of properties per page

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Get properties with sorting (newest first), pagination, and population
        const [properties, total] = await Promise.all([
            Property.find({ status: 'active' })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('locationSchemaId'),
            Property.countDocuments()
        ]);

        // Calculate total pages
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            message: properties.length > 0 ? "Properties retrieved successfully" : "No properties found",
            data: properties,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalProperties: total
            }
        });

    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({
            error: error.message,
            message: 'Error fetching properties'
        });
    }
};


const getPropertiesBySeller = async (req, res) => {
    try {
        const { page = 1, status = "active", type, transactionType } = req.query;
        const sellerId = req.user._id;
        const limit = 20;
        const skip = (page - 1) * limit;

        if (!status || !["active", "requested", "sold"].includes(status)) {
            return res.status(400).json({ message: "Valid status parameter required (active/requested/sold)" });
        }

        const filter = {
            sellerId: sellerId,
            status: status
        };

        // Add type filter if provided
        if (type) {
            filter.propertyType = type;
        }

        // Add transaction type filter if provided
        if (transactionType) {
            filter.transactionType = transactionType;
        }

        const [properties, total] = await Promise.all([
            Property.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('locationSchemaId')
                .populate('pricingDetails'),
            Property.countDocuments(filter)
        ]);

        res.status(200).json({
            data: properties,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
                totalProperties: total
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPropertiesBySellerIdAdmin = async (req, res) => {
    try {
        const { page = 1, status = "active" } = req.query;
        const sellerId = req.params.id;
        const limit = 20;
        const skip = (page - 1) * limit;

        if (!status || !["active", "requested", "sold", "blocked"].includes(status)) {
            return res.status(400).json({ message: "Valid status parameter required (active/requested/sold/blocked)" });
        }

        const filter = {
            sellerId: sellerId,
            status: status
        };

        const [properties, total] = await Promise.all([
            Property.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('locationSchemaId')
                .populate('pricingDetails'),
            Property.countDocuments(filter)
        ]);

        res.status(200).json({
            data: properties,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
                totalProperties: total
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const getSellerProperties = async (req, res, next) => {
    try {
        const sellerId = req.params.sellerId; // Correctly extract sellerId from params
        const page = parseInt(req.query.page) || 1; // Get page number from query params
        const limit = 20; // Number of properties per page

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Get seller's properties with sorting and pagination
        const [properties, total] = await Promise.all([
            Property.find({ sellerId: sellerId, status: 'active' })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('locationSchemaId'),
            Property.countDocuments({ sellerId })
        ]);

        // Calculate total pages
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            message: properties.length > 0 ? "Properties retrieved successfully" : "No properties found",
            data: properties,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalProperties: total
            }
        });

    } catch (error) {
        console.error('Error fetching seller properties:', error);
        res.status(500).json({
            error: error.message,
            message: 'Error fetching seller properties'
        });
    }
};






// Update property by seller
const updateProperty = async (req, res) => {
    try {
        // Find the property to update
        const propertyId = req.params.id;
        const property = await Property.findById(propertyId);
        
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }
        
        // Verify seller ownership
        if (req.user._id.toString() !== property.sellerId.toString()) {
            return res.status(403).json({ error: 'Unauthorized to update this property' });
        }
        
        // Check if property is in a valid state for updates
        if (property.status === 'blocked' || property.status === 'sold') {
            return res.status(400).json({ 
                error: `Cannot update property with status: ${property.status}` 
            });
        }

        // Update location details if provided
        if (req.body.city || req.body.locality || req.body.state || req.body.subLocality || req.body.apartmentSociety || req.body.houseNo) {
            await Location.findByIdAndUpdate(property.locationSchemaId, {
                state: req.body.state || property.locationSchemaId.state,
                city: req.body.city || property.locationSchemaId.city,
                locality: req.body.locality || property.locationSchemaId.locality,
                subLocality: req.body.subLocality || property.locationSchemaId.subLocality,
                apartmentSociety: req.body.apartmentSociety || property.locationSchemaId.apartmentSociety,
                houseNo: req.body.houseNo || property.locationSchemaId.houseNo
            });
        }

        // Update pricing details if provided
        if (req.body.rent || req.body.salePrice || req.body.pgPrice || req.body.securityDeposit || req.body.foodIncluded) {
            await Pricing.findByIdAndUpdate(property.pricingDetails, {
                rent: req.body.rent,
                salePrice: req.body.salePrice,
                pgPrice: req.body.pgPrice,
                securityDeposit: req.body.securityDeposit,
                foodIncluded: req.body.foodIncluded
            });
        }

        // Update amenities if provided
        if (req.body.amenities) {
            await Amenities.findByIdAndUpdate(
                property.amenitiesSchemaId.refId,
                JSON.parse(req.body.amenities)
            );
        }

        // Update property details based on property type
        if (req.body.propertyType) {
            const propertyDetailModel = (() => {
                switch (property.propertyDetailSchemaId.refType) {
                    case 'FlatApartment': return FlatApartment;
                    case 'IndependentHouseVilla': return HouseVilla;
                    case 'IndependentBuilderFloor': return independentBuilderFloor;
                    case 'Land': return land;
                    case 'Plot': return plot;
                    case 'StudioApartment': return StudioApartment;
                    case 'ServicedApartment': return servicedApartment;
                    case 'Farmhouse': return Farmhouse;
                    case 'Office': return office;
                    case 'RetailShop': return RetailShop;
                    case 'Storage': return storage;
                    case 'Industry': return industry;
                    case 'Hospitality': return hospitality;
                    case 'OthersProperties': return othersProperties;
                    default: return null;
                }
            })();

            if (propertyDetailModel) {
                // Get current property details
                const currentDetails = await propertyDetailModel.findById(property.propertyDetailSchemaId.refId);
                
                // Prepare update object based on property type
                let updateObj = {};
                
                // Common fields for most property types
                if (req.body.bedrooms) updateObj.bedrooms = req.body.bedrooms;
                if (req.body.bathrooms) updateObj.bathrooms = req.body.bathrooms;
                if (req.body.balconies) updateObj.balconies = req.body.balconies;
                if (req.body.furnishing) updateObj.furnishing = req.body.furnishing;
                if (req.body.furnishingItems) updateObj.furnishingItems = req.body.furnishingItems;
                if (req.body.reservedParking) updateObj.reservedParking = req.body.reservedParking;
                if (req.body.availabilityStatus) updateObj.availabilityStatus = req.body.availabilityStatus;
                if (req.body.propertyAge) updateObj.propertyAge = req.body.propertyAge;
                if (req.body.totalFloors) updateObj.totalFloors = req.body.totalFloors;
                
                // Area details updates
                const areaUpdates = {};
                if (req.body.carpetArea) areaUpdates.carpetArea = req.body.carpetArea;
                if (req.body.builtUpArea) areaUpdates.builtUpArea = req.body.builtUpArea;
                if (req.body.superBuiltUpArea) areaUpdates.superBuiltUpArea = req.body.superBuiltUpArea;
                if (req.body.plotArea) areaUpdates.plotArea = req.body.plotArea;
                if (req.body.areaUnitForCarpet) areaUpdates.areaUnitForCarpet = req.body.areaUnitForCarpet;
                if (req.body.areaUnitForBuiltUp) areaUpdates.areaUnitForBuiltUp = req.body.areaUnitForBuiltUp;
                if (req.body.areaUnitForSuperBuiltUp) areaUpdates.areaUnitForSuperBuiltUp = req.body.areaUnitForSuperBuiltUp;
                if (req.body.areaUnitForPlot) areaUpdates.areaUnitForPlot = req.body.areaUnitForPlot;
                
                if (Object.keys(areaUpdates).length > 0) {
                    updateObj.areaDetails = { ...currentDetails.areaDetails, ...areaUpdates };
                }
                
                // Type-specific fields
                switch (property.propertyDetailSchemaId.refType) {
                    case 'FlatApartment':
                        if (req.body.floorNumber) updateObj.floorNumber = req.body.floorNumber;
                        break;
                    case 'IndependentBuilderFloor':
                        if (req.body.floorType) updateObj.floorType = req.body.floorType;
                        if (req.body.propertyOnFloor) updateObj.propertyOnFloor = req.body.propertyOnFloor;
                        break;
                    case 'Land':
                    case 'Plot':
                        if (req.body.boundaryWall) updateObj.boundaryWall = req.body.boundaryWall;
                        if (req.body.openSides) updateObj.openSides = req.body.openSides;
                        if (req.body.constructionDone) updateObj.constructionDone = req.body.constructionDone;
                        if (req.body.possessionDate) updateObj.possessionDate = new Date(req.body.possessionDate);
                        if (req.body.lengthOfPlot) updateObj.lengthOfPlot = req.body.lengthOfPlot;
                        if (req.body.breadthOfPlot) updateObj.breadthOfPlot = req.body.breadthOfPlot;
                        if (req.body.floorsAllowed) updateObj.floorsAllowed = req.body.floorsAllowed;
                        break;
                }
                
                // Update property details
                await propertyDetailModel.findByIdAndUpdate(
                    property.propertyDetailSchemaId.refId,
                    updateObj
                );
            }
        }

        // Update main property document
        const updateData = {};
        if (req.body.propertyTitle) updateData.propertyTitle = req.body.propertyTitle;
        if (req.body.description) updateData.description = req.body.description;
        if (req.body.facingDirection) updateData.facingDirection = req.body.facingDirection;
        if (req.body.availableFrom) updateData.availableFrom = new Date(req.body.availableFrom);
        if (req.body.willingToRentOut) updateData.willingToRentOut = req.body.willingToRentOut;
        if (req.body.availableFor) updateData.availableFor = req.body.availableFor;
        if (req.body.suitableFor) updateData.suitableFor = req.body.suitableFor;
        
        // Handle media updates if files are provided
        if (req.files) {
            const mediaUpdates = {};
            
            if (req.files.photos && req.files.photos.length > 0) {
                mediaUpdates.photos = req.files.photos.map(file => file.path.split('/').pop());
            }
            
            if (req.files.video && req.files.video.length > 0) {
                mediaUpdates.video = req.files.video[0].path.split('/').pop();
            }
            
            if (Object.keys(mediaUpdates).length > 0) {
                updateData.propertyMedia = mediaUpdates;
            }
        }
        
        // Update property status to 'requested' for admin review
        updateData.status = 'requested';
        
        const updatedProperty = await Property.findByIdAndUpdate(
            propertyId,
            updateData,
            { new: true }
        );

        // Get seller details
        const seller = await Seller.findById(req.user._id);
        const Admin = await User.findOne({ role: 'admin' });

        // Create notification for seller
        await createNotification({
            userType: 'Seller',
            userId: req.user._id,
            message: `Your property ${updatedProperty.propertyTitle} (${updatedProperty._id}) has been updated and submitted for admin review`
        });

        // Create notification for admin
        await createNotification({
            userId: Admin._id,
            userType: 'User',
            message: `Property update from ${seller.sellerDetails.name} - ${updatedProperty.propertyTitle} (${updatedProperty._id}) requires review`
        });

        // Send email to seller
        await sendEmail(
            seller.sellerDetails.email,
            "Property update confirmation",
            () => userPropertyUpdateTemplate(seller.sellerDetails.name, {
                title: updatedProperty.propertyTitle,
                type: updatedProperty.propertyType,
                description: updatedProperty.description,
                _id: updatedProperty._id
            })
        );

        // Send email to admin
        await sendEmail(
            process.env.ADMIN_EMAIL,
            "Property update notification",
            () => adminPropertyUpdateNotificationTemplate({
                title: updatedProperty.propertyTitle,
                type: updatedProperty.propertyType,
                description: updatedProperty.description,
                _id: updatedProperty._id
            })
        );

        res.status(200).json({
            message: 'Property updated successfully and submitted for admin review',
            data: updatedProperty
        });
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ error: error.message });
    }
};

export { createPropertyDetails, getSimilarProperties, searchPropertiesByAdmin, getPropertiesBySeller, getPropertiesBySellerIdAdmin, getSellerProperties, getProperties, aprooveProperty, deletePropertyByAdmin, deletePropertyBySeller, searchProperties, markPropertyAsSold, createLocationDetails, createPricingDetails, createAmenitiesDetails, createProperty, getProperty, updateProperty };

