# 🌾 Farmer AI — Professional Smart Crop Intelligence Platform

![Farmer AI Banner](docs/images/banner.png)

Farmer AI is a high-performance, professional-grade agricultural intelligence platform designed to empower farmers with data-driven decision-making. It combines advanced machine learning models, real-time data integration, and an intelligent AI advisory system within a premium, SaaS-style user interface.

---

## 🚀 Live Demo
**Check out the live website here:** [https://SajidAnsari786.github.io/FarmerAI-/](https://SajidAnsari786.github.io/FarmerAI-/)  
*(Note: The live demo runs in **Demo Mode**. For full AI functionality, please run the local backend.)*

---

## ✨ Key Features

### 1. Smart Crop Recommendation
*   **Predictive Engine:** Powered by a Random Forest Classifier trained on **5,430+ rows** of high-fidelity agronomic data.
*   **Coverage:** Supports **48 diverse Indian crops** including cereals, pulses, oilseeds, fruits, vegetables, spices, and plantation crops.
*   **Accuracy:** Achieves **~88% accuracy** with 5-fold cross-validation.

### 2. Precision Yield Estimation
*   **Yield Forecasting:** Integrated XGBoost Regressor for precise yield prediction based on soil conditions and farm area.
*   **Revenue Projection:** Automatically calculates estimated revenue based on current market prices and predicted yield.

### 3. Intelligent AI Advisor
*   **Knowledge Base:** Context-aware AI advisor trained on professional agronomic practices.
*   **Expert Guidance:** Get instant answers on pest control, fertilizer application, and soil health management.

### 4. Real-Time Market & Weather
*   **Market Prices:** Live MSP data for 2024-25 and mandi price trends across India.
*   **Weather Dashboard:** Hyper-local weather forecasting to plan irrigation and harvesting.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React, Lucide Icons, Vanilla CSS (Premium Glassmorphism) |
| **Backend** | FastAPI (Python), Uvicorn |
| **Machine Learning** | Scikit-Learn (Random Forest), XGBoost |
| **Data Processing** | Pandas, NumPy, Joblib |
| **Deployment** | GitHub Pages (Frontend), Cloud Run / Local (Backend) |

---

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/SajidAnsari786/FarmerAI-.git
cd FarmerAI-
```

### 2. Setup Backend
```bash
cd backend
pip install -r requirements.txt
python train_model.py  # To generate the ML models
python main.py         # To start the API server
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📊 Model Performance
*   **Crop Model Accuracy:** 87.66%
*   **Yield Model R² Score:** 97.8%
*   **Supported Crops:** 48 Varieties

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.
