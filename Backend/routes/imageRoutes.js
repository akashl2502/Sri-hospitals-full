const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imagesController");

router.post("/images", imageController.createImages);
router.get("/get_images", imageController.getImages);
router.delete("/images/:id", imageController.deleteImages);

module.exports = router;
