require('dotenv').config();

const express = require("express");

// Import route modules based on your folder structure
const userRoutes = require("./modules/users/routes/userRoutes");
const clothingRoutes = require("./modules/clothingItems/routes/clothingRoutes");
const outfitRoutes = require("./modules/outfits/routes/outfitRoutes");
const connectDB = require("./shared/middlewares/connect-db");

const port = 3000;
const hostname = "localhost";
const server = express();

//Add built-in middlewares to parse request body in application-level

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//Add the connectDB middleware in application level
server.use(connectDB);

//Mount all the routes
server.use(userRoutes);
server.use(clothingRoutes);
server.use(outfitRoutes);

// error-handling middleware to logs the error for debugging.
server.use((err, req, res, next) => {
  console.error("Server error: ", err.stack);
  res.status(500).send("Something went wrong with the server.");
});

// Middleware to handle route not found error.
server.use((req, res, next) => {
  res.status(404).send(`404! ${req.method} ${req.path} Not Found.`);
});

server.listen(port, hostname, (error) => {
  if (error) console.log(error.message);
  else console.log(`Server running on http://${hostname}:${port}`);
});
``