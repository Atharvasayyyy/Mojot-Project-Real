# 🔄 Complete End-to-End Data Flow

## 📊 STEP 1 - User Starts Activity (Frontend → Backend)

### Frontend Action:

Student opens app and selects activity:

```
Activity = "Maths"
Device ID = "ESP32-001"
```

### API Request:

```http
POST /api/sessions/start
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "activity": "Maths",
  "deviceId": "ESP32-001",
  "sessionType": "classroom",
  "sessionName": "Maths Session"
}
```

### Backend Response:

```json
{
  "success": true,
  "message": "Session started",
  "session": {
    "_id": "S001",
    "userId": "U001",
    "activity": "Maths",
    "deviceId": "ESP32-001",
    "isActive": true,
    "status": "ongoing",
    "startTime": "2024-02-13T10:00:00Z"
  }
}
```

✅ Session created and active in database

---

## 📡 STEP 2 - Backend Sends Session Info to ESP32

### ESP32 Pulls Session (Option A - Recommended):

```cpp
// Arduino Code
GET /api/sessions/current?apiKey=device_secret_key_for_esp32
```

### Backend Response:

```json
{
  "success": true,
  "sessionId": "S001",
  "userId": "U001",
  "activity": "Maths",
  "isActive": true,
  "status": "ongoing",
  "startTime": "2024-02-13T10:00:00Z"
}
```

✅ ESP32 knows which session to send data to

---

## 🔌 STEP 3 - ESP32 Collects Sensor Data

### Sensors Detect (Every 5 seconds):

```
Heart Rate: 78 bpm
HRV RMSSD: 42 ms
Motion Level: 9.8 (0-100)
SpO2: 98%
Restlessness Index: 0.012
```

### ESP32 Creates Telemetry:

```json
{
  "sessionId": "S001",
  "userId": "U001",
  "timestamp": 1707816000,
  "heartRate": 78,
  "hrvRmssd": 42,
  "spo2": 98,
  "motionLevel": 9.8,
  "restlessnessIndex": 0.012,
  "deviceId": "ESP32-001"
}
```

---

## 📤 STEP 4 - ESP32 Sends Data to Backend

### API Request (Every 5-10 seconds):

```http
POST /api/sensor-data/arduino/data
Content-Type: application/json

{
  "sessionId": "S001",
  "userId": "U001",
  "timestamp": 1707816000,
  "heartRate": 78,
  "hrvRmssd": 42,
  "spo2": 98,
  "motionLevel": 9.8,
  "restlessnessIndex": 0.012,
  "deviceId": "ESP32-001"
}
```

### Backend Does:

1. ✅ Validates data format
2. ✅ Stores in MongoDB (SensorData collection)
3. ✅ Calls ML Model for prediction
4. ✅ Generates analytics

### Backend Response:

```json
{
  "success": true,
  "message": "Sensor data recorded and analyzed",
  "data": {
    "_id": "SDR001",
    "sessionId": "S001",
    "heartRate": 78,
    "processed": true
  },
  "prediction": {
    "engagement": 0.82,
    "stress": 0.28,
    "hobby": "problem-solving",
    "confidence": 0.91
  }
}
```

✅ Data stored and ML model processes it

---

## 🧠 STEP 5 - ML Engine Processes Data

### ML Model Receives:

```json
{
  "features": {
    "heartRate": 78,
    "hrv_rmssd": 42,
    "bloodOxygen": 98,
    "motionLevel": 9.8,
    "restlessnessIndex": 0.012
  }
}
```

### ML Model Processes (FastAPI on port 8000):

```
Python Random Forest Model
├─ Engagement Model: Analyzes all features
├─ Stress Model: Detects stress indicators
└─ Hobby Model: Predicts interests

Processing Time: ~5ms
Accuracy: 100% (trained)
```

### ML Output:

```json
{
  "success": true,
  "predictions": {
    "engagement": 0.82,
    "stress": 0.28,
    "hobby": "problem-solving",
    "confidence": 0.91,
    "alternatives": ["reading", "coding"],
    "reasoning": {
      "high_engagement_factors": "Stable heart rate, good motion, low restlessness",
      "stress_level": "Low - Student is calm"
    }
  },
  "processing_time_ms": 4.23
}
```

✅ Backend stores this in Prediction collection

---

## 📊 STEP 6 - Frontend Fetches Analytics

### Frontend Request (Every 10 seconds, real-time):

```http
GET /api/analytics/session/S001
Authorization: Bearer {JWT_TOKEN}
```

### Backend Returns Live Data:

```json
{
  "success": true,
  "data": {
    "sessionId": "S001",
    "activity": "Maths",
    "duration": 5,
    "engagementScore": 82,
    "stressScore": 28,
    "state": "Engaged",
    "avgHeartRate": 78,
    "maxHeartRate": 92,
    "minHeartRate": 65,
    "avgMotion": 9.8,
    "totalDataPoints": 12
  }
}
```

### Frontend Renders:

```
📊 Dashboard Update:
├─ Engagement: ████████░░ 82% (Engaged ✅)
├─ Stress: ██░░░░░░░░ 28% (Calm ✅)
├─ Heart Rate: 78 bpm (Normal ✅)
├─ Activity: Maths
├─ Duration: 5 minutes
├─ Predicted Hobby: Problem-solving (91%)
└─ Status: 🎯 Focused & Engaged

📈 Chart Updates Every 10 Seconds
```

✅ User sees live data in beautiful dashboard

---

## 🔐 Security Flow

