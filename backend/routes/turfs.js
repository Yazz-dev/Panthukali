const express = require('express');
const router = express.require('express').Router();
const Turf = require('../models/Turf');

// Get all turfs, optionally filter by district
router.get('/', async (req, res) => {
    try {
        const { district } = req.query;
        let query = {};
        if (district) {
            query.district = { $regex: new RegExp(`^${district}$`, 'i') };
        }
        const turfs = await Turf.find(query);
        res.json(turfs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single turf details
router.get('/:id', async (req, res) => {
    try {
        const turf = await Turf.findById(req.params.id);
        if (!turf) return res.status(404).json({ message: 'Turf not found' });
        res.json(turf);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
