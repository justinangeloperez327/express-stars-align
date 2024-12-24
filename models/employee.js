const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the base User model
      required: true,
    },
    firstName: {
      type: String,
      required: false,
    },
    middleName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    experience: [
      {
        title: {
          type: String,
          required: true,
        },
        company: {
          type: String,
          required: true,
        },
        startDate: {
          type: Date,
          required: false,
        },
        endDate: {
          type: Date,
          required: false,
        },
      }
    ],
    education: [
      {
        school: {
          type: String,
          required: true,
        },
        degree: {
          type: String,
          required: false,
        },
        startDate: {
          type: Date,
          required: false,
        },
        endDate: {
          type: Date,
          required: false,
        },
      }
    ],
    skills: [
      {
        type: String,
        required: true,
      }
    ],
    appliedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job", // Reference to jobs the employee applied tos
      },
    ],
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;