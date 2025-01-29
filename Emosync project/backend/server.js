const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { createCanvas, Image } = require("canvas");
const faceapi = require("face-api.js");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Models path
const MODELS_PATH = path.join(__dirname, "models");
const MODEL_URLS = [
    "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/ssd_mobilenetv1_model-weights_manifest.json",
    "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_expression_model-weights_manifest.json",
    "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/ssd_mobilenetv1_model-shard1",
    "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_expression_model-shard1",
];

// Ensure models directory exists
async function downloadModels() {
    if (!fs.existsSync(MODELS_PATH)) {
        fs.mkdirSync(MODELS_PATH, { recursive: true });
    }

    for (const url of MODEL_URLS) {
        const filename = path.basename(url);
        const filepath = path.join(MODELS_PATH, filename);

        if (!fs.existsSync(filepath)) {
            console.log(`Downloading ${filename}...`);
            const response = await axios.get(url, { responseType: "arraybuffer" });
            fs.writeFileSync(filepath, response.data);
        }
    }
    console.log("✅ Models downloaded successfully.");
}

// Patch face-api.js to use node-canvas
faceapi.env.monkeyPatch({ Canvas: createCanvas, Image });

// Load models
async function loadModels() {
    try {
        console.log("⏳ Loading face-api.js models...");
        await downloadModels();
        await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_PATH);
        await faceapi.nets.faceExpressionNet.loadFromDisk(MODELS_PATH);
        console.log("✅ Models loaded successfully.");
    } catch (error) {
        console.error("❌ Error loading models:", error);
        process.exit(1);
    }
}
loadModels();

app.get("/", (req, res) => {
    res.send("🎭 Emotion Detection Server is running!");
});

// API to process images and detect emotions
app.post("/predict", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image provided" });
        }

        // Convert image buffer to Canvas Image
        const img = new Image();
        img.src = req.file.buffer;
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        // Detect faces and emotions
        const detections = await faceapi.detectAllFaces(canvas).withFaceExpressions();

        if (!detections.length) {
            return res.status(400).json({ error: "No face detected" });
        }

        // Extract emotions for each detected face
        const results = detections.map((det, index) => {
            const emotions = det.expressions;
            const detectedEmotion = Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);
            return { face: index + 1, emotion: detectedEmotion };
        });

        res.json({ emotions: results });

    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
