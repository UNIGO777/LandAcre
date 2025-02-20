import mongoose from "mongoose";

// Common Property Schema
const PropertySchema = new mongoose.Schema({
  propertyType: {
    type: String,
    enum: [
      'Flat/Apartment', 'Independent House/Villa', 'Independent/Builder Floor', 'Plot/Land',
      '1 RK/Studio Apartment', 'Serviced Apartment', 'Farmhouse', 'Office', 'Retail', 'Comercial Plot/Land', 'Storage', 'Industry', 'Hospitality', 'others'
    ],
    required: true
  },
  transactionType: {
    type: String,
    enum: ['Sell', 'Rent', 'PG'],
    required: true
  },
  propertyTitle: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  locationSchemaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PropertyLocation',
    required: true
  },
  propertyDetailSchemaId: {
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    refType: {
      type: String,
      required: true
    },
  },
  amenitiesSchemaId: {
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    refType: {
      type: String,
      default: 'Amenities',
      required: true
    },
  },
  pricingDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pricing',
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  availableFrom: {
    type: Date,
    required: true
  },
  facingDirection: {
    type: String,
    enum: ['North', 'East', 'West', 'South'],
    required: true
  },
  propertyMedia: {
    photos: {
      type: [String], // Array of URLs for property photos
      required: false // Optional field for photos
    },
    video: {
      type: String, // Array of URLs for property videos
      required: false // Optional field for videos
    }
  },
  willingToRentOut: {
    type: String,
    enum: ['Family', 'Single Man', 'Single Woman'],
    required: function () {
      return this.transactionalType === 'Rent';
    }
  },
  availableFor: {
    type: String,
    enum: ['Girls', 'Boys', 'Any'],
    required: function () {
      return this.transactionalType === 'PG';
    }
  },
  suitableFor: {
    type: String,
    enum: ['Student', 'WorkingProfessionals'],
    required: function () {
      return this.transactionalType === 'PG';
    }
  },
  isCommercial: {
    type: Boolean,
    default: false,
    require: true
  },
  status: {
    type: String,
    enum: ['requested', 'active', 'sold', 'blocked'],
    required: true,
    default: 'requested'
  }

}, { timestamps: true });

const locationSchema = new mongoose.Schema({
  state:{
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  locality: {
    type: String,
    required: true
  },
  subLocality: {
    type: String
  },
  apartmentSociety: {
    type: String,
   
  },
  houseNo: {
    type: String,
  }
});

const flatApartmentSchema = new mongoose.Schema({
  floorNumber: {
    type: Number,
    required: true
  },
  totalFloors: {
    type: Number,
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  areaDetails: {
    carpetArea: {
      type: Number,
      required: true // Mandatory field for carpet area
    },
    builtUpArea: {
      type: Number,
    },
    superBuiltUpArea: {
      type: Number,
    },
    areaUnitForCarpet: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
      required: true
    },
    areaUnitForBuiltUp: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
    },
    areaUnitForSuperBuiltUp: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
    }
  },
  balconies: {
    type: Number,
    default: 0 // Number of balconies
  },
  otherRooms: {
    type: [String], // Array of other rooms like pooja room, study room, etc.
  },
  furnishing: {
    type: String,
    enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
    required: true
  },
  furnishingItems: {
    type: [String], // Array for furnishing items like 'Furnished', 'Semi-Furnished', 'Unfurnished'
  },
  reservedParking: {
    type: String,
    enum: ['Covered Parking', 'Open Parking', 'None'],
    required: true
  },
  availabilityStatus: {
    type: String,
    enum: ['Ready to Move', 'Under Construction'],
    required: true
  },
  propertyAge: {
    type: Number, // Age of the property in years
    required: true,
    default: 0
  }
});

const houseVilla = new mongoose.Schema({
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  balconies: {
    type: Number,
    default: 0
  },
  areaDetails: {
    plotArea: {
      type: Number,
      required: true // Mandatory field
    },
    carpetArea: {
      type: Number
    },
    builtUpArea: {
      type: Number
    },
    areaUnitForPlot: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
      required: true
    },
    areaUnitForCarpet: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
      default: 'sq.ft'
    },
    areaUnitForBuiltUp: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
      default: 'sq.ft'
    }
  },
  otherRooms: {
    type: [String] // Array for other room types like 'Pooja Room', 'Study Room', etc.
  },
  furnishing: {
    type: String,
    enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
    required: true
  },
  furnishingItems: {
    type: [String], // Array for furnishing items like 'Furnished', 'Semi-Furnished', 'Unfurnished'
  },
  reservedParking: {
    type: {
      type: String,
      enum: ['Covered', 'Open', 'none'],
      default: 'none'
    },
    count: {
      type: Number,
      default: 0 // Default count of reserved parking spaces
    },
  },
  totalFloors: {
    type: Number,
    required: true // Total number of floors in the property
  },
  availabilityStatus: {
    type: String,
    enum: ['Ready to Move', 'Under Construction'],
    required: true
  },
  propertyAge: {
    type: Number, // Age of the property in years
    required: true,
    default: 0
  },
});

