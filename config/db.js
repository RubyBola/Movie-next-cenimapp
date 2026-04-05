// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "classDB", // ✅ force correct DB
    });

    console.log("✅ Connected to DB:", mongoose.connection.name);
  } catch (error) {
    console.error("❌ DB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;