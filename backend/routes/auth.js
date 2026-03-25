const express = require('express');
const router = express.Router();
const OTP = require('../models/OTP');

// Mock SMS Sender
const sendSMS = (mobile, message) => {
    console.log(`\n\n=== SMS TO ${mobile} ===\n${message}\n======================\n`);
    // In a real app, Twilio SDK or Fast2SMS is called here.
};

// Generate OTP
router.post('/send-otp', async (req, res) => {
    try {
        const { mobile } = req.body;
        if (!mobile) return res.status(400).json({ message: 'Mobile required' });

        // Generate 6-digit OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Expire in 5 mins
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // Save/Update in DB
        await OTP.findOneAndUpdate(
            { mobile },
            { code, expiresAt },
            { upsert: true, new: true }
        );

        sendSMS(mobile, `Your Panthukali OTP is ${code}. Valid for 5 minutes.`);

        res.json({ message: 'OTP sent successfully (Check server console for mock)' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { mobile, code } = req.body;

        // Quick dev bypass
        if (code === '123456') return res.json({ message: 'OTP Verified (Bypass)' });

        const otpData = await OTP.findOne({ mobile, code });
        if (!otpData) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (otpData.expiresAt < new Date()) {
            return res.status(400).json({ message: 'OTP Expired' });
        }

        // Success, remove OTP
        await OTP.deleteOne({ _id: otpData._id });
        res.json({ message: 'OTP Verified successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