```
Frontend (React)
    ↓
[JWT Token Validation]
    ↓
Backend (Node.js)
    ↓
[Verify User ID]
    ↓
[Check Session Ownership]
    ↓
Allow ESP32 Data Processing
    ↓
✅ Only user's own data accessible
```

---

## 🔄 Real-Time vs Historical Flow

### 🔴 Real-Time Flow (Live Dashboard)

```
ESP32 → Backend
    ↓
ML Model Prediction
    ↓
WebSocket/API Push
    ↓
Frontend Graph Updates (Live)
```

### 🔵 Historical Flow (Reports)

```
Frontend Request
    ↓
Backend Query Database
    ↓
Aggregate Past Data
    ↓
Generate Report
    ↓
Frontend Shows Report
```

---

## 📡 Technical Stack Mapping

### Frontend (React - Port 3000)

✅ User login
✅ Start session
✅ Show dashboard
✅ Fetch analytics every 10 seconds
✅ Display live charts

### Backend (Node.js - Port 5000)

✅ Session management
✅ User authentication & JWT
✅ Sensor data storage
✅ ML model triggering
✅ Analytics aggregation
✅ API responses

### ML Model (Python - Port 8000)

✅ Engagement prediction
✅ Stress detection
✅ Hobby classification
✅ Feature importance
✅ ~5ms inference time

### Database (MongoDB Atlas)

✅ Users collection
✅ Sessions collection
✅ SensorData collection
✅ Predictions collection
✅ Alerts collection

### ESP32 Wearable

✅ Heart rate sensor
✅ Motion sensor
✅ SpO2 sensor
✅ WiFi connectivity
✅ JSON data payload

---

## 📋 Complete API Endpoints

### Authentication

```
POST   /api/auth/register              Register user
POST   /api/auth/login                 Login user
POST   /api/auth/verify                Verify JWT token
```

### Sessions (STEP 1)

```
POST   /api/sessions/start             Start new session
GET    /api/sessions/current           Get active session
GET    /api/sessions/:id               Get session details
POST   /api/sessions/:id/end           End session
GET    /api/sessions                   Get all sessions
```

### Sensor Data (STEP 4)

```
POST   /api/sensor-data/arduino/data   ESP32 sends data
GET    /api/sensor-data/:sessionId     Get sensor readings
GET    /api/sensor-data/stats/:id      Get session stats
```

### Analytics (STEP 6)

```
GET    /api/analytics/session/:id      Get session analytics
GET    /api/analytics/weekly           Get weekly stats
GET    /api/analytics/activities       Get activity breakdown
GET    /api/analytics/summary          Get dashboard summary
```

### Predictions

```
GET    /api/predictions/:sessionId     Get predictions
GET    /api/predictions/latest         Get latest prediction
POST   /api/predictions/:id/feedback   User feedback
```

---

## 🚀 Data Flow Diagram

```
┌─────────────────────┐
│  Frontend React     │
│  (Port 3000)        │
│                     │
│ • Login/Register    │
│ • Start Session     │
│ • Show Dashboard    │
│ • Fetch Analytics   │
└──────────┬──────────┘
           │
           │ POST /sessions/start
           │ Authorization: JWT
           ▼
┌─────────────────────┐
│  Backend API        │
│  (Port 5000)        │
│                     │
│ • Validate JWT      │
│ • Create Session    │
│ • Receive Data      │
│ • Call ML Model     │
│ • Store Analytics   │
└─────────┬───────────┘
          │
     ┌────┼────┐
     │         │
     ▼         ▼
┌─────────┐  ┌──────────────┐
│ MongoDB │  │ ML Model     │
│ Atlas   │  │ (Port 8000)  │
│         │  │              │
│ Store   │  │ • Engagement │
│ Data    │  │ • Stress     │
└─────────┘  │ • Hobby      │
             └──────────────┘

     │
     │ ESP32 Sends Data
     │ Every 5 seconds
     ▼
┌─────────────────────┐
│  ESP32 Wearable     │
│                     │
│ • Heart Rate        │
│ • HRV               │
│ • Motion            │
│ • SpO2              │
└─────────────────────┘
```

---

## ✅ One Complete Cycle (Timeline)

```
T+0s    Student clicks "Start Session"
        ↓
        Frontend sends POST /sessions/start
        ↓
T+0.5s  Backend creates session S001
        ↓
        Returns sessionId to frontend
        ↓
T+1s    Frontend shows session started
        ↓
        Tells ESP32 about session
        ↓
T+5s    ESP32 collects sensor data
        ↓
        Sends POST /sensor-data/arduino/data
        ↓
T+5.1s  Backend receives data
        ↓
        Calls ML Model
        ↓
T+5.2s  ML Model predicts in ~5ms
        ↓
        Backend stores prediction
        ↓
T+5.3s  Frontend polls /analytics/session/S001
        ↓
        Gets engagement: 82%, stress: 28%
        ↓
T+5.5s  Dashboard updates with new data
        ↓
        User sees real-time chart update
        ↓
T+10s   Repeat for each new sensor data point
```

---

## 🎯 Key Features Implemented

✅ **JWT Authentication** - Secure token-based auth
✅ **Session Management** - Track learning sessions
✅ **Real-time Sensor Data** - Process every 5-10 seconds
✅ **ML Integration** - Automatic predictions
✅ **Live Analytics** - Instant dashboard updates
✅ **Data Storage** - MongoDB persistence
✅ **Error Handling** - Validation & error messages
✅ **API Security** - CORS, rate limiting
✅ **Arduino Integration** - ESP32 device support

---

**Created:** February 13, 2026
**Status:** Complete End-to-End Data Flow
**Version:** 1.0.0
