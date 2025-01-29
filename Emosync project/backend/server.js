const express = require("express");
const cors = require("cors");
const multer = require("multer");
const tf = require("@tensorflow/tfjs-node"); // TensorFlow.js for Node.js
const { createCanvas, Image } = require("canvas");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const app = express();

// Enable CORS for a specific frontend origin (adjust as needed)
app.use(cors({
  origin: "http://localhost:3000"
}));

// Setup multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Load the trained emotion detection model
const modelPath = path.join(__dirname, "emotion_detection_model.h5");
let model;
async function loadModel() {
  try {
    model = await tf.loadLayersModel(`file://${modelPath}`);
    console.log("Model loaded successfully.");
  } catch (error) {
    console.error("Error loading model:", error);
    process.exit(1);
  }
}
loadModel();

// Emotion labels (ensure they correspond to your model's output)
const emotionMap = {
  0: "Angry",
  1: "Disgust",
  2: "Fear",
  3: "Happy",
  4: "Sad",
  5: "Surprise",
  6: "Neutral"
};

// Home route to test the server
app.get("/", (req, res) => {
  res.send("Emotion Detection Server is running!");
});

// Helper function to preprocess the image (resize and normalize)
async function preprocessImage(imageBuffer) {
  const image = await sharp(imageBuffer)
    .resize(224, 224)  // Resize to 224x224 (or whatever input size your model expects)
    .toBuffer();

  const canvas = createCanvas(224, 224);
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.onload = () => ctx.drawImage(img, 0, 0);
  img.src = image;

  // Convert canvas image to tensor and normalize
  const tensor = tf.browser.fromPixels(canvas).toFloat();
  return tensor.div(tf.scalar(255));  // Normalize pixel values to [0, 1]
}

// API route to predict emotion
app.post("/predict", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Preprocess the image before feeding it into the model
    const processedImage = await preprocessImage(req.file.buffer);

    // Make a prediction
    const prediction = model.predict(processedImage.expandDims(0)); // Add batch dimension
    const predictionData = await prediction.data();
    
    // Get the index of the most probable emotion
    const emotionIndex = predictionData.indexOf(Math.max(...predictionData));
    const detectedEmotion = emotionMap[emotionIndex] || "unknown"; // Map index to emotion label

    res.json({ emotion: detectedEmotion });
  } catch (error) {
    console.error("Error during prediction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
