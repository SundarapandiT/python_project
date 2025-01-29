const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { createCanvas, Image } = require("canvas");
const faceapi = require("face-api.js");
const path = require("path");
const fs = require("fs");

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Load face-api.js models
const MODELS_PATH = path.join(__dirname, "models");

// Ensure models directory exists
if (!fs.existsSync(MODELS_PATH)) {
    console.error("Error: Models directory not found. Make sure to download face-api.js models.");
    process.exit(1);
}

// Patch face-api.js to use node-canvas
faceapi.env.monkeyPatch({ Canvas: createCanvas, Image });

async function loadModels() {
    try {
        console.log("Loading face-api.js models...");
        await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_PATH);
        await faceapi.nets.faceExpressionNet.loadFromDisk(MODELS_PATH);
        console.log("Models loaded successfully.");
    } catch (error) {
        console.error("Error loading models:", error);
        process.exit(1);
    }
}
loadModels();

app.get("/", (req, res) => {
    res.send("Emotion Detection Server is running!");
});

// API to process images and detect emotions
app.post("/predict", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image provided" });
        }

        // Convert image buffer to Canvas Image
        const img = new Image();
        img.onload = async () => {
            const canvas = createCanvas(img.width, img.height);
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            // Detect faces and emotions
            const detections = await faceapi.detectAllFaces(canvas)
                .withFaceExpressions();

            if (!detections.length) {
                return res.status(400).json({ error: "No face detected" });
            }

            // Extract most prominent emotion
            const emotions = detections[0].expressions;
            const detectedEmotion = Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);

            res.json({ emotion: detectedEmotion });
        };
        img.onerror = (err) => {
            console.error("Image loading error:", err);
            res.status(500).json({ error: "Failed to process image" });
        };
        img.src = req.file.buffer;
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
