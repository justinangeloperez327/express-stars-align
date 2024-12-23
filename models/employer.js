const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the base User model
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", // Reference to the company the employer works for
    },
  },
  { timestamps: true }
);

const Employer = mongoose.model("Employer", employerSchema);

module.exports = Employer;
