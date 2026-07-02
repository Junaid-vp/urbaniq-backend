import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from '../src/modules/property/property.model';
import Visit from '../src/modules/interaction/visit.model';
import Offer from '../src/modules/interaction/offer.model';
import Inquiry from '../src/modules/interaction/inquiry.model';
import User from '../src/modules/user/user.model';

dotenv.config();

const imagesByType = {
  Villa: [
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80",
    "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1600&q=80"
  ],
  Apartment: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80",
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80",
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1600&q=80"
  ],
  Penthouse: [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1600&q=80",
    "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=1600&q=80",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1600&q=80"
  ],
  Commercial: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
    "https://images.unsplash.com/photo-1416949929422-a1d9c20d4ba1?w=1600&q=80",
    "https://images.unsplash.com/photo-1556817411-31ae72fa3ea8?w=1600&q=80",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600&q=80",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=80"
  ],
  Townhouse: [
    "https://images.unsplash.com/photo-1600585154526-990dced4ea0d?w=1600&q=80",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1600&q=80",
    "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=1600&q=80"
  ],
  Land: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80",
    "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1600&q=80",
    "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1600&q=80"
  ]
};

const cities = ['New York', 'Los Angeles', 'Chicago', 'Miami', 'San Francisco', 'Austin', 'Seattle', 'Boston', 'Denver', 'Nashville'];
const states = ['NY', 'CA', 'IL', 'FL', 'CA', 'TX', 'WA', 'MA', 'CO', 'TN'];
const propertyTypes = ['Villa', 'Apartment', 'Penthouse', 'Commercial', 'Townhouse', 'Land'];
const furnishingStatus = ['Furnished', 'Semi-Furnished', 'Unfurnished'];

const residentialAmenities = ['Pool', 'Gym', 'Parking', 'Security', 'Balcony', 'Garden', 'Smart Home', 'Elevator', 'Spa', 'Playground'];
const commercialAmenities = ['Parking', 'Security', 'Elevator', 'High-speed Internet', 'Conference Room', 'Cafeteria', 'Reception'];
const landAmenities = ['Road Access', 'Water Supply', 'Electricity', 'Fenced'];

function randomArrayElement(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomMultipleElements(arr: any[], count: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const seedProperties = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to DB...');

    // Clear existing data
    console.log('Clearing old properties and interactions...');
    await Property.deleteMany({});
    await Visit.deleteMany({});
    await Offer.deleteMany({});
    await Inquiry.deleteMany({});

    // Fetch owners and agents to assign
    const owners = await User.find({ role: 'Owner' });
    const agents = await User.find({ role: 'Agent' });

    if (owners.length === 0) {
      console.log('No owners found. Please register at least one owner account first.');
      process.exit(1);
    }

    const properties = [];
    const TOTAL_PROPERTIES = 40; // Seeding 40 properties to ensure a good mix

    for (let i = 0; i < TOTAL_PROPERTIES; i++) {
      const cityIndex = randomInt(0, cities.length - 1);
      
      // Ensure we get a good mix by cycling through types
      const propType = propertyTypes[i % propertyTypes.length]; 
      
      const isCommercial = propType === 'Commercial';
      const isLand = propType === 'Land';
      const isResidential = !isCommercial && !isLand;

      let price, area, zoning, amenities, furnishing, bedrooms, bathrooms;

      if (isLand) {
        price = randomInt(150000, 2000000);
        area = randomInt(5000, 100000);
        zoning = randomArrayElement(['Agricultural', 'Residential', 'Commercial', 'Industrial']);
        amenities = randomMultipleElements(landAmenities, randomInt(1, 3));
        furnishing = undefined;
        bedrooms = undefined;
        bathrooms = undefined;
      } else if (isCommercial) {
        price = randomInt(800000, 15000000);
        area = randomInt(2000, 25000);
        zoning = 'Commercial';
        amenities = randomMultipleElements(commercialAmenities, randomInt(3, 6));
        furnishing = randomArrayElement(furnishingStatus);
        bedrooms = undefined;
        bathrooms = randomInt(1, 6);
      } else {
        // Residential
        price = randomInt(350000, 6000000);
        area = randomInt(800, 8000);
        zoning = 'Residential';
        amenities = randomMultipleElements(residentialAmenities, randomInt(4, 8));
        furnishing = randomArrayElement(furnishingStatus);
        bedrooms = randomInt(1, 6);
        bathrooms = randomInt(1, 5);
      }
      
      const p = {
        title: `${propType === 'Land' ? 'Prime Development' : 'Luxury'} ${propType} in ${cities[cityIndex]}`,
        description: isLand 
          ? `Exceptional parcel of land located in a highly desirable area of ${cities[cityIndex]}. Perfect for development or investment. Features excellent access and great potential.`
          : `Experience the finest urban living in this beautifully appointed ${propType.toLowerCase()}. Featuring modern finishes, expansive views, and unparalleled amenities right in the heart of ${cities[cityIndex]}.`,
        price,
        location: {
          address: `${randomInt(100, 9999)} ${randomArrayElement(['Main St', 'Ocean Ave', 'Park Blvd', 'Sunset Dr', 'Highland Way', 'Valley Rd'])}`,
          city: cities[cityIndex],
          state: states[cityIndex],
          zipCode: `${randomInt(10000, 99999)}`,
        },
        features: {
          area,
          bedrooms,
          bathrooms,
          furnishing,
          zoning,
          suitableFor: isCommercial ? ['Office', 'Retail', 'Restaurant'] : undefined
        },
        amenities,
        images: randomMultipleElements(imagesByType[propType as keyof typeof imagesByType], 3),
        documents: [],
        status: 'Published',
        propertyType: propType,
        ownerId: randomArrayElement(owners)._id,
        agentId: agents.length > 0 ? (Math.random() > 0.4 ? randomArrayElement(agents)._id : undefined) : undefined,
        views: randomInt(50, 8500)
      };
      
      properties.push(p);
    }

    await Property.insertMany(properties);
    console.log(`Successfully seeded ${properties.length} diverse properties!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding properties:', error);
    process.exit(1);
  }
};

seedProperties();
