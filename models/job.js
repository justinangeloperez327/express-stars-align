const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "temporary", "internship"],
      required: true,
    },
    requirements: {
      type: String, // Array of job qualifications
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    responsibilites: {
      type: [String], // Array of job requirements
      required: true,
    },
    education: {
      type: String,
      required: false,
    },
    salary: {
      type: String,
      required: false,
    },
    deadline: {
      type: Date,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", // Reference to the employer posting the job
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application", // Reference to applicants for this job
      },
    ],
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;