const IndependentOrBuilderFloor = new mongoose.Schema({
  floorType: {
    type: String,
    enum: ['Independent', 'Builder Floor'],
    default: 'Independent',
    required: true // Mandatory field to specify the type of floor
  },
  totalFloors: {
    type: Number,
    required: true // Total number of floors in the building
  },
  propertyOnFloor: {
    type: Number,
    required: true // The specific floor number of the property
  },
  bedrooms: {
    type: Number,
    required: true // Number of bedrooms
  },
  bathrooms: {
    type: Number,
    required: true // Number of bathrooms
  },
  balconies: {
    type: Number,
    default: 0 // Default number of balconies
  },
  areaDetails: {
    carpetArea: {
      type: Number,
      required: true // Mandatory field for carpet area
    },
    builtUpArea: {
      type: Number,
    },
    superBuiltUpArea: {
      type: Number,
    },
    areaUnitForCarpet: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
      required: true
    },
    areaUnitForBuiltUp: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
    },
    areaUnitForSuperBuiltUp: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
    }
  },
  otherRooms: {
    type: [String] // Array for other room types like 'Pooja Room', 'Study Room', etc.
  },
  furnishing: {
    type: String,
    enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
    required: true
  },
  furnishingItems: {
    type: [String], // Array for furnishing items like 'Furnished', 'Semi-Furnished', 'Unfurnished'
  },
  reservedParking: [{
    type: {
      type: String,
      enum: ['Covered', 'Open', 'none'],
      default: 'none'
    },
    count: {
      type: Number,
      default: 0 // Default count of reserved parking spaces
    }
  }],
  availabilityStatus: {
    type: String,
    enum: ['Ready to Move', 'Under Construction'],
    required: true
  },
});

const LandPlot = new mongoose.Schema({
  areaDetails: {
    plotArea: {
      type: Number,
      required: true // Mandatory field
    },
    areaUnitForPlot: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
      required: true
    },
  },
  lengthOfPlot: {
    type: Number,
  },
  breadthOfPlot: {
    type: Number,
  },
  floorsAllowed: {
    type: Number,
  },
  boundaryWall: {
    type: Boolean,
    required: true // Indicates if there is a boundary wall around the property
  },
  openSides: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5],
    required: true
  },
  constructionDone: {
    type: Boolean,
    required: true // Indicates if any construction has been done on the property
  },
  possessionDate: {
    type: Date,
    required: true, // Mandatory field for possession date
  },
});

const RkStudioApartment = new mongoose.Schema({
  bedrooms: {
    type: Number,
    required: true // Mandatory field for number of bedrooms
  },
  bathrooms: {
    type: Number,
    required: true // Mandatory field for number of bathrooms
  },
  balconies: {
    type: Number,
    default: 0 // Default number of balconies
  },
  areaDetails: {
    carpetArea: {
      type: Number,
      required: true // Mandatory field for carpet area
    },
    builtUpArea: {
      type: Number,
    },
    superBuiltUpArea: {
      type: Number,
    },
    areaUnitForCarpet: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
      required: true
    },
    areaUnitForBuiltUp: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
    },
    areaUnitForSuperBuiltUp: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
    }
  },
  furnishing: {
    type: String,
    enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
    required: true
  },
  furnishingItems: {
    type: [String], // Array for furnishing items like 'Furnished', 'Semi-Furnished', 'Unfurnished'
  },
  reservedParking: [{
    type: {
      type: String,
      enum: ['Covered', 'Open', 'none'],
      default: 'none'
    },
    count: {
      type: Number,
      default: 0 // Default count of reserved parking spaces
    }
  }],
  availabilityStatus: {
    type: String,
    enum: ['Ready to Move', 'Under Construction'],
    required: true
  },
  floorNumber: {
    type: Number,
    required: true
  },
  totalFloors: {
    type: Number,
    required: true
  },
  propertyAge: {
    type: Number, // Age of the property in years
    required: true,
    default: 0
  },
});

