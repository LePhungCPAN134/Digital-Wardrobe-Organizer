const express = require("express");

// Import route modules based on your folder structure
const userRoutes = require("./modules/users/routes/userRoutes");
const clothingRoutes = require("./modules/clothingItems/routes/clothingRoutes");
const outfitRoutes = require("./modules/outfits/routes/outfitRoutes");

const port = 3000;
const hostname = "localhost";
const server = express();

/**
 * Step 1: Add built-in middlewares to parse request body in application-level
 */
server.use(express.json());

/**
 * Step 2: Mount all the routes
 */
server.use(userRoutes);
server.use(clothingRoutes);
server.use(outfitRoutes);

/**
 * Step 3: Add error-handling middleware in application-level
 * - Logs the error for debugging.
 * - Returns a generic 500 response to the client.
 */
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