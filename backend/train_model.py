# -*- coding: utf-8 -*-
"""
Farmer AI - ML Model Training Script
Trains:
  1. Random Forest Classifier - Crop Recommendation
  2. XGBoost Regressor        - Yield Prediction
  3. Soil Health metadata
"""

import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder, OrdinalEncoder
from sklearn.metrics import classification_report, accuracy_score, r2_score
from xgboost import XGBRegressor
import joblib
import warnings
warnings.filterwarnings("ignore")

# ── Paths ─────────────────────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
DATA_PATH  = os.path.join(BASE_DIR, "data", "crop_data.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")

AUGMENT_FACTOR = 12

# ── Crop catalogue ─────────────────────────────────────────────────────────────
CROP_INFO = {
    "rice":        {"icon": "grains",  "season": "Kharif",  "base_yield": 45,  "market_price": 2000},
    "wheat":       {"icon": "plant",   "season": "Rabi",    "base_yield": 35,  "market_price": 2150},
    "maize":       {"icon": "corn",    "season": "Kharif",  "base_yield": 55,  "market_price": 1850},
    "chickpea":    {"icon": "bean",    "season": "Rabi",    "base_yield": 18,  "market_price": 5200},
    "kidneybeans": {"icon": "bean",    "season": "Kharif",  "base_yield": 15,  "market_price": 5800},
    "pigeonpeas":  {"icon": "pod",     "season": "Kharif",  "base_yield": 14,  "market_price": 6300},
    "mothbeans":   {"icon": "sprout",  "season": "Kharif",  "base_yield": 10,  "market_price": 5500},
    "mungbean":    {"icon": "pod",     "season": "Kharif",  "base_yield": 12,  "market_price": 6000},
    "blackgram":   {"icon": "plant",   "season": "Kharif",  "base_yield": 13,  "market_price": 5700},
    "lentil":      {"icon": "bean",    "season": "Rabi",    "base_yield": 11,  "market_price": 5400},
    "sugarcane":   {"icon": "cane",    "season": "Kharif",  "base_yield": 700, "market_price": 315},
    "cotton":      {"icon": "cloud",   "season": "Kharif",  "base_yield": 20,  "market_price": 6600},
    "jute":        {"icon": "plant",   "season": "Kharif",  "base_yield": 25,  "market_price": 4200},
    "coffee":      {"icon": "coffee",  "season": "Zaid",    "base_yield": 22,  "market_price": 8000},
    "banana":      {"icon": "banana",  "season": "Kharif",  "base_yield": 400, "market_price": 2500},
    "mango":       {"icon": "mango",   "season": "Zaid",    "base_yield": 80,  "market_price": 4500},
    "grapes":      {"icon": "grapes",  "season": "Rabi",    "base_yield": 200, "market_price": 5500},
    "watermelon":  {"icon": "melon",   "season": "Zaid",    "base_yield": 300, "market_price": 1800},
    "apple":       {"icon": "apple",   "season": "Rabi",    "base_yield": 120, "market_price": 8500},
    "orange":      {"icon": "orange",  "season": "Zaid",    "base_yield": 150, "market_price": 4000},
    "papaya":      {"icon": "papaya",  "season": "Zaid",    "base_yield": 350, "market_price": 2800},
    "coconut":     {"icon": "coconut", "season": "Kharif",  "base_yield": 100, "market_price": 3200},
}

