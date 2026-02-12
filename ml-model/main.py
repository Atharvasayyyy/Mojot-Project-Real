from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from model import ml_model
import asyncio

app = FastAPI(
    title="IoT Engagement AI API",
    description="ML predictions for student engagement, stress, and hobby detection",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== DATA MODELS ====================
class SensorFeatures(BaseModel):
    heart_rate: float
    hrv_rmssd: float
    blood_oxygen: float
    motion_level: float
    restlessness_index: float

class PredictionResponse(BaseModel):
    engagement: dict
    stress: dict
    hobby: dict
    timestamp: str

class TrainingRequest(BaseModel):
    model_type: Optional[str] = "all"  # all, engagement, hobby, stress

# ==================== ENDPOINTS ====================

@app.get('/health')
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "IoT Engagement ML API",
        "version": "1.0.0"
    }

@app.post('/train', summary="Train ML Models")
async def train_models(request: TrainingRequest, background_tasks: BackgroundTasks):
    """
    Train machine learning models
    - engagement: Student engagement prediction
    - hobby: Hobby/interest prediction
    - stress: Stress level detection
    """
    try:
        model_type = request.model_type or "all"
        
        if model_type in ["all", "engagement"]:
            background_tasks.add_task(ml_model.train_engagement_model)
        
        if model_type in ["all", "hobby"]:
            background_tasks.add_task(ml_model.train_hobby_model)
        
        if model_type in ["all", "stress"]:
            background_tasks.add_task(ml_model.train_stress_model)
        
        return {
            "success": True,
            "message": f"Training started for: {model_type}",
            "models_training": model_type
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/predict', response_model=PredictionResponse, summary="Predict Engagement & Hobby")
async def predict(features: SensorFeatures):
    """
    Predict student engagement, stress level, and hobby/interest based on physiological data
    
    **Input Features:**
    - heart_rate: Heart rate in BPM (60-120)
    - hrv_rmssd: Heart rate variability RMSSD (20-100)
    - blood_oxygen: Blood oxygen percentage (95-100)
    - motion_level: Motion activity level (0-100)
    - restlessness_index: Restlessness indicator (0-100)
    
    **Output:**
    - engagement: Predicted engagement level with confidence
    - stress: Predicted stress level with confidence
    - hobby: Predicted hobby/interest with top 3 alternatives
    """
    try:
        features_dict = features.dict()
        predictions = ml_model.predict(features_dict)
        return predictions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post('/predict-batch', summary="Batch Prediction")
async def predict_batch(features_list: List[SensorFeatures]):
    """
    Make predictions on multiple sensor readings at once
    Returns array of predictions
    """
    try:
        predictions = []
        for features in features_list:
            features_dict = features.dict()
            pred = ml_model.predict(features_dict)
            predictions.append(pred)
        
        return {
            "success": True,
            "total_predictions": len(predictions),
            "predictions": predictions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/model-info', summary="Get Model Information")
async def model_info():
    """Get information about trained models"""
    return {
        "models": {
            "engagement": {
                "type": "Random Forest",
                "features": 5,
                "classes": ["low", "medium", "high"],
                "algorithm": "Random Forest Classifier"
            },
            "hobby": {
                "type": "Random Forest",
                "features": 5,
                "classes": ["sports", "reading", "gaming", "socializing", "coding"],
                "algorithm": "Random Forest Classifier"
            },
            "stress": {
                "type": "Random Forest",
                "features": 5,
                "classes": ["relaxed", "normal", "stressed"],
                "algorithm": "Random Forest Classifier"
            }
        },
        "feature_names": ml_model.feature_names,
        "version": "1.0.0"
    }

@app.post('/explain-prediction', summary="Get Prediction Explanation")
async def explain_prediction(features: SensorFeatures):
    """
    Get detailed explanation for predictions
    Including feature importance
    """
    try:
        features_dict = features.dict()
        predictions = ml_model.predict(features_dict)
        
        # Get feature importance
        if ml_model.engagement_model is not None:
            feature_importance = dict(zip(
                ml_model.feature_names,
                ml_model.engagement_model.feature_importances_.tolist()
            ))
        else:
            feature_importance = {}
        
        return {
            "predictions": predictions,
            "feature_importance": feature_importance,
            "interpretation": generate_interpretation(features_dict, predictions)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def generate_interpretation(features: dict, predictions: dict) -> str:
    """Generate human-readable interpretation of predictions"""
    engagement = predictions['engagement']['level']
    stress = predictions['stress']['level']
    hobby = predictions['hobby']['predicted']
    
    interpretation = f"""
    Based on the physiological data:
    - Heart Rate: {features['heart_rate']} BPM
    - HRV: {features['hrv_rmssd']}
    - Motion Level: {features['motion_level']}
    - Stress Indicator: {features['restlessness_index']}
    
    Predictions:
    - Student appears to be {engagement} in engagement
    - Student stress level is {stress}
    - Student shows interest in {hobby}
    
    Recommendation: Monitor and provide suitable activities matching predicted interests.
    """
    return interpretation.strip()

@app.get('/features', summary="Get Feature Definitions")
async def get_features():
    """Get definitions of all input features"""
    return {
        "features": {
            "heart_rate": {
                "description": "Heart rate in beats per minute",
                "unit": "bpm",
                "typical_range": [60, 120],
                "meaning": "Higher HR indicates higher physical activity or stress"
            },
            "hrv_rmssd": {
                "description": "Heart Rate Variability (Root Mean Square of Successive Differences)",
                "unit": "ms",
                "typical_range": [20, 100],
                "meaning": "Higher HRV indicates relaxation, lower indicates stress"
            },
            "blood_oxygen": {
                "description": "Blood oxygen saturation",
                "unit": "%",
                "typical_range": [95, 100],
                "meaning": "Lower values might indicate physical exertion"
            },
            "motion_level": {
                "description": "Physical motion/activity intensity",
                "unit": "0-100 scale",
                "typical_range": [0, 100],
                "meaning": "Higher values indicate more physical activity"
            },
            "restlessness_index": {
                "description": "Fidgeting and body movement indicator",
                "unit": "0-100 scale",
                "typical_range": [0, 100],
                "meaning": "Higher values indicate nervousness or discomfort"
            }
        }
    }

if __name__ == "__main__":
    import uvicorn
    
    # Train models on startup
    print("🚀 Starting IoT Engagement ML API...")
    print("📚 Training models...")
    
    ml_model.train_engagement_model()
    ml_model.train_hobby_model()
    ml_model.train_stress_model()
    
    print("✅ Models trained successfully!")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("ML_SERVICE_PORT", 8000))
    )
