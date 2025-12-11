const mongoose = require("mongoose");

const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;

async function connectDB(req, res, next) {
    try {
        await mongoose.connect(DB_URL, { dbName: DB_NAME });
        console.log("Database connected!");
        next();
    } catch (error) {
        console.log(error);
        res.status(500).send("Database connection failed!");
    }
};

module.exports = connectDB;