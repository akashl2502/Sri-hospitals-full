const News = require("../models/newsModel");

const createNews = async (req, res) => {
  const { title, description } = req.body;

  const newNews = new News({
    title,
    description,
  });

  try {
    await newNews.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getNews = async (req, res) => {
  try {
    const news = await News.find({});
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLatestNews = async (req, res) => {
  try {
    const news = await News.find({}).sort({ createdAt: -1 }).limit(2); // Fetch the latest 2 news items
    const totalNewsCount = await News.countDocuments(); // Get the total count of news items
    res.json({ news, totalNewsCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getNewsById = async (req, res) => {
  const { id } = req.params;

  try {
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteNews = async (req, res) => {
  const { id } = req.params;

  try {
    await News.findByIdAndDelete(id);
    res.json({ success: true, message: "News deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createNews,
  getNews,
  getLatestNews,
  getNewsById,
  deleteNews,
};
