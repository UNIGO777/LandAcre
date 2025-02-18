import mongoose from 'mongoose';
import { Property, FlatApartment, HouseVilla, Location, StudioApartment, Amenities, RetailShop, office, Farmhouse, PlotLand, Pricing, independentOrBuilderFloor, servicedApartment, commercialPlotLand, storage, industry, hospitality, othersProperties } from '../Models/Property.js';
import Seller from '../Models/Seller.js';
import sendEmail from '../Nodemailer/Controller/Controller.js';
import { userPropertyRequestTemplate, adminPropertyRequestNotificationTemplate } from '../Nodemailer/Tamplates/properties/propertyRequested.js'
import { adminPropertyDeletedNotificationTemplate, SellerPropertyDeletedTemplate } from '../Nodemailer/Tamplates/properties/propertyDeleted.js';
import User from '../Models/User.js';
import { propertyApprovalNotificationTemplate } from '../Nodemailer/Tamplates/properties/propertyApprovalNotificationTemplate.js';
import createNotification from '../Hof/makeNotifiction.js';

// Middleware for creating property details
const createPropertyDetails = async (req, res, next) => {
    try {
        const { propertyType, propertyDetails } = req.body;

        let propertyDetailSchema;
        switch (propertyType) {
            case 'Flat/Apartment':
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
            case 'Independent House/Villa':
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
                    reservedParking: builderFloorDetails.reservedParking,
                    totalFloors: houseVillaDetails.totalFloors,
                    availabilityStatus: houseVillaDetails.availabilityStatus,
                    propertyAge: houseVillaDetails.propertyAge
                });
                break;
            case 'Builder Floor':
                const builderFloorDetails = { ...req.body };

                // Validation checks for required fields
                const builderFloorRequiredFields = ['floorType', 'totalFloors', 'propertyOnFloor', 'bedrooms', 'bathrooms', 'carpetArea', 'areaUnitForCarpet', 'furnishing', 'availabilityStatus', 'reservedParking'];
                for (const field of builderFloorRequiredFields) {
                    if (!builderFloorDetails[field]) {
                        return res.status(400).json({ error: `${field} is required for Builder Floor` });
                    }
                }

                propertyDetailSchema = new IndependentOrBuilderFloor({
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
            case 'Plot/Land':
                const plotLandDetails = { ...req.body };

                // Validation checks for required fields
                const plotLandRequiredFields = ['plotArea', 'areaUnitForPlot', 'boundaryWall', 'openSides', 'constructionDone', 'possessionDate'];
                for (const field of plotLandRequiredFields) {
                    if (!plotLandDetails[field]) {
                        return res.status(400).json({ error: `${field} is required for Plot/Land` });
                    }
                }

                propertyDetailSchema = new PlotLand({
                    areaDetails: {
                        plotArea: plotLandDetails.plotArea,
                        areaUnitForPlot: plotLandDetails.areaUnitForPlot
                    },
                    lengthOfPlot: plotLandDetails.lengthOfPlot,
                    breadthOfPlot: plotLandDetails.breadthOfPlot,
                    floorsAllowed: plotLandDetails.floorsAllowed,
                    boundaryWall: plotLandDetails.boundaryWall,
                    openSides: plotLandDetails.openSides,
                    constructionDone: plotLandDetails.constructionDone,
                    possessionDate: plotLandDetails.possessionDate
                });
                break;
            case '1 RK/Studio Apartment':
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
            case 'Serviced Apartment':
                const servicedApartmentDetails = { ...req.body };
                const servicedApartmentRequiredFields = ['bedrooms', 'bathrooms', 'carpetArea', 'areaUnitForCarpet', 'furnishing', 'availabilityStatus', 'reservedParking', 'propertyAge', 'totalFloors', 'floorNumber'];
                for (const field of servicedApartmentRequiredFields) {
                    if (!servicedApartmentDetails[field]) {
                        return res.status(400).json({ error: `${field} is required for Serviced Apartment` });
                    }
                }
                propertyDetailSchema = new ServicedApartment({
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
                propertyDetailSchema = new FarmhouseDetail({
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
                for (const field of officeRequiredFields) {
                    if (!officeDetails[field]) {
                        return res.status(400).json({ error: `${field} is required for Office` });
                    }
                }
                if (officeDetails.WhatKindOfOfficeIsit === 'Bare shell office space') {
                    const bareShellRequired = ['constructionStatus', 'doorsConstructed', 'officeSetup.minSeats', 'officeSetup.cabins', 'officeSetup.meetingRooms'];
                    for (const field of bareShellRequired) {
                        if (!officeDetails[field] && !officeDetails[field.split('.')[1]]) {
                            return res.status(400).json({ error: `${field} is required for Bare shell offices` });
                        }
                    }
                }
                if (officeDetails.WhatKindOfOfficeIsit === 'Bare shell office space' || officeDetails.WhatKindOfOfficeIsit === 'Ready to move office space') {
                    const officeSetupRequired = ['minSeats', 'cabins', 'meetingRooms'];
                    for (const field of officeSetupRequired) {
                        if (!officeDetails.officeSetup?.[field]) {
                            return res.status(400).json({ error: `officeSetup.${field} is required for this office type` });
                        }
                    }
                }
                propertyDetailSchema = new Office({
                    WhatKindOfOfficeIsit: officeDetails.WhatKindOfOfficeIsit,
                    areaDetails: {
                        carpetArea: officeDetails.carpetArea,
                        superBuiltUpArea: officeDetails.superBuiltUpArea,
                        areaUnitForCarpet: officeDetails.areaUnitForCarpet,
                        areaUnitForSuperBuiltUp: officeDetails.areaUnitForSuperBuiltUp
                    },
                    constructionStatus: officeDetails.constructionStatus,
                    doorsConstructed: officeDetails.doorsConstructed,
                    officeSetup: officeDetails.officeSetup,
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
                if (retailDetails.locationType === 'Others' && !retailDetails.otherLocationName) {
                    return res.status(400).json({ error: 'otherLocationName is required when locationType is Others' });
                }
                propertyDetailSchema = new Retail({
                    retailType: retailDetails.retailType,
                    locationType: retailDetails.locationType,
                    otherLocationName: retailDetails.otherLocationName,
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
            case 'Comercial Plot/Land':
                const commercialPlotLandDetails = { ...req.body };
                const commercialPlotLandRequiredFields = ['PlotLandType', 'plotArea', 'areaUnitForPlot', 'lengthOfPlot', 'breadthOfPlot', 'widthOfFacingRoad', 'numberOfOpenSides', 'constructionStatus', 'propertyFacing', 'possessionBy'];
                for (const field of commercialPlotLandRequiredFields) {
                    if (!commercialPlotLandDetails[field]) {
                        return res.status(400).json({ error: `${field} is required for Comercial Plot/Land` });
                    }
                }
                propertyDetailSchema = new CommercialPlotLand({
                    PlotLandType: commercialPlotLandDetails.PlotLandType,
                    areaDetails: {
                        plotArea: commercialPlotLandDetails.plotArea,
                        areaUnitForPlot: commercialPlotLandDetails.areaUnitForPlot
                    },
                    lengthOfPlot: commercialPlotLandDetails.lengthOfPlot,
                    breadthOfPlot: commercialPlotLandDetails.breadthOfPlot,
                    widthOfFacingRoad: commercialPlotLandDetails.widthOfFacingRoad,
                    numberOfOpenSides: commercialPlotLandDetails.numberOfOpenSides,
                    constructionStatus: commercialPlotLandDetails.constructionStatus,
                    propertyFacing: commercialPlotLandDetails.propertyFacing,
                    possessionBy: commercialPlotLandDetails.possessionBy
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
                propertyDetailSchema = new Storage({
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
                propertyDetailSchema = new Industry({
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
                propertyDetailSchema = new Hospitality({
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
                propertyDetailSchema = new OthersProperties({
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
                    case 'Flat/Apartment':
                        return 'FlatApartment';
                    case 'Independent House/Villa':
                        return 'HouseVilla';
                    case 'Independent/Builder Floor':
                        return 'IndependentOrBuilderFloor';
                    case 'Plot/Land':
                        return 'PlotLand';
                    case '1 RK/Studio Apartment':
                        return 'StudioApartment';
                    case 'Serviced Apartment':
                        return 'ServicedApartment';
                    case 'Farmhouse':
                        return 'Farmhouse';
                    case 'Office':
                        return 'Office';
                    case 'Retail':
                        return 'RetailShop';
                    case 'Comercial Plot/Land':
                        return 'commercialPlotLand';
                    case 'Storage':
                        return 'Storage';
                    case 'Industry':
                        return 'Industry';
                    case 'Hospitality':
                        return 'Hospitality';
                    case 'others':
                        return 'othersProperties';
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
        const { transactionType, rent, salePrice, pgPrice, pricePerAcre, pricePerSqFt, additionalMeasurements } = req.body;
        // Validation checks for required fields

        if (!transactionType) {
            return res.status(400).json({ error: 'Transaction Type is required' });
        }


        if (transactionType === 'Rent' && !rent) {
            return res.status(400).json({ error: 'Rent is required for Pricing Type Rent' });
        }

        if (transactionType === 'Sell' && (!salePrice || !pricePerAcre || !pricePerSqFt)) {
            return res.status(400).json({ error: 'Sale Price, Price Per Acre, and Price Per SqFt are required for Pricing Type Sell' });
        }

        if (transactionType === 'PG' && !pgPrice) {
            return res.status(400).json({ error: 'PG Price is required for Pricing Type PG' });
        }


        const pricingDetails = new Pricing({
            type: req.body.transactionType,
            rent: req.body.rentPrice,
            salePrice: req.body.salePrice,
            pgPrice: req.body.pgPrice,
            pricePerAcre: req.body.pricePerAcre,
            pricePerSqFt: req.body.pricePerSqFt,
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
        const amenitiesDetails = new Amenities(req.body.amenities);
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

        const validPropertyTypes = [
            'Flat/Apartment', 'Independent House/Villa', 'Builder Floor', 'Plot/Land',
            '1 RK/Studio Apartment', 'Serviced Apartment', 'Farmhouse', 'Office', 'Retail',
            'Comercial Plot/Land', 'Storage', 'Industry', 'Hospitality', 'others'
        ];

        if (!validPropertyTypes.includes(propertyType)) {
            return res.status(400).json({ error: 'Invalid property type' });
        }

        await createLocationDetails(req, res, async () => {
            await createAmenitiesDetails(req, res, async () => {
                await createPricingDetails(req, res, async () => {
                    await createPropertyDetails(req, res, async () => {
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

                        if ((transactionType === 'Rent' || transactionType === 'PG') && !availableDate) {
                            return res.status(400).json({ error: 'Available Date is required for Rent or PG transaction type' });
                        }

                        if (transactionType === 'Rent' && !willingToRentOut) {
                            return res.status(400).json({ error: 'Willing to Rent Out is required for Rent transaction type' });
                        }

                        if (transactionType === 'PG' && (!availableFor || !suitableFor)) {
                            return res.status(400).json({ error: 'Available For and Suitable For are required for PG transaction type' });
                        }

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
                            availableFrom: req.body.availableFrom,
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

        // ✅ Validate ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid property ID' });
        }

        // ✅ Fetch property with standard population
        let property = await Property.findById(id)
            .select('-__v -createdAt -updatedAt')
            .populate('locationSchemaId', '-_id -createdAt -updatedAt')
            .populate('pricingDetails', '-_id -createdAt -updatedAt')
            .populate('sellerId', 'sellerDetails.profilePicture sellerDetails.name sellerType -projects -sellingProperties -password -__v')
            .lean(); // Convert to plain object

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // ✅ Dynamically populate `propertyDetailSchemaId.refId` based on `refType`
        if (mongoose.models[property.propertyDetailSchemaId.refType]) {
            const DynamicModel = mongoose.model(property.propertyDetailSchemaId.refType);
            property.propertyDetailSchemaId.refId = await DynamicModel.findById(property.propertyDetailSchemaId.refId)
                .select('-_id -createdAt -updatedAt')
                .lean();
        } else {
            console.warn(`Model "${property.propertyDetailSchemaId.refType}" is not registered.`)
            }

        
        // ✅ Populate `amenitiesSchemaId.refId`
        if (property.amenitiesSchemaId?.refId) {
            property.amenitiesSchemaId.refId = await Amenities.findById(property.amenitiesSchemaId.refId)
                .select('-_id -createdAt -updatedAt')
                .lean();
        }

        res.status(200).json(property);
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ error: 'Internal server error' });
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



        if(property.status === 'blocked'){
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

       

        if(Admin.role !== 'admin'){
            return res.status(400).json({ error: 'You are not a admin' });
        }

        if(property.status === 'blocked'){
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
        const { propertyType, transactionType, minPrice, maxPrice, locality,city,  page = 1, state } = req.query;

        // ✅ Get all active properties first
        let properties = await Property.find({ status: 'active' })
            .populate([
                { path: 'locationSchemaId', select: '-_id -createdAt -updatedAt' },
                { path: 'pricingDetails', select: '-_id -createdAt -updatedAt' }
            ])
            .select('-__v -sellerId -status -createdAt -updatedAt')
            .lean(); // ✅ Convert Mongoose documents to plain JS objects

            
            

        // ✅ Apply filters after fetching
        properties = properties.filter(property => {
            const matchesPropertyType = !propertyType || property.propertyType === propertyType;
            const matchesTransactionType = !transactionType || property.transactionType === transactionType;
            

            const matchesPrice = (() => {
                if (!minPrice && !maxPrice) return true;
                const priceField = {
                    'Rent': 'rent',
                    'Sell': 'salePrice',
                    'PG': 'pgPrice'
                }[transactionType] || 'rent';

                const price = property.pricingDetails?.[priceField];
                return (
                    (!minPrice || price >= parseFloat(minPrice)) &&
                    (!maxPrice || price <= parseFloat(maxPrice))
                );
            })();
            

            const matchesLocation =
                (!city && !locality) ||
                (property.locationSchemaId &&
                    (state && property.locationSchemaId.state?.match(new RegExp(state, 'i')) ||
                     city && property.locationSchemaId.city?.match(new RegExp(city, 'i')) ||
                     locality && property.locationSchemaId.locality?.match(new RegExp(locality, 'i'))));

            return (
                matchesPropertyType &&
                matchesTransactionType &&
                matchesPrice &&
                matchesLocation
            );
        });

        // ✅ Pagination applied after filtering
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
            propertyApprovalNotificationTemplate(property.sellerId.sellerDetails.name, property.propertyTitle)
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
        const { page = 1, status = "active" } = req.query;
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
            Property.find({ sellerId: sellerId , status: 'active' })
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






export { createPropertyDetails,getPropertiesBySeller,getPropertiesBySellerIdAdmin,getSellerProperties, getProperties, aprooveProperty,deletePropertyByAdmin, deletePropertyBySeller, searchProperties, markPropertyAsSold, createLocationDetails, createPricingDetails, createAmenitiesDetails, createProperty, getProperty };