const ServicedApartment = new mongoose.Schema({
  bedrooms: {
    type: Number,
    required: true // Number of bedrooms
  },
  bathrooms: {
    type: Number,
    required: true // Number of bathrooms
  },
  balconies: {
    type: Number,
    default: 0 // Default number of balconies
  },
  areaDetails: {
    carpetArea: {
      type: Number,
      required: true // Mandatory field for carpet area
    },
    builtUpArea: {
      type: Number,
    },
    superBuiltUpArea: {
      type: Number,
    },
    areaUnitForCarpet: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
      required: true
    },
    areaUnitForBuiltUp: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
    },
    areaUnitForSuperBuiltUp: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
    }
  },
  otherRooms: {
    type: [String], // Array for other room types like 'Pooja Room', 'Study Room', etc.
  },
  furnishing: {
    type: String,
    enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
    required: true
  },
  furnishingItems: {
    type: [String], // Array for furnishing items like 'Furnished', 'Semi-Furnished', 'Unfurnished'
  },
  reservedParking: {
    type: String,
    enum: ['Covered Parking', 'Open Parking', 'None'],
    required: true
  },
  availabilityStatus: {
    type: String,
    enum: ['Ready to Move', 'Under Construction'],
    required: true
  },
  floorNumber: {
    type: Number,
    required: true
  },
  totalFloors: {
    type: Number,
    required: true
  },
  propertyAge: {
    type: Number, // Age of the property in years
    required: true,
    default: 0
  },
});

const FarmhouseDetail = new mongoose.Schema({
  bedrooms: {
    type: Number,
    required: true // Number of bedrooms
  },
  bathrooms: {
    type: Number,
    required: true // Number of bathrooms
  },
  balconies: {
    type: Number,
    default: 0 // Default number of balconies
  },
  areaDetails: {
    carpetArea: {
      type: Number,
      required: true // Mandatory field for carpet area
    },
    plotArea: {
      type: Number,
      required: true // Mandatory field for carpet area
    },
    builtUpArea: {
      type: Number,
    },
    areaUnitForPlot: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
      required: true
    },
    areaUnitForCarpet: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
      required: true
    },
    areaUnitForBuiltUp: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
    },
  },
  otherRooms: {
    type: [String], // Array for other room types like 'Pooja Room', 'Study Room', etc.
  },
  furnishing: {
    type: String,
    enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
    required: true
  },
  furnishingItems: {
    type: [String], // Array for furnishing items like 'Furnished', 'Semi-Furnished', 'Unfurnished'
  },
  reservedParking: {
    type: String,
    enum: ['Covered Parking', 'Open Parking', 'None'],
    required: true
  },
  availabilityStatus: {
    type: String,
    enum: ['Ready to Move', 'Under Construction'],
    required: true
  },
  floorNumber: {
    type: Number,
    required: true
  },
  totalFloors: {
    type: Number,
    required: true
  },
  propertyAge: {
    type: Number, // Age of the property in years
    required: true,
    default: 0
  },
});

