import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
from utils import preprocess_image

# Initialize Flask app
app = Flask(__name__)

# Enable CORS to allow requests from any domain
CORS(app)

# Load your trained model
model_path = os.getenv('./', 'emotion_detection_model.h5')
model = tf.keras.models.load_model(model_path)

@app.route('/predict', methods=['POST'])
def predict_emotion():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    # Read and preprocess the image
    image = request.files['image'].read()
    image = Image.open(io.BytesIO(image))
    processed_image = preprocess_image(image)

    # Predict emotion
    predictions = model.predict(np.expand_dims(processed_image, axis=0))
    emotion = np.argmax(predictions)
    emotion_map = {0: "Angry", 1: "Disgust", 2: "Fear", 3: "Happy", 4: "Sad", 5: "Surprise", 6: "Neutral"}
    detected_emotion = emotion_map.get(emotion, "unknown")

    return jsonify({"emotion": detected_emotion})

# Run the server
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))  # Use the dynamic port assigned by Render
    app.run(host='0.0.0.0', port=port)
