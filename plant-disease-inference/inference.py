import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from PIL import Image
import base64
import io

class_labels = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry_(including_sour)_Powdery_mildew', 'Cherry_(including_sour)_healthy',
    'Corn_(maize)_Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)_Common_rust',
    'Corn_(maize)_Northern_Leaf_Blight', 'Corn_(maize)_healthy', 'Grape___Black_rot',
    'Grape__Esca(Black_Measles)', 'Grape__Leaf_blight(Isariopsis_Leaf_Spot)', 'Grape___healthy',
    'Orange__Haunglongbing(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
    'Pepper,bell__Bacterial_spot', 'Pepper,bell__healthy', 'Potato___Early_blight',
    'Potato___Late_blight', 'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy',
    'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight',
    'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'
]

model = load_model("/var/task/plant_disease_prediction_model.h5")

def preprocess_image(image_base64):
    image_bytes = base64.b64decode(image_base64)
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    image_array = np.array(image) / 255.0
    return np.expand_dims(image_array, axis=0)

def lambda_handler(event, context):
    try:
        body = json.loads(event['body']) if 'body' in event else event
        image_b64 = body['image']
        input_tensor = preprocess_image(image_b64)
        prediction = model.predict(input_tensor)[0]
        predicted_class = class_labels[np.argmax(prediction)]

        return {
            'statusCode': 200,
            'body': json.dumps({'disease': predicted_class})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
