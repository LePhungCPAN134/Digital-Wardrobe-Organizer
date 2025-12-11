//// Import and configure the 'dotenv' package at the top of server.js to load environment variables.
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoute = require("./modules/users/routes/userRoutes");
const clothingRoute = require("./modules/clothingItems/routes/clothingRoutes");
const outfitRoute = require("./modules/outfits/routes/outfitRoutes");
const connectDB = require("./shared/middlewares/connect-db");

const port = 3000;
const hostname = "localhost";
const server = express();

//Allow frontend
server.use(cors({ origin: "http://localhost:5173" }));

//Add built-in middlewares to parse request body in application-level
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// middlewares to parse request cookies in application-level
server.use(cookieParser()); 

//Add the connectDB middleware in application level
server.use(connectDB);

//Mount all the routes
server.use(userRoute);
server.use(clothingRoute);
server.use(outfitRoute);

// error-handling middleware to logs the error for debugging.
server.use((error, req, res, next) => {
  console.log(error);
  res.status(500).send("Oops! Internal server error!");
});

// Middleware to handle route not found error.
server.use((req, res, next) => {
  res.status(404).send(`404! ${req.method} ${req.path} Not Found.`);
});

server.listen(port, hostname, (error) => {
  if (error) console.log(error.message);
  else console.log(`Server running on http://${hostname}:${port}`);
});