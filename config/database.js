const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connect to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
  }
};

module.exports = connectToDatabase;