CROP_TIPS = {
    "rice":        "Ensure standing water 5-10cm during seedling stage. Apply split doses of Nitrogen.",
    "wheat":       "Irrigate at CRI (21 days), tillering, jointing, and grain-filling stages.",
    "maize":       "Plant at 20cm spacing. Use 30kg/ha Zinc Sulphate for micronutrient boost.",
    "chickpea":    "No irrigation needed if rainfall is over 500mm. Avoid waterlogging.",
    "kidneybeans": "Provide trellis support. Harvest pods when fully dry.",
    "pigeonpeas":  "Deep-rooted, drought tolerant. Good for intercropping with short-duration crops.",
    "mothbeans":   "Extremely drought tolerant. Grows well in sandy soils with low water.",
    "mungbean":    "Short duration (60-75 days). Excellent for crop rotation.",
    "blackgram":   "Sensitive to waterlogging. Ensure good field drainage.",
    "lentil":      "Inoculate seeds with Rhizobium before sowing for nitrogen fixation.",
    "sugarcane":   "Ratoon cropping for 2-3 seasons. Requires 150-200cm annual rainfall.",
    "cotton":      "Use drip irrigation. Monitor regularly for bollworm infestation.",
    "jute":        "Requires humid climate. Retting in water needed for fiber extraction.",
    "coffee":      "Shade-grown coffee has superior flavor. Requires acidic soil (pH 5-6).",
    "banana":      "Apply 200g N, 60g P2O5, 300g K2O per plant annually.",
    "mango":       "Requires dry weather at flowering. Avoid irrigation during this period.",
    "grapes":      "Train on trellis. Prune annually for quality fruit production.",
    "watermelon":  "Use black plastic mulch to retain moisture and suppress weeds.",
    "apple":       "Requires 1000+ chilling hours below 7C. Hill areas are ideal.",
    "orange":      "Apply Zinc and Boron micronutrients for better fruit quality.",
    "papaya":      "Fast-growing (6-9 months to first harvest). Protect from frost.",
    "coconut":     "Plant at 7.5m x 7.5m spacing. Apply 1.3kg Urea per palm per year.",
}


def augment_data(df, factor=AUGMENT_FACTOR):
    """Add Gaussian noise to numeric columns to increase dataset size."""
    np.random.seed(42)
    numeric_cols = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
    rows = []
    for _, row in df.iterrows():
        for _ in range(factor):
            new_row = row.copy()
            for col in numeric_cols:
                std = max(row[col] * 0.06, 0.5)
                new_row[col] = max(0, row[col] + np.random.normal(0, std))
            new_row["ph"]       = np.clip(new_row["ph"], 0, 14)
            new_row["humidity"] = np.clip(new_row["humidity"], 0, 100)
            rows.append(new_row)
    aug = pd.DataFrame(rows)
    full = pd.concat([df, aug], ignore_index=True)
    return full.sample(frac=1, random_state=42).reset_index(drop=True)


def generate_yield(row):
    """Estimate yield (quintals/ha) using a domain-based formula."""
    b = CROP_INFO.get(row["crop"], {"base_yield": 30})["base_yield"]
    noise  = np.random.normal(0, b * 0.08)
    factor = 1.0
    if 5.5 <= row["ph"] <= 7.5:   factor += 0.06
    if row["humidity"] > 65:       factor += 0.04
    if row["N"] > 60:              factor += 0.03
    return round(max(b * factor + noise, b * 0.4), 2)


def compute_soil_health(N, P, K, ph):
    score  = 25 if 60 <= N <= 120  else (15 if 30 <= N < 60  else 5)
    score += 25 if 30 <= P <= 100  else (15 if 15 <= P < 30 or 100 < P <= 150 else 5)
    score += 25 if 30 <= K <= 100  else (15 if 15 <= K < 30  else 5)
    score += 25 if 6.0 <= ph <= 7.5 else (15 if 5.5 <= ph < 6.0 or 7.5 < ph <= 8.0 else 5)
    return min(score, 100)


