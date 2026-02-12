# 📋 Implementation Checklist & Architecture Document

## ✅ Project Setup Checklist

### Phase 1: Environment Setup

- [ ] Node.js 16+ installed
- [ ] Python 3.8+ installed
- [ ] MongoDB installed or Atlas account created
- [ ] Git repository initialized
- [ ] Project folders created
- [ ] Virtual environment for Python

### Phase 2: Backend Setup

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with proper configuration
- [ ] MongoDB connection verified
- [ ] Server starts without errors on port 5000
- [ ] Health check endpoint responds: `GET /api/health`

### Phase 3: ML Model Setup

- [ ] Virtual environment activated
- [ ] Python dependencies installed
- [ ] Models trained successfully
- [ ] Prediction API responds on port 8000
- [ ] FastAPI docs available at `/docs`

### Phase 4: Frontend Setup

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` configured with API URL
- [ ] React app starts on port 3000
- [ ] Pages load without console errors
- [ ] Navigation working between pages

### Phase 5: Database Setup

- [ ] Collections created in MongoDB
- [ ] Indexes created for performance
- [ ] Sample data inserted
- [ ] Queries tested

### Phase 6: Integration Testing

- [ ] User registration works
- [ ] Login authenticated correctly
- [ ] Token stored in localStorage
- [ ] Protected routes redirect to login
- [ ] Sensor data API accepts POST requests
- [ ] ML predictions return correct format

## 🏗️ System Architecture Details

### Component Interaction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER REQUEST                             │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │   React Frontend     │ (Port 3000)
        │  ├─ Components       │
        │  ├─ State Management │
        │  └─ API Client       │
        └────────────┬─────────┘
                     │
        ┌────────────┴──────────────┐
        │ AXIOS HTTP REQUEST        │
        │ axios.post/get/put/delete │
        └────────────┬──────────────┘
                     │
                     ▼
        ┌──────────────────────────────┐
        │   Express.js Backend         │ (Port 5000)
        │  ├─ Routes                   │
        │  ├─ Controllers              │
        │  ├─ Middleware (JWT Auth)    │
        │  └─ MongoDB Connection       │
        └────────────┬─────────────────┘
                     │
        ┌────────────┴────────────────────┐
        │   MongoDB Database              │ (Port 27017)
        │  ├─ Collections                │
        │  ├─ Documents                  │
        │  └─ Indexes                    │
        └────────────┬────────────────────┘
                     │
                     │ (For ML predictions)
                     ▼
        ┌──────────────────────────────┐
        │   FastAPI ML Service         │ (Port 8000)
        │  ├─ Model.py                 │
        │  ├─ Prediction Logic         │
        │  └─ Scikit-learn Models      │
        └──────────────────────────────┘

    EXTERNAL: ESP32 Wearable Device
    ├─ Sends sensor data to /api/sensor-data
    ├─ Receives predictions
    └─ Updates real-time
```

### Data Flow Diagram

```
Wearable Sensor Data:
  Heart Rate, HRV, SpO2, Motion, Restlessness
                 ↓
           Backend API
                 ↓
         ┌─ Store in MongoDB
         └─ Send to ML Service
                 ↓
          ML Prediction Engine
    (Random Forest Classifier)
                 ↓
  ├─ Engagement Level
  ├─ Stress Level
  └─ Predicted Hobby
                 ↓
        Store Predictions
                 ↓
        Dashboard Visualization
```

### Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. User Registration/Login                              │
│    POST /api/auth/register                              │
│    POST /api/auth/login                                 │
└────────────────┬────────────────────────────────────────┘
                 │
        ┌────────▼────────┐
        │ Generate JWT    │
        │ Token           │
        └────────┬────────┘
                 │
    ┌────────────▼───────────────┐
    │ Send to Client              │
    │ localStorage.setItem        │
    │ ('token', token)            │
    └────────────┬────────────────┘
                 │
    ┌────────────▼───────────────────────┐
    │ Protected Route Request             │
    │ Authorization: Bearer {token}       │
    └────────────┬───────────────────────┘
                 │
    ┌────────────▼───────────────┐
    │ Middleware Auth Check       │
    │ jwt.verify(token)           │
    └────────────┬────────────────┘
                 │
        ┌────────▼────────┐
        │ ✓ Valid Token?  │
        │ Yes:Continue    │
        │ No: 401 Error   │
        └─────────────────┘
```

## 🔄 API Request-Response Examples

### Example 1: User Registration Flow

```
REQUEST:
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "userType": "student"
}

RESPONSE (201 Created):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "userType": "student",
    "createdAt": "2024-02-13T10:30:00Z"
  }
}
```

### Example 2: Sensor Data Submission

```
REQUEST:
POST /api/sensor-data
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "deviceId": "esp32-001",
  "heartRate": 78,
  "hrv": {
    "rmssd": 42,
    "sdnn": 45,
    "pnn50": 8
  },
  "bloodOxygen": 98,
  "acceleration": { "x": 0.1, "y": 0.2, "z": 0.3 },
  "gyroscope": { "x": 0.05, "y": 0.1, "z": 0.15 },
  "sessionId": "607f1f77bcf86cd799439012"
}

RESPONSE (201 Created):
{
  "success": true,
  "message": "Sensor data recorded",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "deviceId": "esp32-001",
    "timestamp": "2024-02-13T10:35:45Z",
    "heartRate": { "value": 78, "unit": "bpm", "confidence": 0.95 },
    "processed": true,
    "processedFeatures": {
      "engagementScore": 0.82,
      "stressIndicator": 0.28,
      "engagementLevel": "high"
    }
  }
}
```

### Example 3: ML Prediction

```
REQUEST:
POST /predict
Content-Type: application/json

