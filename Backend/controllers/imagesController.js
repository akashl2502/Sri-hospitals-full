const Images = require("../models/imagesModel");

const createImages = async (req, res) => {
  const image = req.file
    ? {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      }
    : null;
  console.log(image);
  // Create a new blog document
  const newBlog = new Images({
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
};

const getImages = async (req, res) => {
  try {
    const blogs = await Images.find({});
    const blogsWithImage = blogs.map((blog) => ({
      _id: blog._id,
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
};

const deleteImages = async (req, res) => {
  const { id } = req.params;

  try {
    await Images.findByIdAndDelete(id);
    res.json({ success: true, message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createImages,
  getImages,
  deleteImages,
};
