const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the base User model
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: false,
    },
    rating: {
      type: Number,
      required: false,
      default: 0,
    },
    vision: {
      type: String,
      required: false,
    },
    mission: {
      type: String,
      required: false,
    },
    ourValues: {
      type: [String],
      required: false,
    },
    jobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job", // Reference to jobs posted by the employer
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review", // Reference to reviews for this employer
      },
    ],
  },
  { timestamps: true }
);

const Company = mongoose.models.Company || mongoose.model('Company', companySchema);
module.exports = Company;
