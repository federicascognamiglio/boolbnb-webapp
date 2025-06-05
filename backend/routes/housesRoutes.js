//Import
const express = require("express");
const router = express.Router();
// Controllers
const housesController = require("../controllers/housesController");
const reviewController = require("../controllers/reviewsController");
const likesController = require("../controllers/likesController");
const messagesController = require("../controllers/messagesController");

// Middlewares
const publicUpload = require("../middlewares/fileUpload");

// HOUSES ROUTES
// Index
router.get("/", housesController.index);
// Show
router.get("/:slug", housesController.show);
// Store 
router.post("/", publicUpload.array("foto", 10), housesController.storeHouse);
// Update
router.patch("/:id/updateHouse", housesController.updateHouse);
// Destroy
router.delete("/:id/deleteHouse", housesController.deleteHouse);

// REVIEWS ROUTES
// Store 
router.post("/:id/review", reviewController.storeReview);
// Destroy
router.delete("/:id/deleteReview", reviewController.deleteReview);

// GUESTS MESSAGES ROUTES
// Store
router.post("/:id/message", messagesController.storeMessage);

// LIKES ROUTES
// Store like
router.post("/:id/like", likesController.storeLike);

module.exports = router;