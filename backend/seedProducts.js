const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');
const Business = require('./models/Business');

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for 12-business product seeding...');

        await Product.deleteMany({});
        console.log('Existing products cleared.');

        const businesses = await Business.find({});
        const products = [];

        const productTemplates = [
            {
                name: 'Marine Plywood 18mm',
                cat: 'Wood & Board Materials',
                brand: 'CenturyPly',
                price: 95,
                mrp: 120,
                unit: 'Sq Ft',
                desc: 'Premium BWP Grade Marine Plywood with 18mm thickness.',
                longDesc: 'CenturyPly Marine Plywood is a specialized product designed specifically for marine applications and areas prone to high moisture. It is made from high-quality hardwood veneers and bonded with superior BWP grade resin.',
                usage: ['Furniture', 'Kitchen Cabinets', 'Marine Use', 'Partition Walls'],
                water: true, fire: false, durability: 20, certs: ['ISI', 'ISO 9001'], warranty: '10 Years',
                specs: { thickness: '18mm', size: '8x4 ft', grade: 'BWP', material: 'Hardwood' },
                img: 'https://images.unsplash.com/photo-1596464534244-8946f1a4413b?auto=format&fit=crop&q=80&w=800'
            },
            {
                name: 'Copper Wire 1.5mm',
                cat: 'Electrical Materials',
                brand: 'Havells',
                price: 1240,
                mrp: 1550,
                unit: 'Coil',
                desc: 'Flame retardant 1.5mm copper wire for house wiring.',
                longDesc: 'Havells Life Line Plus S3 FR-LSH wires are the best in class electrical wires. These wires come with a higher degree of safety and reliability, ensuring complete peace of mind for your home electrical systems.',
                usage: ['House Wiring', 'Indoor Electrical', 'Conduits'],
                water: false, fire: true, durability: 25, certs: ['ISI', 'BIS'], warranty: 'Lifetime',
                specs: { gauge: '1.5mm', length: '90m', voltage: '1100V', material: 'Copper' },
                img: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800'
            },
            {
                name: 'SWR PVC Pipe 110mm',
                cat: 'Plumbing & Sanitary Materials',
                brand: 'Supreme',
                price: 850,
                mrp: 1100,
                unit: 'Meter',
                desc: '110mm SWR PVC pipe for drainage systems.',
                longDesc: 'Supreme SWR pipes are specifically designed for soil, waste and rain water drainage systems. These pipes are lightweight, corrosion resistant and highly durable for long-term underground use.',
                usage: ['Drainage', 'Waste Management', 'Rainwater Harvesting'],
                water: true, fire: false, durability: 30, certs: ['ISI'], warranty: '5 Years',
                specs: { diameter: '110mm', length: '3m', material: 'PVC', type: 'SWR' },
                img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800'
            },
            {
                name: 'Vitrified Tiles 2x2',
                cat: 'Flooring & Wall Materials',
                brand: 'Kajaria',
                price: 950,
                mrp: 1200,
                unit: 'Box',
                desc: 'Premium 2x2 vitrified floor tiles with glossy finish.',
                longDesc: 'Kajaria Vitrified Tiles are manufactured using high-quality raw materials and advanced technology. These tiles offer extreme durability, low maintenance, and a sophisticated aesthetic upgrade to any floor.',
                usage: ['Living Room', 'Office Flooring', 'Indoor'],
                water: true, fire: false, durability: 15, certs: ['ISO 9001'], warranty: '5 Years',
                specs: { size: '600x600mm', material: 'Vitrified', finish: 'Glossy', coverage: '1.44 sq mt/box' },
                img: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?auto=format&fit=crop&q=80&w=800'
            },
            {
                name: 'Interior Emulsion 20L',
                cat: 'Finishing Materials',
                brand: 'Asian Paints',
                price: 6900,
                mrp: 7500,
                unit: 'Litre',
                desc: 'Royal Luxury Emulsion for smooth interior walls.',
                longDesc: 'Asian Paints Royale Luxury Emulsion is a high-quality interior wall paint that provides a soft sheen and a smooth finish. It is scrub-resistant and provides excellent washability for long-lasting fresh looks.',
                usage: ['Interior Walls', 'Ceilings'],
                water: true, fire: false, durability: 7, certs: ['Green Seal'], warranty: '3 Years',
                specs: { volume: '20L', finish: 'Soft Sheen', coverage: '140-160 sq ft/L', washability: 'High' },
                img: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=800'
            },
            {
                name: 'Mortise Lock Set',
                cat: 'Hardware & Fixtures',
                brand: 'Godrej',
                price: 2800,
                mrp: 3500,
                unit: 'Piece',
                desc: 'High-security mortise lock with dual-stage locking.',
                longDesc: 'The Godrej Mortise Lock provides superior security and elegant design for main doors and bedroom doors. Made from premium brass and steel components for maximum durability.',
                usage: ['Doors', 'Main Entrance', 'Security'],
                water: false, fire: false, durability: 50, certs: ['ISI'], warranty: '15 Years',
                specs: { material: 'Brass/Steel', type: 'Mortise', securityLevel: 'High' },
                img: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=800'
            },
            {
                name: 'Smart Video Doorbell',
                cat: 'Smart Home Devices',
                brand: 'Arlo',
                price: 15000,
                mrp: 18000,
                unit: 'Piece',
                desc: 'HD Video doorbell with two-way audio and night vision.',
                longDesc: 'The Arlo Essential Video Doorbell captures what other doorbells miss. Get notified when motion is detected and see who is at your door from anywhere with real-time video.',
                usage: ['Entrance', 'Security', 'Smart Home'],
                water: true, fire: false, durability: 5, certs: ['CE', 'RoHS'], warranty: '1 Year',
                specs: { resolution: '1080p', connectivity: 'WiFi', fieldOfView: '180 deg' },
                img: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800'
            }
        ];

        businesses.forEach((biz, index) => {
            const template = productTemplates[index % productTemplates.length];
            products.push({
                productName: template.name,
                category: template.cat,
                brand: template.brand,
                actualPrice: template.mrp,
                sellingPrice: template.price,
                stock: 100,
                description: template.desc,
                longDescription: template.longDesc,
                unitType: template.unit,
                usage: template.usage,
                isWaterResistant: template.water,
                isFireResistant: template.fire,
                durabilityYears: template.durability,
                certifications: template.certs,
                warranty: template.warranty,
                specifications: template.specs,
                businessId: biz._id,
                images: [template.img],
                approvalStatus: 'approved'
            });
        });

        await Product.insertMany(products);
        console.log(`✅ Successfully added ${products.length} products (1 per business)!`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