{
  "heart_rate": 78,
  "hrv_rmssd": 42,
  "blood_oxygen": 98,
  "motion_level": 35,
  "restlessness_index": 25
}

RESPONSE (200 OK):
{
  "engagement": {
    "level": "high",
    "confidence": 0.92,
    "score": 0.92
  },
  "stress": {
    "level": "calm",
    "confidence": 0.88,
    "score": 0.12
  },
  "hobby": {
    "predicted": "coding",
    "confidence": 0.85,
    "top_5": [
      { "hobby": "coding", "confidence": 0.85 },
      { "hobby": "reading", "confidence": 0.72 },
      { "hobby": "gaming", "confidence": 0.68 },
      { "hobby": "sports", "confidence": 0.55 },
      { "hobby": "music", "confidence": 0.45 }
    ]
  },
  "timestamp": "2024-02-13T10:35:45.123Z"
}
```

## 📊 Database Schema Relationships

```
┌─────────────┐
│    User     │
├─────────────┤
│ _id (PK)    │ ────────────┐
│ email       │             │
│ password    │             │
│ userType    │             │
└─────────────┘             │
       │                    │
       │ One-to-Many        │
       │                    │
       ├─────────────────────────────┐
       │                            │
       ▼                            ▼
   ┌────────────────┐        ┌────────────────┐
   │   Session      │        │   SensorData   │
   ├────────────────┤        ├────────────────┤
   │ _id (PK)       │        │ _id (PK)       │
   │ userId (FK)    │        │ userId (FK)    │
   │ startTime      │        │ sessionId(FK)  │
   │ activity       │        │ timestamp      │
   │ metrics        │        │ heartRate      │
   │ predictions    │        │ hrv            │
   └────────────────┘        │ bloodOxygen    │
          │                  └────────────────┘
          │
          ├─────────┐
          │         │
          ▼         ▼
      ┌─────────────────┐
      │  Prediction     │
      ├─────────────────┤
      │ _id (PK)        │
      │ sessionId(FK)   │
      │ predictions     │
      │ confidence      │
      └─────────────────┘
          │
          │
          ▼
      ┌─────────────────┐
      │     Alert       │
      ├─────────────────┤
      │ _id (PK)        │
      │ userId (FK)     │
      │ alertType       │
      │ severity        │
      │ isResolved      │
      └─────────────────┘
```

## 🔐 Security Architecture

### Authentication & Authorization

```
1. Password Hashing
   Password → bcrypt(salt=10) → Stored Hash

2. JWT Token
   { userId, userType, email } → HMAC-SHA256 → Signed Token

3. Token Validation Middleware
   Request → Extract Token → Verify Signature → Check Expiry → Continue/401

4. Role-Based Access Control (RBAC)
   Student: Can view own data only
   Parent: Can view linked student's data
   Teacher: Can view classroom data
   Admin: Can view all data
```

### Data Protection

```
- SSL/TLS in production
- Password hashing with bcrypt
- JWT signed tokens
- CORS whitelisting
- Rate limiting (100 req/15min)
- Input validation
- SQL injection prevention (using Mongoose ODM)
- XSS protection (React escaping)
```

## 📈 Performance Optimization Strategy

### Database Optimization

```javascript
// Index Strategy
db.sensordata.createIndex({ userId: 1, timestamp: -1 })
db.sensordata.createIndex({ sessionId: 1, timestamp: -1 })
db.sessions.createIndex({ userId: 1, startTime: -1 })

// Aggregation Pipeline
db.sensordata.aggregate([
  { $match: { sessionId: ObjectId(...) } },
  { $group: { _id: null, avgHR: { $avg: '$heartRate.value' } } }
])
```

### Frontend Optimization

```javascript
// Code Splitting
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));

// Memoization
const MemoizedChart = React.memo(EngagementChart);

// Lazy Loading
<Suspense fallback={<Loading />}>
  <StudentDashboard />
</Suspense>;
```

### Backend Optimization

```javascript
// Pagination
GET /api/sessions?page=1&limit=20

// Selective Fields
db.sessions.find({}, { metrics: 1, predictions: 1 })

// Caching
redis.setex('user:123:dashboard', 300, JSON.stringify(data))
```

## 🚨 Error Handling Strategy

```
┌─────────────────────────────────┐
│     Error Occurs                │
└────────────┬────────────────────┘
             │
    ┌────────▼─────────┐
    │ Catch Error       │
    │ Log to Console    │
    └────────┬──────────┘
             │
    ┌────────▼──────────────┐
    │ Check Error Type       │
    │ - Validation Error     │
    │ - Auth Error           │
    │ - Database Error       │
    │ - ML Error             │
    └────────┬───────────────┘
             │
    ┌────────▼──────────────────┐
    │ Map to HTTP Status Code    │
    │ - 400: Bad Request         │
    │ - 401: Unauthorized        │
    │ - 403: Forbidden           │
    │ - 500: Server Error        │
    └────────┬──────────────────┘
             │
    ┌────────▼──────────────┐
    │ Send JSON Response    │
    │ { error, message }    │
    └───────────────────────┘
```

## 📱 Mobile Integration (Future)

```
React Native App
├─ Uses same API endpoints
├─ LocalStorage for device tokens
├─ Background task for sensor data
└─ Push notifications via FCM

Smart Watch App
├─ Minimal data transmission
├─ Local ML inference
└─ Battery optimization
```

## 🧪 Testing Strategy

```
Unit Tests (40%)
├─ Models
├─ Controllers
└─ Utils

Integration Tests (35%)
├─ API endpoints
├─ Database queries
└─ ML predictions

E2E Tests (25%)
├─ User flows
├─ Authentication
└─ Dashboard interactions
```

---

**Last Updated**: February 13, 2024
**Version**: 1.0.0
