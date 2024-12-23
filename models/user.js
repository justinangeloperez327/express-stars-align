const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'employee',
    enum: ['employee', 'employer', 'admin'],
  }
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;