const Office = new mongoose.Schema({
  WhatKindOfOfficeIsit: {
    type: String,
    enum: ['Ready to move office space', 'Bare shell office space', 'Co-working office space'],
    required: true
  },
  areaDetails: {
    carpetArea: {
      type: Number,
      required: true // Mandatory field for carpet area
    },
    superBuiltUpArea: {
      type: Number,
    },
    areaUnitForCarpet: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
      required: true

    },
    areaUnitForSuperBuiltUp: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
    }
  },
  constructionStatus: {
    type: String,
    enum: ['No walls', 'Brick walls', 'Cemented walls', 'Plastered walls'],
    required: function () {
      return this.WhatKindOfOfficeIsit === 'Bare shell office space';
    }
  },
  doorsConstructed: {
    type: String,
    enum: ['Yes', 'No'],
    required: function () {
      return this.WhatKindOfOfficeIsit === 'Bare shell office space';
    }
  },
  officeSetup: {
    minSeats: {
      type: Number,
      required: function () {
        return this.WhatKindOfOfficeIsit === 'Bare shell office space' || this.WhatKindOfOfficeIsit === 'Ready to move office space';
      }  // Minimum number of seats
    },
    maxSeats: {
      type: Number // Maximum number of seats (optional)
    },
    cabins: {
      type: Number,
      required: function () {
        return this.WhatKindOfOfficeIsit === 'Bare shell office space' || this.WhatKindOfOfficeIsit === 'Ready to move office space';
      }  // Number of meeting rooms
    },
    meetingRooms: {
      type: Number,
      required: function () {
        return this.WhatKindOfOfficeIsit === 'Bare shell office space' || this.WhatKindOfOfficeIsit === 'Ready to move office space';
      }  // Number of meeting rooms
    },
    washrooms: {
      type: String,
      enum: ['Available', 'Not Available'], // Availability of washrooms
      required: function () {
        return this.WhatKindOfOfficeIsit === 'Bare shell office space' || this.WhatKindOfOfficeIsit === 'Ready to move office space';
      }
    },
    conferenceRoom: {
      type: String,
      enum: ['Available', 'Not Available'], // Availability of conference room
      required: function () {
        return this.WhatKindOfOfficeIsit === 'Bare shell office space' || this.WhatKindOfOfficeIsit === 'Ready to move office space';
      }
    },
    receptionArea: {
      type: String,
      enum: ['Available', 'Not Available'], // Availability of reception area
      required: function () {
        return this.WhatKindOfOfficeIsit === 'Bare shell office space' || this.WhatKindOfOfficeIsit === 'Ready to move office space';
      }
    },
    pantryType: {
      type: String,
      enum: ['Shared', 'Private', 'Not Available'], // Type of pantry
      required: function () {
        return this.WhatKindOfOfficeIsit === 'Bare shell office space' || this.WhatKindOfOfficeIsit === 'Ready to move office space';
      }
    }
  },
  fireSafetyMeasures: {
    type: [String],
    enum: ['Fire Extinguisher', 'Fire Sensors', 'Sprinklers', 'Fire Hose'], // Fire safety measures available
    required: function () {
      return this.WhatKindOfOfficeIsit === 'Bare shell office space' || this.WhatKindOfOfficeIsit === 'Ready to move office space';
    }
  },
  totalFloors: {
    type: Number,
    required: function () {
      return this.WhatKindOfOfficeIsit === 'Bare shell office space' || this.WhatKindOfOfficeIsit === 'Ready to move office space';
    }  // Total number of floors in the building
  },
  occupiedFloors: {
    type: [Number], // Array to specify the floors occupied by the office space
    required: function () {
      return this.WhatKindOfOfficeIsit === 'Bare shell office space' || this.WhatKindOfOfficeIsit === 'Ready to move office space';
    }
  },
  staircases: {
    type: Number,
    enum: [1, 2, 3, 4], // Number of staircases available
    required: false
  },
  lifts: {
    type: String,
    enum: ['Available', 'Not Available'], // Availability of lifts
    required: function () {
      return this.WhatKindOfOfficeIsit === 'Bare shell office space' || this.WhatKindOfOfficeIsit === 'Ready to move office space';
    }
  },
  parking: {
    type: String,
    enum: ['Available', 'Not Available'], // Availability of parking
    required: function () {
      return this.WhatKindOfOfficeIsit === 'Bare shell office space' || this.WhatKindOfOfficeIsit === 'Ready to move office space';
    }
  },
  availabilityStatus: {
    type: String,
    enum: ['Ready to Move', 'Under Construction'], // Status of availability
    required: true
  },
  facilities: [String]
})


const Retail = new mongoose.Schema({
  retailType: {
    type: String,
    enum: ['Commercial Shops', 'Commercial Showrooms'], // Types of retail spaces
    required: true
  },
  locationType: {
    type: String,
    enum: ['Mall', 'Commercial Project', 'Residential Project', 'Retail Complex/Building', 'Market / High Street', 'Others'], // Locations for the retail space
    required: true
  },
  otherLocationName: {
    type: String,
    required: function () {
      return this.locationType === 'Others'; // Required if location type is 'Others'
    }
  },
  areaDetails: {
    carpetArea: {
      type: Number,

    },
    plotArea: {
      type: Number,
      required: true // Mandatory field for plot area
    },
    builtUpArea: {
      type: Number,
    },
    areaUnitForCarpet: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
    },
    areaUnitForPlot: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
      required: true
    },
    areaUnitForBuiltUp: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
    }
  },
  entranceWidth: {
    type: Number,

  },
  ceilingHeight: {
    type: Number,
  },
  totalFloors: {
    type: Number,
    required: true // Total number of floors in the building
  },
  propertyOnFloor: {
    type: Number,
    required: true // Property's floor number
  },
  washrooms: {
    type: [String],
    enum: ['Private washrooms', 'Public washrooms', 'Not Available'], // Types of washrooms available
    default: 'Not Available'
  },
  parkingType: {
    type: String,
    enum: ['Private Parking', 'Public Parking', 'Multilevel Parking', 'Not Available'], // Types of parking available
    default: 'Not Available'
  },
  availabilityStatus: {
    type: String,
    enum: ['Ready to move', 'Under construction'], // Status of availability
    required: true
  },
  suitableForBusinessTypes: {
    type: [String], // Array for suitable business types
  }
})

