const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');
const Booking = require('../models/Booking');
const generateTicketPDF = require('../utils/generateTicketPDF');

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

router.get('/user/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const bookings = await Booking.find({ userEmail: email }).populate('eventId');
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

router.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  try {
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error('Order creation failed:', err.message);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

router.get('/:id', async (req, res) => {
  const bookingId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res.status(400).json({ message: 'Invalid booking ID format' });
  }

  try {
    const booking = await Booking.findById(bookingId).populate('eventId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    console.error('Booking fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/confirm', async (req, res) => {
  const {
    eventId,
    userEmail,
    amount,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
  } = req.body;

  if (!eventId || !userEmail || !amount || !razorpay_payment_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const booking = new Booking({
      eventId,
      userEmail,
      amount,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    });

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id).populate('eventId');

    const pdfPath = await generateTicketPDF(populatedBooking, populatedBooking.eventId);

    const msg = {
      to: booking.userEmail,
      from: 'anivesh1024pathak@gmail.com', 
      subject: 'Your Event Ticket',
      text: `Thank you for booking. Your ticket is attached as a PDF.`,
      attachments: [
        {
          content: fs.readFileSync(pdfPath).toString('base64'),
          filename: 'ticket.pdf',
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    };

    await sgMail.send(msg);

    res.json({ message: 'Booking confirmed and ticket sent', booking });
  } catch (err) {
    console.error('Booking confirmation failed:', err);
    res.status(500).json({ message: 'Failed to confirm booking' });
  }
});

module.exports = router;
