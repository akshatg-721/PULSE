const mongoose = require("mongoose");
require("dotenv").config();

async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is missing. Set it in the .env file.");
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");
}

module.exports = connectDatabase;
