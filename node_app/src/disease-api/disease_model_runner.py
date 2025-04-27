import sys
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from PIL import Image
import os
import requests
from dotenv import load_dotenv

load_dotenv()

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../../model/plant_disease_prediction_model.h5")
MODEL_URL = os.getenv("DISEASEMODEL_URL")

def download_model():
    if not MODEL_URL:
        raise ValueError("DISEASEMODEL_URL is not set in environment variables!")

    if not os.path.exists(MODEL_PATH):
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        print("Downloading model...")

        response = requests.get(MODEL_URL, stream=True)
        if response.status_code != 200:
            raise Exception(f"Failed to download model. Status code: {response.status_code}")

        temp_model_path = MODEL_PATH + ".tmp"

        with open(temp_model_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)

        os.rename(temp_model_path, MODEL_PATH)
        print("Model download complete!")

    if os.path.getsize(MODEL_PATH) < 10 * 1024 * 1024:
        raise Exception("Downloaded model file is too small. Something went wrong!")

download_model()

model = load_model("model/plant_disease_prediction_model.h5")

class_labels = [
    'Apple___Apple_scab',
    'Apple___Black_rot',
    'Apple___Cedar_apple_rust',
    'Apple___healthy',
    'Blueberry___healthy',
    'Cherry_(including_sour)_Powdery_mildew',
    'Cherry_(including_sour)_healthy',
    'Corn_(maize)_Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)_Common_rust',
    'Corn_(maize)_Northern_Leaf_Blight',
    'Corn_(maize)_healthy',
    'Grape___Black_rot',
    'Grape__Esca(Black_Measles)',
    'Grape__Leaf_blight(Isariopsis_Leaf_Spot)',
    'Grape___healthy',
    'Orange__Haunglongbing(Citrus_greening)',
    'Peach___Bacterial_spot',
    'Peach___healthy',
    'Pepper,bell__Bacterial_spot',
    'Pepper,bell__healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch',
    'Strawberry___healthy',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
]

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

    result = {
        "disease": predicted_class
    }

    print(json.dumps(result))
