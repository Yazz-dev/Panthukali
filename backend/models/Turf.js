const mongoose = require('mongoose');

const TurfSchema = new mongoose.Schema({
    name: { type: String, required: true },
    district: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    mapLink: { type: String }, // optional iframe maps link
    images: [{ type: String }], // array of image urls
}, { timestamps: true });

module.exports = mongoose.model('Turf', TurfSchema);
