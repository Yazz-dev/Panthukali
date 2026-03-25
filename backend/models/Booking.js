const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    bookingId: { type: String, required: true, unique: true }, // e.g., PK10234
    turfId: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
    userName: { type: String, required: true },
    mobile: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    timeSlot: { type: String, required: true }, // '06:00 PM - 07:00 PM'
    status: { type: String, enum: ['PENDING', 'CONFIRMED', 'CANCELLED'], default: 'PENDING' },
    amountPaid: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
