const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userEmail: { type: String, required: true },
  amount: { type: Number, required: true },
  razorpay_payment_id: String,
  razorpay_order_id: String,
  razorpay_signature: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);
