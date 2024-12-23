const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the base User model
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job", // Reference to the Job model
      required: true,
    },
  },
  { timestamps: true }
);

const SavedJob = mongoose.model("SavedJob", savedJobSchema);

module.exports = SavedJob;