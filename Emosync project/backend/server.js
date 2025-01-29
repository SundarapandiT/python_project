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


# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from fer import FER
# import numpy as np
# from PIL import Image
# import io

# app = Flask(__name__)
# # CORS(app, resources={r"/*": {"origins": "*"}})
# CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})

# # Initialize FER detector
# detector = FER()

# @app.route('/')
# def home():
#     return "Emotion Detection Server is running!"

# @app.route('/predict', methods=['POST'])
# def predict_emotion():
#     try:
#         if 'image' not in request.files:
#             return jsonify({"error": "No image provided"}), 400

#         # Read the uploaded image
#         image_file = request.files['image']
#         image = Image.open(io.BytesIO(image_file.read()))

#         # Convert image to numpy array
#         image_np = np.array(image)

#         # Detect emotions
#         emotions = detector.detect_emotions(image_np)
        
#         if not emotions:
#             return jsonify({"error": "No face detected"}), 400

#         # Get the highest probability emotion
#         detected_emotion = max(emotions[0]['emotions'], key=emotions[0]['emotions'].get)
        
#         return jsonify({"emotion": detected_emotion})

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=5000)





# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import tensorflow as tf
# import numpy as np
# from PIL import Image
# import io
# from utils import preprocess_image

# app = Flask(__name__)

# # Enable CORS all
# CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})

# # Load your trained emotion detection model
# model = tf.keras.models.load_model("emotion_detection_model.h5")

# # Emotion labels (ensure they correspond to your model's output)
# emotion_map = {
#     0: "Angry", 
#     1: "Disgust", 
#     2: "Fear", 
#     3: "Happy", 
#     4: "Sad", 
#     5: "Surprise", 
#     6: "Neutral"
# }

# @app.route('/')
# def home():
#     return "Emotion Detection Server is running!"

# @app.route('/predict', methods=['POST'])
# def predict_emotion():
#     try:
#         if 'image' not in request.files:
#             return jsonify({"error": "No image provided"}), 400

#         # Read the uploaded image
#         image_file = request.files['image']
#         image = Image.open(io.BytesIO(image_file.read()))

#         # Preprocess the image before feeding into the model
#         processed_image = preprocess_image(image)

#         # Predict emotion
#         predictions = model.predict(np.expand_dims(processed_image, axis=0))  # Add batch dimension
#         emotion_index = np.argmax(predictions)  # Get the index of the most probable emotion
#         detected_emotion = emotion_map.get(emotion_index, "unknown")  # Map index to emotion label

#         return jsonify({"emotion": detected_emotion})

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=5000)
