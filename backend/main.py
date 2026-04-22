"""
Farmer AI - FastAPI Backend (v2.0 Advanced)
Endpoints: /predict, /yield, /soil-health, /weather, /health
Same features as KrishiMind but more advanced with:
 - Season + Soil Type features
 - Soil health scoring + nutrient diagnostics
 - Farming tips per crop
 - Revenue estimation
"""

import os
import numpy as np
import joblib
import httpx
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from contextlib import asynccontextmanager
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

OPENWEATHER_KEY = os.getenv("OPENWEATHER_API_KEY", "")
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# ── Global model holders ──────────────────────────────────────────────────────
crop_model_data  = None
yield_model_data = None
soil_meta        = None

CROP_ICONS = {
    "rice": "🌾", "wheat": "🌿", "maize": "🌽", "chickpea": "🫘",
    "kidneybeans": "🫘", "pigeonpeas": "🫛", "mothbeans": "🌱",
    "mungbean": "🫛", "blackgram": "🌿", "lentil": "🫘",
    "sugarcane": "🎋", "cotton": "☁️", "jute": "🌿", "coffee": "☕",
    "banana": "🍌", "mango": "🥭", "grapes": "🍇", "watermelon": "🍉",
    "apple": "🍎", "orange": "🍊", "papaya": "🍈", "coconut": "🥥",
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

SOIL_RECS = {
    "low_N":   "Apply Urea (46% N) at 65-70 kg/acre or FYM 5t/acre.",
    "low_P":   "Apply SSP (16% P2O5) at 100 kg/acre or DAP at 50 kg/acre.",
    "low_K":   "Apply MOP (60% K2O) at 33 kg/acre or Potassium Sulphate at 50 kg/acre.",
    "high_ph": "Apply Gypsum (500kg/acre) or organic matter to lower soil pH.",
    "low_ph":  "Apply Agricultural Lime (CaCO3) at 200-500 kg/acre to raise pH.",
    "balanced":"Soil nutrients are well-balanced. Maintain organic matter levels.",
}


@asynccontextmanager
async def lifespan(app: FastAPI):
    global crop_model_data, yield_model_data, soil_meta
    for name, path in [
        ("Crop model",  os.path.join(MODELS_DIR, "crop_model.pkl")),
        ("Yield model", os.path.join(MODELS_DIR, "yield_model.pkl")),
        ("Soil meta",   os.path.join(MODELS_DIR, "soil_meta.pkl")),
    ]:
        if os.path.exists(path):
            data = joblib.load(path)
            if "Crop" in name:   crop_model_data  = data
            elif "Yield" in name: yield_model_data = data
            else:                 soil_meta        = data
            print(f"[OK] {name} loaded")
        else:
            print(f"[WARN] {name} not found - run train_model.py first")
    yield


app = FastAPI(title="Farmer AI", version="2.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)


# ── Schemas ───────────────────────────────────────────────────────────────────
class FarmerInput(BaseModel):
    N: float           = Field(..., ge=0, le=200, description="Nitrogen (kg/ha)")
    P: float           = Field(..., ge=0, le=200, description="Phosphorus (kg/ha)")
    K: float           = Field(..., ge=0, le=300, description="Potassium (kg/ha)")
    temperature: float = Field(..., ge=-10, le=60, description="Avg Temperature (C)")
    humidity: float    = Field(..., ge=0, le=100, description="Relative Humidity (%)")
    ph: float          = Field(..., ge=0, le=14,  description="Soil pH")
    rainfall: float    = Field(..., ge=0, le=500, description="Annual Rainfall (mm)")
    season: Optional[str]    = Field("Kharif", description="Growing Season")
    soil_type: Optional[str] = Field("Loamy",  description="Soil Type")
    farm_area: Optional[float] = Field(1.0,    description="Farm area in hectares")

class YieldInput(FarmerInput):
    crop: str = Field(..., description="Crop name")


# ── Helpers ───────────────────────────────────────────────────────────────────
def _soil_health(N, P, K, ph):
    s  = 25 if 60 <= N <= 120  else (15 if 30 <= N < 60 else 5)
    s += 25 if 30 <= P <= 100  else (15 if 15 <= P < 30 or 100 < P <= 150 else 5)
    s += 25 if 30 <= K <= 100  else (15 if 15 <= K < 30 else 5)
    s += 25 if 6.0 <= ph <= 7.5 else (15 if 5.5 <= ph < 6.0 or 7.5 < ph <= 8.0 else 5)
    return min(s, 100)


def _soil_advice(N, P, K, ph):
    tips = []
    if N < 40:   tips.append(SOIL_RECS["low_N"])
    if P < 20:   tips.append(SOIL_RECS["low_P"])
    if K < 20:   tips.append(SOIL_RECS["low_K"])
    if ph > 8.0: tips.append(SOIL_RECS["high_ph"])
    if ph < 5.5: tips.append(SOIL_RECS["low_ph"])
    return tips or [SOIL_RECS["balanced"]]


def _encode_ctx(data, model_data):
    se = model_data["season_encoder"]
    te = model_data["soil_encoder"]
    season = data.season if data.season in ["Kharif","Rabi","Zaid"] else "Kharif"
    soil   = data.soil_type if data.soil_type in ["Sandy","Loamy","Clayey"] else "Loamy"
    return se.transform([[season]])[0][0], te.transform([[soil]])[0][0]


# ── Endpoints ─────────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "crop_model":  crop_model_data  is not None,
        "yield_model": yield_model_data is not None,
    }


@app.post("/predict")
async def predict_crop(data: FarmerInput):
    if not crop_model_data:
        raise HTTPException(503, "Crop model not loaded. Run train_model.py first.")

    model, scaler, le = crop_model_data["model"], crop_model_data["scaler"], crop_model_data["label_encoder"]
    crop_info = crop_model_data.get("crop_info", {})
    se, te = _encode_ctx(data, crop_model_data)

    feat = np.array([[data.N, data.P, data.K, data.temperature,
                      data.humidity, data.ph, data.rainfall, se, te]])
    probs = model.predict_proba(scaler.transform(feat))[0]
    top5  = np.argsort(probs)[::-1][:5]

    recs = []
    for idx in top5:
        name = le.inverse_transform([idx])[0]
        info = crop_info.get(name, {})
        recs.append({
            "crop": name,
            "confidence": round(float(probs[idx]) * 100, 2),
            "icon": CROP_ICONS.get(name, "🌱"),
            "season": info.get("season", "Kharif"),
            "market_price_per_quintal": info.get("market_price", 0),
            "tip": CROP_TIPS.get(name, "Follow standard agronomy practices."),
        })

    return {
        "recommendations": recs,
        "soil_health_score": _soil_health(data.N, data.P, data.K, data.ph),
        "soil_advice": _soil_advice(data.N, data.P, data.K, data.ph),
        "input": data.model_dump(),
    }


@app.post("/yield")
async def predict_yield(data: YieldInput):
    if not yield_model_data:
        raise HTTPException(503, "Yield model not loaded. Run train_model.py first.")

    model, scaler, le = yield_model_data["model"], yield_model_data["scaler"], yield_model_data["label_encoder"]
    crop_info = crop_model_data.get("crop_info", {}) if crop_model_data else {}

    try:
        ce = le.transform([data.crop.lower()])[0]
    except ValueError:
        raise HTTPException(400, f"Unknown crop: {data.crop}")

    se, te = _encode_ctx(data, yield_model_data)
    soil = np.array([[data.N, data.P, data.K, data.temperature,
                      data.humidity, data.ph, data.rainfall, se, te]])
    full = np.column_stack([scaler.transform(soil), [[ce]]])
    predicted = float(model.predict(full)[0])
    area  = data.farm_area or 1.0
    total = predicted * area
    info  = crop_info.get(data.crop.lower(), {})
    price = info.get("market_price", 0)

    return {
        "crop": data.crop,
        "predicted_yield_quintals_per_hectare": round(predicted, 2),
        "total_yield_quintals": round(total, 2),
        "farm_area_hectares": area,
        "estimated_revenue_inr": round((total / 100) * price, 2),
        "market_price_per_quintal": price,
        "input": data.model_dump(),
    }


@app.post("/soil-health")
async def soil_health_check(data: FarmerInput):
    score = _soil_health(data.N, data.P, data.K, data.ph)
    grade = "Excellent" if score >= 80 else ("Good" if score >= 60 else ("Fair" if score >= 40 else "Poor"))
    return {
        "soil_health_score": score,
        "grade": grade,
        "color": {"Excellent":"green","Good":"lime","Fair":"yellow","Poor":"red"}[grade],
        "nutrient_levels": {
            "nitrogen":   {"value": data.N,  "status": "optimal" if 60 <= data.N <= 120 else ("low" if data.N < 60 else "high")},
            "phosphorus": {"value": data.P,  "status": "optimal" if 30 <= data.P <= 100 else ("low" if data.P < 30 else "high")},
            "potassium":  {"value": data.K,  "status": "optimal" if 30 <= data.K <= 100 else ("low" if data.K < 30 else "high")},
            "ph":         {"value": data.ph, "status": "optimal" if 6.0 <= data.ph <= 7.5 else ("acidic" if data.ph < 6.0 else "alkaline")},
        },
        "recommendations": _soil_advice(data.N, data.P, data.K, data.ph),
    }


@app.get("/weather")
async def get_weather(city: str = Query(..., min_length=1)):
    if not OPENWEATHER_KEY or OPENWEATHER_KEY == "your_key_here":
        raise HTTPException(500, "OpenWeatherMap API key not configured. Set OPENWEATHER_API_KEY in .env")

    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {"q": city, "appid": OPENWEATHER_KEY, "units": "metric"}
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url, params=params, timeout=10)
            if resp.status_code != 200:
                err = resp.json()
                raise HTTPException(resp.status_code, err.get("message", "Weather API error"))
            raw = resp.json()
        except httpx.RequestError as e:
            raise HTTPException(502, f"Weather API unreachable: {e}")

    return {
        "city": raw.get("name", city),
        "temperature": raw["main"]["temp"],
        "feels_like":  raw["main"]["feels_like"],
        "humidity":    raw["main"]["humidity"],
        "pressure":    raw["main"]["pressure"],
        "wind_speed":  raw["wind"]["speed"],
        "description": raw["weather"][0]["description"],
        "icon":        raw["weather"][0]["icon"],
        "rainfall":    raw.get("rain", {}).get("1h", 0),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
