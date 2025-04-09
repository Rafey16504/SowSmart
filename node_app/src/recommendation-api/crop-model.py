import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns


def prepare_dataset(df):
    if 'district' in df.columns:
        df.drop(columns=['district'], inplace=True)

    if 'label' in df.columns:
        df.rename(columns={'label': 'Crop'}, inplace=True)

    X = df.drop(columns=['Crop'])
    y = df['Crop']

    for col in X.columns:
        X[col] = pd.to_numeric(X[col], errors='coerce')

    na_mask = X.isna().any(axis=1)
    if na_mask.sum() > 0:
        print(f"Dropping {na_mask.sum()} rows with missing values.")
        X = X.dropna()
        y = y.loc[X.index]

    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    return X, y_encoded, label_encoder


def train_rf(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    rf_model = RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1)
    rf_model.fit(X_train, y_train)
    return rf_model, X_train.columns


def get_top_crops(rf_model, label_encoder, columns, sample, top_n=5):
    sample_df = pd.DataFrame([sample], columns=columns)
    probs = rf_model.predict_proba(sample_df)[0]
    top_indices = np.argsort(probs)[-top_n:][::-1]
    return [(label_encoder.classes_[i], probs[i] * 100) for i in top_indices]

import os

current_dir = os.path.dirname(__file__)
dataset_dir = os.path.normpath(os.path.join(current_dir, "..", "dataset"))


dataset_dir = os.path.normpath(dataset_dir)


punjab_df = pd.read_csv(os.path.join(dataset_dir, "Crop(Distric level).csv"))
india_df  = pd.read_csv(os.path.join(dataset_dir, "Crop_recommendation.csv"))


X_punjab, y_punjab, le_punjab = prepare_dataset(punjab_df)
rf_punjab, cols_punjab = train_rf(X_punjab, y_punjab)

X_india, y_india, le_india = prepare_dataset(india_df)
rf_india, cols_india = train_rf(X_india, y_india)


from sklearn.metrics import accuracy_score


y_pred_punjab = rf_punjab.predict(X_punjab)
acc_punjab = accuracy_score(y_punjab, y_pred_punjab)


y_pred_india = rf_india.predict(X_india)
acc_india = accuracy_score(y_india, y_pred_india)


def combined_top_crops_with_flags(N, P, K, temp, humidity, ph, rainfall, top_n=6):
    sample = [N, P, K, temp, humidity, ph, rainfall]

    punjab_preds = get_top_crops(rf_punjab, le_punjab, cols_punjab, sample, top_n=top_n)
    india_preds = get_top_crops(rf_india, le_india, cols_india, sample, top_n=top_n)

    combined_scores = {}
    flags = {}

    for model_name, preds in [('Punjab', punjab_preds), ('India', india_preds)]:
        for crop, prob in preds:
            if crop not in combined_scores:
                combined_scores[crop] = []
                flags[crop] = {'Punjab': False, 'India': False}
            flags[crop][model_name] = True

    avg_scores = [
        (crop)
        for crop in combined_scores.items()
    ]

    top_combined = sorted(avg_scores, key=lambda x: x[1], reverse=True)[:top_n]
    return top_combined

test_inputs =   [80, 35, 45, 28.0, 60.0, 6.3, 150.0]    # (90, 70, 60, 18.0, 55.0, 6.5, 100.0),
    # (30, 15, 20, 32.0, 45.0, 6.0, 50.0),
    # (100, 80, 75, 25.0, 85.0, 6.0, 250.0),
    # (70, 40, 50, 20.0, 50.0, 6.8, 80.0),
    # (40, 30, 35, 22.0, 60.0, 6.3, 120.0),




if __name__ == "__main__":
    import sys
    import json

    # print("🚀 Python script started", file=sys.stderr)
    args = list(map(float, sys.argv[1:]))
    # print(f"Received args: {args}", file=sys.stderr)

    try:
        top_crops = combined_top_crops_with_flags(*args, top_n=6)
        # print("✅ Got top crops", file=sys.stderr)

        result = [crop for crop, *_ in top_crops]


        # print("✅ JSON result built", file=sys.stderr)
        print(json.dumps(result))  # This prints valid JSON string
    except Exception as e:
        print(f"❌ Error occurred: {str(e)}", file=sys.stderr)

