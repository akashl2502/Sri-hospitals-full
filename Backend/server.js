const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const path = require("path");
const crypto = require("crypto");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongodb = require("mongodb");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(cors());

// Mongo URI - replace with your MongoDB Atlas URI
const mongoURI =
  "mongodb+srv://digenieofficial:Digitalgenie7$@digenie.j4s0sdo.mongodb.net/sri-hospitals?retryWrites=true&w=majority&appName=Digenie";

// Create mongo connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const conn = mongoose.connection;

// Init gfs and db
let gfs, db;

conn.once("open", () => {
  console.log("MongoDB connection open");
  db = conn.db;
  gfs = new mongoose.mongo.GridFSBucket(db, { bucketName: "videos" });
  console.log("GridFS initialized");
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "videos",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

// @route POST /upload
// @desc  Uploads file to DB
app.post("/upload", upload.single("file"), (req, res) => {
  console.log("File upload request received");
  if (req.file) {
    console.log("File uploaded:", req.file);
    res.json({ file: req.file });
  } else {
    console.error("File upload failed");
    res.status(400).json({ error: "File upload failed" });
  }
});

// @route GET /files/:filename
// @desc  Display video file
app.get("/files/:filename", function (req, res) {
  console.log(`Request to get file: ${req.params.filename}`);
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
    return;
  }

  gfs.find({ filename: req.params.filename }).toArray((err, files) => {
    if (err || !files || files.length === 0) {
      console.error("File not found:", err || "No file exists");
      return res.status(404).json({ err: "No file exists" });
    }

    const file = files[0];
    console.log("File found:", file);

    if (file.contentType.startsWith("video/")) {
      const videoSize = file.length;
      const start = Number(range.replace(/\D/g, ""));
      const end = videoSize - 1;

      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": file.contentType,
      };

      // HTTP Status 206 for Partial Content
      res.writeHead(206, headers);

      const downloadStream = gfs.openDownloadStreamByName(req.params.filename, {
        start,
      });

      // Finally pipe video to response
      downloadStream.pipe(res).on("error", (error) => {
        console.error("Download stream error:", error);
        res.status(500).send(error);
      });
    } else {
      console.error("Not a video file");
      res.status(404).json({ err: "Not a video" });
    }
  });
});

// @route GET /files
// @desc  Display all files in JSON
app.get("/files", async (req, res) => {
  try {
    const files = await gfs.find().toArray();
    if (!files || files.length === 0) {
      console.error("No files exist");
      return res.status(404).json({ err: "No files exist" });
    }
    console.log("Files found:", files);
    return res.json(files);
  } catch (err) {
    console.error("Error retrieving files:", err);
    return res.status(500).json({ err: "Error retrieving files" });
  }
});

const port = 8000;

app.listen(port, () => console.log(`Server started on port ${port}`));
