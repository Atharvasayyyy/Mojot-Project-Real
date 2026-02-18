"""
🚀 Improved FastAPI Server for Student State Classification
Real predictions from database data
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from improved_model import StudentStateClassifier
from datetime import datetime
import uvicorn

# Initialize classifier
print("📦 Loading Student State Classifier...")
classifier = StudentStateClassifier(model_dir='models')

# Load trained model
if not classifier.load_model():
    print("⚠️  No trained model found. Please run improved_model.py first to train.")
    raise RuntimeError("Model not trained")

# FastAPI app
app = FastAPI(
    title="🧠 IoT Student State Classifier API",
    description="Multi-class classification: Relaxed, Engaged, Stressed, Bored",
    version="2.0.0"
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

class SensorInput(BaseModel):
    """Single sensor reading input"""
    heart_rate: float = Field(..., ge=40, le=150, description="Heart rate in BPM")
    hrv_rmssd: float = Field(..., ge=5, le=120, description="HRV RMSSD in ms")
    blood_oxygen: float = Field(..., ge=85, le=100, description="Blood oxygen %")
    motion_level: float = Field(..., ge=0, le=100, description="Motion activity level")
    restlessness_index: float = Field(..., ge=0, le=5, description="Restlessness index")

    class Config:
        json_schema_extra = {
            "example": {
                "heart_rate": 75,
                "hrv_rmssd": 45,
                "blood_oxygen": 97,
                "motion_level": 8,
                "restlessness_index": 0.12
            }
        }


class PredictionResponse(BaseModel):
    """Single prediction response"""
    state: str
    confidence: float
    probabilities: Dict[str, float]
    raw_features: Dict[str, float]
    timestamp: str


class BatchPredictionRequest(BaseModel):
    """Batch prediction request wrapper"""
    readings: List[SensorInput]
    
    class Config:
        json_schema_extra = {
            "example": {
                "readings": [
                    {
                        "heart_rate": 65,
                        "hrv_rmssd": 55,
                        "blood_oxygen": 98,
                        "motion_level": 5,
                        "restlessness_index": 0.08
                    },
                    {
                        "heart_rate": 75,
                        "hrv_rmssd": 45,
                        "blood_oxygen": 97,
                        "motion_level": 8,
                        "restlessness_index": 0.12
                    }
                ]
            }
        }


class SessionAnalysisRequest(BaseModel):
    """Request for session-level analysis"""
    sensor_data: List[SensorInput]


class SessionAnalysisResponse(BaseModel):
    """Session-level analysis response"""
    total_samples: int
    state_percentages: Dict[str, float]
    dominant_state: str
    state_counts: Dict[str, int]
    session_score: int
    recommendations: List[str]
    predictions: Optional[List[PredictionResponse]] = None


# ==================== ENDPOINTS ====================

@app.get('/health')
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Student State Classifier API",
        "version": "2.0.0",
        "model_loaded": classifier.model is not None,
        "states": classifier.states
    }


@app.post('/predict', response_model=PredictionResponse, summary="Predict Student State")
async def predict_state(sensor_input: SensorInput):
    """
    Predict student state from sensor data
    
    **States:**
    - Relaxed: Low HR, high HRV, minimal motion
    - Engaged: Normal HR, moderate HRV, low motion/restlessness
    - Stressed: High HR, low HRV, high restlessness
    - Bored: Low-normal HR, moderate HRV, high motion (fidgeting)
    
    **Returns:**
    - state: Predicted state
    - confidence: Prediction confidence (0-1)
    - probabilities: Probability for each state
    """
    try:
        sensor_data = sensor_input.dict()
        result = classifier.predict_single(sensor_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.post('/predict-batch', response_model=List[PredictionResponse], summary="Batch Prediction")
async def predict_batch(request: BatchPredictionRequest):
    """
    🎯 Predict states for multiple sensor readings at once
    
    **What it does:**
    - Takes multiple sensor readings
    - Runs ML model on each one
    - Returns predictions for all readings
    
    **Why batch?**
    - Faster than individual requests (automated processing)
    - Perfect for analyzing historical data
    - Great for testing 4 states at once
    - Good for session analysis
    
    **Example use cases:**
    - Test all 4 student states ✅
    - Analyze historical sensor data ✅
    - Bulk process multiple readings ✅
    - Verify model accuracy ✅
    """
    try:
        sensor_data_list = [s.dict() for s in request.readings]
        results = classifier.predict_batch(sensor_data_list)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")


@app.post('/analyze-session', response_model=SessionAnalysisResponse, summary="Analyze Complete Session")
async def analyze_session(request: SessionAnalysisRequest):
    """
    Analyze entire session and provide comprehensive insights
    
    **Returns:**
    - State distribution (percentages)
    - Dominant state
    - Session engagement score (0-100)
    - Actionable recommendations
    - Individual predictions (optional)
    """
    try:
        sensor_data_list = [s.dict() for s in request.sensor_data]
        analysis = classifier.analyze_session(sensor_data_list)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Session analysis failed: {str(e)}")


@app.get('/model-info', summary="Get Model Information")
async def get_model_info():
    """Get information about the trained model"""
    import json
    import os
    
    try:
        with open(os.path.join(classifier.model_dir, 'model_config.json'), 'r') as f:
            config = json.load(f)
        
        return {
            "model_type": "Random Forest Classifier",
            "states": classifier.states,
            "accuracy": config.get('accuracy', 'N/A'),
            "trained_at": config.get('trained_at', 'N/A'),
            "features": config.get('feature_cols', []),
            "feature_engineering": config.get('use_feature_engineering', False)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not load model info: {str(e)}")


@app.get('/states', summary="Get Available States")
async def get_states():
    """Get list of all possible states"""
    return {
        "states": classifier.states,
        "descriptions": {
            "Relaxed": "Low heart rate, high HRV, minimal motion - Student is calm and comfortable",
            "Engaged": "Normal heart rate, moderate HRV, low restlessness - Optimal learning state",
            "Stressed": "High heart rate, low HRV, high restlessness - High cognitive load or anxiety",
            "Bored": "Low-normal HR, high motion - Student is disengaged and fidgeting"
        }
    }


# ==================== TEST ENDPOINTS ====================

@app.get('/test/scenarios', summary="Get Test Scenarios")
async def get_test_scenarios():
    """Get sample test data for each state"""
    test_cases = [
        {
            'state': 'Engaged',
            'data': {
                'heart_rate': 75,
                'hrv_rmssd': 45,
                'blood_oxygen': 97,
                'motion_level': 8,
                'restlessness_index': 0.12
            }
        },
        {
            'state': 'Stressed',
            'data': {
                'heart_rate': 105,
                'hrv_rmssd': 22,
                'blood_oxygen': 95,
                'motion_level': 15,
                'restlessness_index': 0.65
            }
        },
        {
            'state': 'Bored',
            'data': {
                'heart_rate': 68,
                'hrv_rmssd': 52,
                'blood_oxygen': 97,
                'motion_level': 38,
                'restlessness_index': 0.38
            }
        },
        {
            'state': 'Relaxed',
            'data': {
                'heart_rate': 62,
                'hrv_rmssd': 65,
                'blood_oxygen': 98,
                'motion_level': 3,
                'restlessness_index': 0.04
            }
        }
    ]
    return {"test_cases": test_cases}


if __name__ == "__main__":
    print("\n" + "="*60)
    print("🚀 Starting Student State Classifier API")
    print("="*60)
    print(f"📍 URL: http://localhost:8000")
    print(f"📚 Docs: http://localhost:8000/docs")
    print(f"🧠 Model: Random Forest Classifier")
    print(f"🎯 States: {', '.join(classifier.states)}")
    print("="*60 + "\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