def train():
    os.makedirs(MODELS_DIR, exist_ok=True)

    print("[INFO] Loading dataset from:", DATA_PATH)
    df = pd.read_csv(DATA_PATH)
    df.columns = df.columns.str.strip()
    df["crop"] = df["crop"].str.strip().str.lower()
    df.dropna(inplace=True)

    if "season"    not in df.columns: df["season"]    = "Kharif"
    if "soil_type" not in df.columns: df["soil_type"] = "Loamy"
    df["season"]    = df["season"].str.strip()
    df["soil_type"] = df["soil_type"].str.strip()

    print(f"[INFO] Rows: {len(df)}, Crops: {df['crop'].nunique()}: {sorted(df['crop'].unique())}")

    print(f"[INFO] Augmenting dataset (x{AUGMENT_FACTOR})...")
    df_aug = augment_data(df, factor=AUGMENT_FACTOR)
    print(f"[INFO] Augmented rows: {len(df_aug)}")

    # ── Encoders ──────────────────────────────────────────────────────────────
    le = LabelEncoder()
    le.fit(df_aug["crop"])

    season_enc = OrdinalEncoder(categories=[["Kharif", "Rabi", "Zaid"]])
    soil_enc   = OrdinalEncoder(categories=[["Sandy", "Loamy", "Clayey"]])

    df_aug["season_enc"] = season_enc.fit_transform(df_aug[["season"]])
    df_aug["soil_enc"]   = soil_enc.fit_transform(df_aug[["soil_type"]])

    # ── Crop Recommendation (Random Forest) ───────────────────────────────────
    print("\n[TRAIN] Crop Recommendation Model (Random Forest)...")
    features = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall",
                "season_enc", "soil_enc"]

    X = df_aug[features].values
    y = le.transform(df_aug["crop"])

    scaler   = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_tr, X_te, y_tr, y_te = train_test_split(
        X_scaled, y, test_size=0.15, random_state=42, stratify=y
    )
    rf = RandomForestClassifier(
        n_estimators=300, max_depth=25, min_samples_split=2,
        random_state=42, n_jobs=-1, class_weight="balanced"
    )
    rf.fit(X_tr, y_tr)
    y_pred = rf.predict(X_te)
    acc = accuracy_score(y_te, y_pred)
    print(f"[RESULT] Accuracy: {acc:.4f}")
    print(classification_report(y_te, y_pred, target_names=le.classes_))

    crop_model = {
        "model": rf, "scaler": scaler, "label_encoder": le,
        "features": features, "season_encoder": season_enc, "soil_encoder": soil_enc,
        "crop_info": CROP_INFO, "crop_tips": CROP_TIPS,
    }
    joblib.dump(crop_model, os.path.join(MODELS_DIR, "crop_model.pkl"))
    print("[SAVED] crop_model.pkl")

    # ── Yield Prediction (XGBoost) ─────────────────────────────────────────────
    print("\n[TRAIN] Yield Prediction Model (XGBoost)...")
    np.random.seed(42)
    df_aug["yield_qty"]    = df_aug.apply(generate_yield, axis=1)
    df_aug["crop_encoded"] = le.transform(df_aug["crop"])

    yield_features = features + ["crop_encoded"]
    X_y = df_aug[yield_features].values
    y_y = df_aug["yield_qty"].values

    yield_scaler    = StandardScaler()
    X_y_scaled      = yield_scaler.fit_transform(X_y[:, :len(features)])
    X_y_full        = np.column_stack([X_y_scaled, X_y[:, -1]])

    Xt, Xv, yt, yv = train_test_split(X_y_full, y_y, test_size=0.15, random_state=42)
    xgb = XGBRegressor(
        n_estimators=300, max_depth=7, learning_rate=0.08,
        subsample=0.8, colsample_bytree=0.8, random_state=42, verbosity=0
    )
    xgb.fit(Xt, yt, eval_set=[(Xv, yv)], verbose=False)
    r2 = r2_score(yv, xgb.predict(Xv))
    print(f"[RESULT] R2 Score: {r2:.4f}")

    yield_model = {
        "model": xgb, "scaler": yield_scaler, "label_encoder": le,
        "features": yield_features, "season_encoder": season_enc, "soil_encoder": soil_enc,
    }
    joblib.dump(yield_model, os.path.join(MODELS_DIR, "yield_model.pkl"))
    print("[SAVED] yield_model.pkl")

    # ── Soil metadata ──────────────────────────────────────────────────────────
    soil_meta = {
        "mean_N": float(df["N"].mean()), "mean_P": float(df["P"].mean()),
        "mean_K": float(df["K"].mean()), "mean_ph": float(df["ph"].mean()),
    }
    joblib.dump(soil_meta, os.path.join(MODELS_DIR, "soil_meta.pkl"))
    print("[SAVED] soil_meta.pkl")

    print(f"\n[DONE] All models saved in: {MODELS_DIR}")
    print(f"[INFO] Supported crops: {list(le.classes_)}")


if __name__ == "__main__":
    train()
