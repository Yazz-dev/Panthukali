require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Turf = require('./models/Turf');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route for testing
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Panthukali Backend is running!' });
});

// Routes
app.use('/api/turfs', require('./routes/turfs'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/auth', require('./routes/auth'));

// Seed MOCK DATA
const MOCK_TURFS = [
    { name: 'Green Arena', district: 'Ernakulam', address: 'Kaloor Stadia Road, Kochi', phone: '9876543210', pricePerHour: 1200, images: ["https://images.unsplash.com/photo-1543326727-cf6c39e0f111?w=1000&auto=format&fit=crop"] },
    { name: 'Playmakers Turf', district: 'Ernakulam', address: 'Edappally, Kochi', phone: '9876543211', pricePerHour: 1500, images: ["https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop"] },
    { name: 'Kozhikode Sports Hub', district: 'Kozhikode', address: 'Mavoor Road', phone: '9876543212', pricePerHour: 1000, images: ["https://images.unsplash.com/photo-1518605368461-1ee7e5436329?q=80&w=1000&auto=format&fit=crop"] },
    { name: 'Trivandrum Football Arena', district: 'Thiruvananthapuram', address: 'Kazhakootam', phone: '9876543213', pricePerHour: 1300, images: ["https://plus.unsplash.com/premium_photo-1661962360662-6c391d45bc90?w=1000&auto=format&fit=crop"] },
];

const connectDB = async () => {
    try {
        let mongoUri = process.env.MONGO_URI;

        // Use in-memory DB since local connection failed earlier
        const mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();
        console.log(`Using In-Memory MongoDB at ${mongoUri}`);

        await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected successfully!`);

        // Seed DB
        await Turf.deleteMany({});
        await Turf.insertMany(MOCK_TURFS);
        console.log('In-Memory DB Seeded with mock Turfs.');

        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

connectDB();
