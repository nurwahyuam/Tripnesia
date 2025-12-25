// controllers/favoriteController.js
const FavoriteShip = require("../models/favoriteShipModel");
const Ship = require("../models/shipModel");
const Cabin = require("../models/cabinShipModel");
const Schedule = require("../models/scheduleModel");

// Get user's favorites dengan populate ship dan cabins
const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await FavoriteShip.find({
      user_id: userId,
      is_favorite: true,
    })
      .populate({ path: "ship_id" })
      .sort({ createdAt: -1 });

    const favoritesWithCabinsAndSchedules = await Promise.all(
      favorites.map(async (fav) => {
        const ship = fav.ship_id;

        // Ambil cabins
        const cabins = await Cabin.find({ ship_id: ship._id });

        // 🔹 Ambil schedules berdasarkan ship_id
        const schedules = await Schedule.find({ ship_id: ship._id }, "name"); // hanya ambil field 'name'

        return {
          ...ship._doc,
          cabins: cabins,
          schedules: schedules, // ✅ tambahkan schedules
          favorite_id: fav._id,
        };
      })
    );

    res.status(200).json({
      success: true,
      favorites: favoritesWithCabinsAndSchedules,
    });
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get favorites",
    });
  }
};

// Add to favorites - hanya ship saja
const addToFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shipId } = req.body;

    if (!shipId) {
      return res.status(400).json({
        success: false,
        message: "Ship ID is required",
      });
    }

    // Check if ship exists
    const ship = await Ship.findById(shipId);
    if (!ship) {
      return res.status(404).json({
        success: false,
        message: "Ship not found",
      });
    }

    // Check if already favorited
    const existingFavorite = await FavoriteShip.findOne({
      user_id: userId,
      ship_id: shipId,
    });

    if (existingFavorite) {
      // Update existing
      existingFavorite.is_favorite = true;
      await existingFavorite.save();
    } else {
      // Create new favorite
      await FavoriteShip.create({
        user_id: userId,
        ship_id: shipId,
        is_favorite: true,
      });
    }

    res.status(200).json({
      success: true,
      message: "Added to favorites",
    });
  } catch (error) {
    console.error("Add to favorites error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add to favorites",
    });
  }
};

// Remove from favorites
const removeFromFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { favoriteId } = req.params;

    const favorite = await FavoriteShip.findOneAndUpdate(
      {
        _id: favoriteId,
        user_id: userId,
      },
      {
        is_favorite: false,
      }
    );

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Removed from favorites",
    });
  } catch (error) {
    console.error("Remove from favorites error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove from favorites",
    });
  }
};

// Check favorite status
const checkFavoriteStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shipId } = req.query;

    if (!shipId) {
      return res.status(400).json({
        success: false,
        message: "Ship ID is required",
      });
    }

    const favorite = await FavoriteShip.findOne({
      user_id: userId,
      ship_id: shipId,
      is_favorite: true,
    });

    res.status(200).json({
      success: true,
      isFavorite: !!favorite,
      favoriteId: favorite?._id,
    });
  } catch (error) {
    console.error("Check favorite status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check favorite status",
    });
  }
};

module.exports = {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  checkFavoriteStatus,
};
