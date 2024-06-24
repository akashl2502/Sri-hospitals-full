const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const connectDB = require("./config/db");
const nodemailer = require("nodemailer");
require("dotenv").config();
const Image = require("./models/imagesModel.js");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Multer setup


// Connect to MongoDB
connectDB();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
const blogRoutes = require("./routes/blogRoutes");
const newsRoutes = require("./routes/newsRoutes");
const imageRoutes = require("./routes/imageRoutes");

app.post("/api/contact", (req, res) => {
  const { name, email, subject, phone, message } = req.body;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "digenie.official@gmail.com",
    pass: "jwcb jhtd qfwt nzed",
  },
});

  const mailOptions = {
    from: email,
    to: "digenie.official@gmail.com",
    subject: subject,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});


app.use("/api/", upload.single("image"), blogRoutes);
app.use("/api/", newsRoutes);


app.post("/api/images", upload.single("image"), async (req, res) => {
  try {
    const filename = req.file.originalname;
    const title = path.parse(filename).name; // Extract title from filename without extension
    const image = req.file.buffer.toString("base64");

    // Save image metadata to MongoDB
    const newImage = new Image({
      title,
      image: `data:${req.file.mimetype};base64,${image}`,
    });

    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    console.error("Error uploading image:", error);
    res
      .status(500)
      .json({ error: "Failed to upload image. Please try again." });
  }
});

// Fetch images
app.get("/api/get_images", async (req, res) => {
  try {
    const images = await Image.find({});
    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch images. Please try again." });
  }
});

// Delete image
app.delete("/api/images/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedImage = await Image.findByIdAndDelete(id);
    if (!deletedImage) {
      return res.status(404).json({ error: "Image not found." });
    }
    res.status(200).json(deletedImage);
  } catch (error) {
    console.error("Error deleting image:", error);
    res
      .status(500)
      .json({ error: "Failed to delete image. Please try again." });
  }
});

app.post("/uploadVideo", upload.single("video"), (req, res) => {
  // Logic to save file metadata to MongoDB
  res.json({ message: "Video uploaded successfully" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
