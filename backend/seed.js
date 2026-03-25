const mongoose = require('mongoose');
require('dotenv').config();
const Turf = require('./models/Turf');

const MOCK_TURFS = [
    { name: 'Green Arena', district: 'Ernakulam', address: 'Kaloor Stadia Road, Kochi', phone: '9876543210', pricePerHour: 1200, images: ["https://images.unsplash.com/photo-1543326727-cf6c39e0f111?w=1000&auto=format&fit=crop"] },
    { name: 'Playmakers Turf', district: 'Ernakulam', address: 'Edappally, Kochi', phone: '9876543211', pricePerHour: 1500, images: ["https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop"] },
    { name: 'Kozhikode Sports Hub', district: 'Kozhikode', address: 'Mavoor Road', phone: '9876543212', pricePerHour: 1000, images: ["https://images.unsplash.com/photo-1518605368461-1ee7e5436329?q=80&w=1000&auto=format&fit=crop"] },
    { name: 'Trivandrum Football Arena', district: 'Thiruvananthapuram', address: 'Kazhakootam', phone: '9876543213', pricePerHour: 1300, images: ["https://plus.unsplash.com/premium_photo-1661962360662-6c391d45bc90?w=1000&auto=format&fit=crop"] },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/panthukali');
        await Turf.deleteMany({});
        await Turf.insertMany(MOCK_TURFS);
        console.log('Database seeded with original turfs!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
