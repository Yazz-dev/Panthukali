const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    mobile: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

// Automatically delete expired documents (TTL index)
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OTP', OTPSchema);
