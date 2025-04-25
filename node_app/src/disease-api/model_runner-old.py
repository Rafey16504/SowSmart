import sys
import json
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image

model = load_model("plant_disease_prediction_model.h5")

class_labels = ["Healthy", "Bacterial Blight", "Leaf Rust", "Early Blight", "Late Blight"]

def preprocess_image(image_path):
    img = Image.open(image_path).resize((224, 224))
    img_array = np.array(img) / 255.0
    if img_array.shape[-1] == 4:
        img_array = img_array[..., :3]
    return np.expand_dims(img_array, axis=0)

if __name__ == "__main__":
    image_path = sys.argv[1]
    img = preprocess_image(image_path)
    prediction = model.predict(img, verbose=0)[0]
    predicted_class = class_labels[np.argmax(prediction)]
    confidence = float(np.max(prediction))

    result = {
        "disease": predicted_class,
    }

    print(json.dumps(result))
