const Blog = require("../models/blogModel");

const createBlog = async (req, res) => {
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
};

const getBlogs = async (req, res) => {
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
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    await Blog.findByIdAndDelete(id);
    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  deleteBlog,
};
