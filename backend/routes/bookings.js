const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Create new booking (After OTP verification ideally, or mark as PENDING)
router.post('/', async (req, res) => {
    try {
        const { turfId, userName, mobile, date, timeSlot, amountPaid } = req.body;

        // Check for double booking
        const existing = await Booking.findOne({ turfId, date, timeSlot, status: 'CONFIRMED' });
        if (existing) {
            return res.status(400).json({ message: 'Slot already booked!' });
        }

        const bookingId = `PK${Math.floor(10000 + Math.random() * 90000)}`;
        const booking = new Booking({
            bookingId, turfId, userName, mobile, date, timeSlot, amountPaid, status: 'CONFIRMED'
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get bookings (Admin/Profile)
router.get('/', async (req, res) => {
    try {
        const { mobile } = req.query;
        let query = {};
        if (mobile) query.mobile = mobile;

        const bookings = await Booking.find(query).populate('turfId', 'name district').sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
