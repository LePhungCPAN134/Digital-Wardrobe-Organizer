const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { ClothingModel } = require("../models/clothingModel");
const createClothingRules = require("../middlewares/create-clothing-rules");
const updateClothingRules = require("../middlewares/update-clothing-rules");
const authorize = require("../../../shared/middlewares/authorize");

// configure multer storage
const uploadDir = path.join(__dirname, "../../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, uploadDir);},
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({ storage });

const clothingRoute = Router();

/**
 * GET /clothingItems - Fetch all clothing items
 * Protected: customer or admin
 */
clothingRoute.get("/clothingItems", authorize(["customer", "admin"]), async (req, res) => {
    const allClothings = await ClothingModel.find();
    if (!allClothings) res.json([]);
    else res.json(allClothings);
});

/**
 * GET /clothingItems/:id - Fetch clothing item by ID
 * Protected: customer or admin
 */
clothingRoute.get("/clothingItems/:id", authorize(["customer", "admin"]), async (req, res) => {
    const clothingID = req.params.id;
    const clothing = await ClothingModel.findById(clothingID);
    if (!clothing) return res.status(404).send("Clothing not found!");
    else res.status(200).json(clothing);
});

/**
 * POST /clothingItems - Add new clothing item
 * Protected: customer or admin
 */
clothingRoute.post("/clothingItems", authorize(["customer", "admin"]), upload.single("image"), createClothingRules, async (req, res) => {
    try {
      const { name, category, color, imageUrl } = req.body;

      // If a file was uploaded, build a full URL for it
      let finalImageUrl = imageUrl || "";
      if (req.file) {
        finalImageUrl = `/uploads/${req.file.filename}`;
      }

      const clothing = new ClothingModel({
        name,
        category,
        color,
        imageUrl: finalImageUrl,
      });
      const savedClothing = await clothing.save();
      res.status(201).json(savedClothing);
    } catch (error) {
      console.error("Error creating clothing: ", error);
      res.status(500).send("Failed to create new clothing data!");
    }
  }
);

/**
 * PUT /clothingItems/:id - Update clothing item
 * Protected: customer or admin
 */
clothingRoute.put(
  "/clothingItems/:id", authorize(["customer", "admin"]), upload.single("image"), updateClothingRules, async (req, res) => {
    const clothingID = req.params.id;
    try {
      const updatedClothing = await ClothingModel.findByIdAndUpdate (
        clothingID,
        req.body,
        { new: true, runValidators: true }
      );

    if (!updatedClothing) {
      return res.status(404).send("Clothing not found!");
    }

    res.status(200).json(updatedClothing);
  } catch (error) {
    console.error("error updating clothing: ", error);
    res.status(500).send("Failed to update clothing data!");
  }
});

/**
 * DELETE /clothingItems/:id - Delete clothing item
 * Protected: customer or admin
 */
clothingRoute.delete("/clothingItems/:id", authorize(["customer", "admin"]), async (req, res) => {
  const clothingID = req.params.id;
  try {
    const deletedClothing = await ClothingModel.findByIdAndDelete(clothingID);
    if (!deletedClothing) {
      return res.status(404).send("Clothing not found!");
    }
    res.status(200).json(deletedClothing);
  } catch (error) {
    console.eerror("Error deleting clothing: ", error);
    res.status(500).send("Failed to delete clothing data!")
  }
});

module.exports = clothingRoute;