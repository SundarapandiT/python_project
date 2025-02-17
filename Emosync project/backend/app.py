import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
import threading

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "https://emosync-green.vercel.app"])

# Global lock to prevent overloading
lock = threading.Lock()

def analyze_emotion(image):
    try:
        # Reduce image size for faster processing
        resized_image = cv2.resize(image, (224, 224))
        result = DeepFace.analyze(resized_image, actions=['emotion'], enforce_detection=False)
        dominant_emotion = result[0]['dominant_emotion']
        return dominant_emotion
    except Exception as e:
        return str(e)

@app.route('/')
def home():
    return "Successfully running"

@app.route('/predict', methods=['POST'])
def analyze():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file uploaded'}), 400

    file = request.files['image']
    npimg = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    # Use threading to speed up the process
    with lock:
        thread = threading.Thread(target=analyze_emotion, args=(image,))
        thread.start()
        thread.join()

    # Assuming thread handles emotion extraction and stores result in a global variable
    try:
        emotion = analyze_emotion(image)
        return jsonify({'emotion': emotion})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, threaded=True)
    
# import cv2  
# import numpy as np  
# import base64  
# from flask import Flask, request, jsonify  
# from flask_cors import CORS  
# from deepface import DeepFace  
  
# app = Flask(__name__)  
# # Allow CORS for a specific origin (e.g., localhost:3000)  
# CORS(app, origins=["http://localhost:3000", "https://emosync-green.vercel.app"])  
  
# @app.route('/')  
# def home():  
#     return "Successfully running"  
  
# @app.route('/predict', methods=['POST'])  
# def analyze():  
#     if 'image' not in request.files:  
#         return jsonify({'error': 'No image file uploaded'}), 400  
  
#     file = request.files['image']  
#     npimg = np.frombuffer(file.read(), np.uint8)  
#     image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)  
  
#     try:  
#         result = DeepFace.analyze(image, actions=['emotion'])  
#         dominant_emotion = result[0]['dominant_emotion']  
#         return jsonify({'emotion': dominant_emotion})  
#     except Exception as e:  
#         return jsonify({'error': str(e)}), 500  
  
# if __name__ == '__main__':  
#     app.run(debug=True)

# '''from flask import Flask, request, jsonify
# from flask_cors import CORS
# from deepface import DeepFace
# from PIL import Image
# import io

# app = Flask(__name__)

# # Allow CORS for a specific origin (e.g., localhost:3000)
# CORS(app, origins=["http://localhost:3000", "https://emosync-green.vercel.app"])

# @app.route('/')
# def home():
#     return "Emotion Detection Server is running!"

# @app.route('/predict', methods=['POST'])
# def predict_emotion():
#     if 'image' not in request.files:
#         return jsonify({"error": "No image provided"}), 400

#     # Read the image
#     image = request.files['image'].read()
#     image = Image.open(io.BytesIO(image))

#     # Convert image to a format DeepFace can process
#     image.save("temp.jpg")  # Save temporarily

#     try:
#         result = DeepFace.analyze(img_path="temp.jpg", actions=['emotion'])
#         detected_emotion = result[0]['dominant_emotion']  # Get the most likely emotion
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

#     return jsonify({"emotion": detected_emotion})

# if __name__ == '__main__':
#     app.run(debug=True)'''


# '''// const express = require("express");
# // const cors = require("cors");
# // const multer = require("multer");
# // const { createCanvas, Image } = require("canvas");
# // const tf = require("@tensorflow/tfjs-node"); // Import TensorFlow.js for Node.js
# // const path = require("path");
# // const fs = require("fs");

# // // Initialize Express
# // const app = express();
# // app.use(cors());
# // app.use(express.json());
# // app.use(express.urlencoded({ extended: true }));

# // // Setup multer for file uploads
# // const upload = multer({ storage: multer.memoryStorage() });

# // // Load your trained emotion detection model
# // const modelPath = path.join(__dirname, "emotion_detection_model.h5");
# // let model;

# // async function loadModel() {
# //     try {
# //         model = await tf.loadLayersModel(`file://${modelPath}`);
# //         console.log("Model loaded successfully.");
# //     } catch (error) {
# //         console.error("Error loading model:", error);
# //         process.exit(1);
# //     }
# // }
# // loadModel();

# // app.get("/", (req, res) => {
# //     res.send("Emotion Detection Server is running!");
# // });

# // // Preprocess the image before feeding into the model
# // function preprocessImage(imageBuffer) {
# //     return new Promise((resolve, reject) => {
# //         const img = new Image();
# //         img.onload = () => {
# //             const canvas = createCanvas(img.width, img.height);
# //             const ctx = canvas.getContext("2d");
# //             ctx.drawImage(img, 0, 0);
# //             const imageTensor = tf.browser.fromPixels(canvas);
# //             const resizedImage = tf.image.resizeBilinear(imageTensor, [48, 48]); // Resize to model input size
# //             const normalizedImage = resizedImage.div(255.0).expandDims(0); // Normalize and add batch dimension
# //             resolve(normalizedImage);
# //         };
# //         img.onerror = (err) => reject(err);
# //         img.src = imageBuffer;
# //     });
# // }

# // // API to process images and detect emotions
# // app.post("/predict", upload.single("image"), async (req, res) => {
# //     try {
# //         if (!req.file) {
# //             return res.status(400).json({ error: "No image provided" });
# //         }

# //         // Preprocess the image
# //         const processedImage = await preprocessImage(req.file.buffer);

# //         // Predict emotion
# //         const predictions = model.predict(processedImage);
# //         const emotionIndex = predictions.argMax(1).dataSync()[0]; // Get index of the most probable emotion

# //         // Map index to emotion label
# //         const emotionMap = {
# //             0: "Angry",
# //             1: "Disgust",
# //             2: "Fear",
# //             3: "Happy",
# //             4: "Sad",
# //             5: "Surprise",
# //             6: "Neutral",
# //         };
# //         const detectedEmotion = emotionMap[emotionIndex] || "unknown"; // Default to "unknown" if not found

# //         res.json({ emotion: detectedEmotion });
# //     } catch (error) {
# //         console.error("Server error:", error);
# //         res.status(500).json({ error: "Internal server error" });
# //     }
# // });

# // // Start Server
# // const PORT = process.env.PORT || 5000;
# // app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));'''
