const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");

router.post("/blogs", blogController.createBlog);
router.get("/get_blogs", blogController.getBlogs);
router.delete("/blogs/:id", blogController.deleteBlog);

module.exports = router;
