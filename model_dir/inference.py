import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from PIL import Image
import io

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

# Load model
def model_fn(model_dir):
    model = load_model(f"{model_dir}/plant_disease_prediction_model.h5")
    return model

# Preprocess input
def input_fn(request_body, content_type='application/json'):
    if content_type == 'application/json':
        body = json.loads(request_body)
        img_bytes = np.array(body['image'], dtype=np.uint8)
        img = Image.fromarray(img_bytes)
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0
        if img_array.shape[-1] == 4:
            img_array = img_array[..., :3]
        return np.expand_dims(img_array, axis=0)
    else:
        raise ValueError(f"Unsupported content type: {content_type}")

# Prediction
def predict_fn(input_data, model):
    prediction = model.predict(input_data, verbose=0)[0]
    return prediction

# Format output
def output_fn(prediction, accept='application/json'):
    predicted_class = class_labels[np.argmax(prediction)]
    result = {"disease": predicted_class}
    return json.dumps(result), accept
