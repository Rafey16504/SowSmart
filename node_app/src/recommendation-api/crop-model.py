import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import os
import sys
import json

current_dir = os.path.dirname(__file__)
dataset_dir = os.path.normpath(os.path.join(current_dir, "..", "dataset"))

punjab_df = pd.read_csv(os.path.join(dataset_dir, "Crop(Distric level).csv"))
india_df  = pd.read_csv(os.path.join(dataset_dir, "Crop_recommendation.csv"))

def prepare_dataset(df):
    if 'district' in df.columns:
        df.drop(columns=['district'], inplace=True)
    if 'label' in df.columns:
        df.rename(columns={'label': 'Crop'}, inplace=True)

    X = df.drop(columns=['Crop'])
    y = df['Crop']

    for col in X.columns:
        X[col] = pd.to_numeric(X[col], errors='coerce')

    X = X.dropna()
    y = y.loc[X.index]

    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    return X, y_encoded, label_encoder

X_punjab, y_punjab, le_punjab = prepare_dataset(punjab_df)
X_india, y_india, le_india = prepare_dataset(india_df)

rf_punjab = RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1).fit(X_punjab, y_punjab)
rf_india  = RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1).fit(X_india, y_india)

def get_top_crops(rf_model, label_encoder, columns, sample, top_n=6):
    sample_df = pd.DataFrame([sample], columns=columns)
    probs = rf_model.predict_proba(sample_df)[0]
    top_indices = np.argsort(probs)[-top_n:][::-1]
    return [(label_encoder.classes_[i], probs[i] * 100) for i in top_indices]

def combined_top_crops_with_flags(N, P, K, temp, humidity, ph, rainfall, top_n=6):
    sample = [N, P, K, temp, humidity, ph, rainfall]

    punjab_preds = get_top_crops(rf_punjab, le_punjab, X_punjab.columns, sample, top_n)
    india_preds  = get_top_crops(rf_india,  le_india,  X_india.columns,  sample, top_n)

    combined_scores = {}
    for model_preds in [punjab_preds, india_preds]:
        for crop, prob in model_preds:
            if crop not in combined_scores:
                combined_scores[crop] = []
            combined_scores[crop].append(prob)

    avg_scores = [(crop, np.mean(scores)) for crop, scores in combined_scores.items()]
    top_combined = sorted(avg_scores, key=lambda x: x[1], reverse=True)[:top_n]
    return [crop for crop, _ in top_combined]

if __name__ == "__main__":
    try:
        ph, temp, humidity, rainfall = map(float, sys.argv[1:])
        N = round(10 * ph + 20)
        P = round(5 * ph + 10)
        K = round(7 * ph + 15)

        top_crops = combined_top_crops_with_flags(N, P, K, temp, humidity, ph, rainfall, top_n=6)
        print(json.dumps(top_crops))  

    except Exception as e:
        print(f"Error occurred: {str(e)}", file=sys.stderr)
        sys.exit(1)