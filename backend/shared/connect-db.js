const mongoose = require("mongoose");

const dbUrl = process.env.DB_URI;
const dbName = process.env.DB_NAME;

console.log(dbUrl);

async function connectDB(req, res, next) {
    try {
        await mongoose.connect(dbUrl, { dbName });
        console.log("Database connected!");
        next();
    } catch (error) {
        console.log(error);
        res.status(500).send("Database connection failed!");
    }
};

module.exports = connectDB;