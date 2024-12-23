const mongoose = require("mongoose");

const adminLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the base User model
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const AdminLog = mongoose.model("AdminLog", adminLogSchema);

module.exports = AdminLog;