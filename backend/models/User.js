const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },        // ✅ Add this line
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone : { type: Number,required: true },
});

module.exports = mongoose.model('User', userSchema);