const CommercialPlotLand = new mongoose.Schema({
  PlotLandType: {
    type: String,
    enum: ['Commercial Land/Inst. Land', 'Agricultural/Farm Land', 'Industrial Lands/Plots'], // Types of retail spaces
    required: true
  },
  areaDetails: {
    plotArea: {
      type: Number,
      required: true // Mandatory field
    },
    areaUnitForPlot: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
      required: true
    },
  },
  lengthOfPlot: {
    type: Number,
    required: true // Length of the plot in feet
  },
  breadthOfPlot: {
    type: Number,
    required: true // Breadth of the plot in feet
  },
  widthOfFacingRoad: {
    type: Number,
    required: true // Width of the facing road in feet
  },
  numberOfOpenSides: {
    type: Number,
    enum: [1, 2, 3], // Number of open sides
    required: true
  },
  constructionStatus: {
    type: String,
    enum: ['Yes', 'No'], // Indicates if any construction has been done
    required: true
  },
  propertyFacing: {
    type: String,
    enum: ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'], // Directions property is facing
    required: true
  },
  possessionBy: {
    type: Date,
    required: true // Expected possession details
  }
})


const Storage = new mongoose.Schema({
  StorageType: {
    type: String,
    enum: ['Ware House', 'Cold Storage'], // Types of retail spaces
    required: true
  },
  areaDetails: {
    carpetArea: {
      type: Number,

    },
    plotArea: {
      type: Number,
      required: true // Mandatory field for plot area
    },
    builtUpArea: {
      type: Number,
    },
    areaUnitForCarpet: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],

    },
    areaUnitForPlot: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
      required: true
    },
    areaUnitForBuiltUp: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
    }
  },
  washrooms: {
    type: String,
    enum: ['Available', 'Not Available'], // Availability of washrooms
    default: 'Not Available',
    require: true
  },
  availabilityStatus: {
    type: String,
    enum: ['Ready to move', 'Under construction'], // Availability of the storage unit
    required: true
  },


})


const Industry = new mongoose.Schema({
  IndustryType: {
    type: String,
    enum: ['Factory', 'Manufacturing'], // Types of retail spaces
    required: true
  },
  areaDetails: {
    carpetArea: {
      type: Number,

    },
    plotArea: {
      type: Number,
      required: true // Mandatory field for plot area
    },
    builtUpArea: {
      type: Number,
    },
    areaUnitForCarpet: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],

    },
    areaUnitForPlot: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
      required: true
    },
    areaUnitForBuiltUp: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
    }
  },
  washrooms: {
    type: String,
    enum: ['Available', 'Not Available'], // Availability of washrooms
    default: 'Not Available',
    require: true
  },
  availabilityStatus: {
    type: String,
    enum: ['Ready to move', 'Under construction'], // Availability of the storage unit
    required: true
  },
})

const Hospitality = new mongoose.Schema({
  HospitalityType: {
    type: String,
    enum: ['Hotel/Resorts', 'Guest-House/Banquet-Halls'], // Types of retail spaces
    required: true
  },
  totalRooms: {
    type: Number,
    required: true // Mandatory field for total number of rooms
  },
  washrooms: {
    type: Number,
    enum: [0, 1, 2, 3, 4], // Number of washrooms available
    required: true // Mandatory field for washroom count
  },
  balconies: {
    type: Number,
    min: 0,
    max: 10, // Assuming a maximum of 10 balconies
    required: true // Mandatory field for balcony count
  },
  areaDetails: {
    carpetArea: {
      type: Number,

    },
    plotArea: {
      type: Number,
      required: true // Mandatory field for plot area
    },
    builtUpArea: {
      type: Number,
    },
    areaUnitForCarpet: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],

    },
    areaUnitForPlot: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
      required: true
    },
    areaUnitForBuiltUp: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
    }
  },
  otherRooms: {
    type: [String], // Array for other room types like 'Pooja Room', 'Study Room', etc.
  },
  furnishing: {
    type: String,
    enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
    required: true // Mandatory field for furnishing status
  },
  furnishingItems: {
    type: [String], // Array for furnishing items like 'Furnished', 'Semi-Furnished', 'Unfurnished'
  },
  availabilityStatus: {
    type: String,
    enum: ['Ready to move', 'Under construction'], // Availability status of the property
    required: true // Mandatory field for availability status
  },
  qualityRating: {
    type: Number,
    min: 0,
    max: 7, // Rating scale from 0 to 7
    required: false // Optional field for quality rating
  }
})

