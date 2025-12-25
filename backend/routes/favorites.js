const express = require("express");
const { 
  getFavorites, 
  addToFavorites, 
  removeFromFavorites,
  checkFavoriteStatus,
} = require("../controller/favoriteController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(verifyToken);

// GET /api/favorites - Get user's favorites
router.get("/", getFavorites);

// POST /api/favorites - Add to favorites
router.post("/", addToFavorites);

// DELETE /api/favorites/:favoriteId - Remove from favorites by favorite ID
router.delete("/:favoriteId", removeFromFavorites);

// DELETE /api/favorites - Remove from favorites by ship/cabin (backward compatible)
router.delete("/", removeFromFavorites);

// GET /api/favorites/check - Check if ship/cabin is favorited
router.get("/check", checkFavoriteStatus);

module.exports = router;