// routes/events.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');  // your mongoose model

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