const OthersProperties = new mongoose.Schema({
  areaDetails: {
    plotArea: {
      type: Number,
      required: true // Mandatory field for plot area
    },
    areaUnitForPlot: {
      type: String,
      enum: ['sq.ft', 'sq.yards', 'sq.m.', 'acres', 'marla', 'cents', 'bigha', 'kottah', 'kanal', 'grounds', 'ares', 'biswa', 'guntha', 'aankadam', 'hectares', 'rood', 'chataks', 'perch'],
      required: true
    },
  },
  otherRooms: {
    type: [String], // Array for other room types like 'Pooja Room', 'Study Room', 'Servant Room', 'Store Room'
  },
  totalFloors: {
    type: Number,
  },
  propertyOnFloor: {
    type: Number,
   
  },
  availabilityStatus: {
    type: String,
    enum: ['Ready to move', 'Under construction'], // Availability status of the property
    required: true // Mandatory field for availability status
  }
})

















const amenitiesSchema = new mongoose.Schema({
  commonAmenities: [String], // Common amenities (e.g., Parking, Security)
  residentialAmenities: [String], // Specific to Residential properties
  commercialAmenities: [String], // Specific to Office/Retail spaces
  industrialAmenities: [String], // Specific to Warehouses/Factories
  hospitalityAmenities: [String] // Specific to Hotels/Resorts/Guest Houses
});


const pricingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Sell', 'Rent', 'PG'],
    required: true
  },
  rent: {
    type: Number, // Monthly rent amount
    required: function () { return this.type === 'Rent'; }
  },
  salePrice: {
    type: Number, // Sale price of the property
    required: function () { return this.type === 'Sell'; }
  },
  pgPrice: {
    type: Number, // Price for paying guest accommodation
    required: function () { return this.type === 'PG'; }
  },
});




const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);
const Location = mongoose.models.PropertyLocation || mongoose.model('PropertyLocation', locationSchema);
const FlatApartment = mongoose.models.FlatApartment || mongoose.model('FlatApartment', flatApartmentSchema);
const Amenities = mongoose.models.Amenities || mongoose.model('Amenities', amenitiesSchema);
const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', pricingSchema);

const HouseVilla = mongoose.models.HouseVilla || mongoose.model('HouseVilla', houseVilla);
const office = mongoose.models.Office || mongoose.model('Office', Office);
const independentOrBuilderFloor = mongoose.models.IndependentOrBuilderFloor || mongoose.model('IndependentOrBuilderFloor', IndependentOrBuilderFloor);
const StudioApartment = mongoose.models.StudioApartment || mongoose.model('StudioApartment', RkStudioApartment);
const servicedApartment = mongoose.models.ServicedApartment || mongoose.model('ServicedApartment', ServicedApartment);
const RetailShop = mongoose.models.RetailShop || mongoose.model('RetailShop', Retail);
const Farmhouse = mongoose.models.Farmhouse || mongoose.model('Farmhouse', FarmhouseDetail);
const PlotLand = mongoose.models.PlotLand || mongoose.model('PlotLand', LandPlot);
const commercialPlotLand = mongoose.models.commercialPlotLand || mongoose.model('commercialPlotLand', CommercialPlotLand);
const storage = mongoose.models.Storage || mongoose.model('Storage', Storage);
const industry = mongoose.models.Industry || mongoose.model('Industry', Industry);
const hospitality = mongoose.models.Hospitality || mongoose.model('Hospitality', Hospitality);
const othersProperties = mongoose.models.OthersProperties || mongoose.model('OthersProperties', OthersProperties);

export { Property, FlatApartment, HouseVilla, Location, StudioApartment, Amenities, RetailShop,office, Farmhouse, PlotLand, Pricing,independentOrBuilderFloor , servicedApartment,commercialPlotLand,storage,industry,hospitality,othersProperties};
