const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/sri-hospitals",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Mongoose model for blog data
const blogSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: {
    data: Buffer,
    contentType: String,
  },
  createdAt: { type: Date, default: Date.now },
});

const Blog = mongoose.model("Blog", blogSchema);

// API endpoint to handle blog data submission with image
app.post("/api/blogs", upload.single("image"), async (req, res) => {
  const { title, description } = req.body;
  const image = req.file
    ? {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      }
    : null;

  // Create a new blog document
  const newBlog = new Blog({
    title,
    description,
    image,
  });

  try {
    // Save the blog to MongoDB
    await newBlog.save();
    res.json({ success: true });
  } catch (err) {
    // Handle database save errors
    res.status(500).json({ error: err.message });
  }
});

// API endpoint to get blog data
app.get("/api/get_blogs", async (req, res) => {
  try {
    const blogs = await Blog.find({});
    const blogsWithImage = blogs.map((blog) => ({
      _id: blog._id,
      title: blog.title,
      description: blog.description,
      image: blog.image
        ? `data:${blog.image.contentType};base64,${blog.image.data.toString(
            "base64"
          )}`
        : null,
      createdAt: blog.createdAt,
    }));
    res.json(blogsWithImage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server with nodemon
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

module.exports = app;
