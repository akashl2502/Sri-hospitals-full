const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");

router.post("/news", newsController.createNews);
router.get("/get_news", newsController.getNews);
router.get("/get_latest_news", newsController.getLatestNews);
router.get("/latest_news/:id", newsController.getNewsById);
router.delete("/news/:id", newsController.deleteNews);

module.exports = router;
