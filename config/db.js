const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "classDB",
        });

        console.log("Connected to DB:", mongoose.connection.name);
    } catch (error) {
        console.error("DB connection error:", error.message);
        throw error;
    }
};

module.exports = connectDB;