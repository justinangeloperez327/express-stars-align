const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the base User model
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company', // Reference to the Employer model
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    pros: {
      type: String,
      required: true,
    },
    cons: {
      type: String,
      required: true,
    },
    advice: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
