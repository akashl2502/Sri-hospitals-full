// routes/videoRoutes.js
const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");

// Upload video route
router.post("/upload", videoController.uploadVideo);

// Get all videos route
router.get("/", videoController.getVideos);

module.exports = router;
