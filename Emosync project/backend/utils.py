import numpy as np
from PIL import Image

def preprocess_image(image):
    # Resize to the input size of your model (e.g., 48x48 for emotion detection)
    image = image.resize((48, 48))
    image = image.convert("L")  # Convert to grayscale if necessary
    image_array = np.array(image) / 255.0  # Normalize pixel values
    return image_array
