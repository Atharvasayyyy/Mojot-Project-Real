# 🚀 Complete API Testing Guide - New User Workflow

## 📦 What's Included

Created **Complete_API_Testing_Guide_NewUser.json** with comprehensive step-by-step testing for new users.

---

## 🎯 Quick Start (5 Minutes)

### 1. **Import Collection into Postman**

```
File → Import → Select Complete_API_Testing_Guide_NewUser.json
```

### 2. **Run in Order (7 Main Phases)**

- ✅ PHASE 1: System Health (verify services running)
- ✅ PHASE 2: User Management (register & login)
- ✅ PHASE 3: ML Predictions (test all 4 states)
- ✅ PHASE 4: Batch Processing (multiple predictions)
- ✅ PHASE 5: Database Integration (real session analysis)
- ✅ PHASE 6: Advanced Testing (accuracy verification)
- ✅ PHASE 7: Workflow Summary

---

## 📋 Testing Phases Explained

### **PHASE 1: System Health** (3 requests)

Check if all services are running:

- **1.1 ML Service Health** → `GET /health` (Port 8000)
- **1.2 Backend Health** → `GET /api/health` (Port 5000)
- **1.3 Model Info** → Shows 99.5% accuracy, 17 features, 300 trees

**Expected:** All services healthy ✅

---

### **PHASE 2: User Management** (2 requests)

#### **2.1 Register New User**

```json
POST /api/auth/register
{
  "name": "John Student",
  "email": "newuser@engage.dev",
  "password": "password123",
  "role": "student"
}
```

**Response:** User ID saved to variable ✅

#### **2.2 Login User**

```json
POST /api/auth/login
{
  "email": "newuser@engage.dev",
  "password": "password123"
}
```

**Response:** JWT token saved to {{authToken}} variable ✅

**🔴 IMPORTANT:** Check Postman test console → "Token saved" message

---

### **PHASE 3: ML Predictions - All 4 States** (4 requests)

#### **3.1 Predict Relaxed ✅**

```json
{
  "heart_rate": 65,
  "hrv_rmssd": 55,      ← HIGH HRV = Calm
  "blood_oxygen": 98,
  "motion_level": 5,    ← LOW motion
  "restlessness_index": 0.08  ← LOW restlessness
}
```

**Expected:** Relaxed, ~100% confidence

---

#### **3.2 Predict Engaged 🎯**

```json
{
  "heart_rate": 75,     ← Moderate HR
  "hrv_rmssd": 45,      ← Good HRV
  "blood_oxygen": 97,   ← High O2
  "motion_level": 8,    ← Slight motion
  "restlessness_index": 0.12  ← Low restlessness
}
```

**Expected:** Engaged, 100% confidence

---

#### **3.3 Predict Stressed ⚠️**

```json
{
  "heart_rate": 95,     ← HIGH HR
  "hrv_rmssd": 25,      ← LOW HRV = Stress
  "blood_oxygen": 95,   ← Lower O2
  "motion_level": 15,   ← Higher motion
  "restlessness_index": 0.35  ← HIGH restlessness
}
```

**Expected:** Stressed, 99.5% confidence

---

#### **3.4 Predict Bored 😴**

```json
{
  "heart_rate": 68,     ← Low HR
  "hrv_rmssd": 52,      ← High HRV
  "blood_oxygen": 98,   ← Excellent O2
  "motion_level": 30,   ← HIGH motion! 🔑 = Fidgeting
  "restlessness_index": 0.45  ← VERY HIGH! 🔑 = Key indicator
}
```

**Expected:** Bored, 100% confidence

---

### **PHASE 4: Batch Processing** (2 requests)

#### **4.1 Batch Predict (All 4 states)**

- Send 4 readings at once
- Get predictions for all simultaneously
- **Faster than individual requests**

#### **4.2 Get Available States**

- Returns: ["Relaxed", "Engaged", "Stressed", "Bored"]

---

### **PHASE 5: Database Integration** (3 requests)

#### **5.1 Analyze Real Session (29 readings)**

```
POST /api/ml/predict/session/6995e222b6522e5dc25a5817
```

**Expected Response:**

```json
{
  "total_readings": 29,
  "valid_readings": 29,
  "dominant_state": "Stressed",
  "state_distribution": {
    "Relaxed": 27.6,
    "Engaged": 34.5,
    "Stressed": 37.9,
    "Bored": 0.0
  },
  "avg_confidence": 94.1
}
```

---

#### **5.2 Full Session Analysis + Recommendations**

```
POST /api/ml/analyze/session/6995e222b6522e5dc25a5817
Body: { "save": true }
```

**Expected Response:**

```json
{
  "session_score": 68,
  "dominant_state": "Stressed",
  "recommendations": [
    {
      "priority": "HIGH",
      "title": "⚠️ High stress - Consider break intervals",
      "action": "5-10 min break every 25-30 min"
    },
    {
      "priority": "HIGH",
      "title": "💆 Implement relaxation techniques",
      "action": "Deep breathing, progressive muscle relaxation"
    },
    {
      "priority": "CRITICAL",
      "title": "🔴 STRESSED - Immediate intervention",
      "action": "Contact teacher/counselor"
    }
  ]
}
```

---

#### **5.3 Get Saved Predictions**

```
GET /api/ml/predictions/6995e222b6522e5dc25a5817
```

- Retrieves previously saved predictions from database

---

### **PHASE 6: Advanced Testing** (2 requests)

#### **6.1 Accuracy Verification (8 readings)**

- 2 per state (clear + variation)
- Expect all 8 correct
- Verify 99.5% accuracy

#### **6.2 Manual Session Analysis**

- Custom 3-reading session
- Expected pattern: Engaged → Stressed → Stressed

---

### **PHASE 7: Workflow Summary**

- Checklist of all completed tests
- Key metrics achieved
- Next steps

---

## 📊 Model Specifications

| Metric               | Value                             |
| -------------------- | --------------------------------- |
| **Test Accuracy**    | 99.50% ✅                         |
| **OOB Accuracy**     | 99.19%                            |
| **Cross-Validation** | 99.19% ±0.94%                     |
| **Algorithm**        | Random Forest                     |
| **Trees**            | 300                               |
| **Max Depth**        | 18                                |
| **Features**         | 17 (5 raw + 12 engineered)        |
| **Training Data**    | 5000 samples                      |
| **States**           | Relaxed, Engaged, Stressed, Bored |

---

## 🔑 Key Features

### **Raw Features (5)**

- Heart Rate (bpm)
- HRV RMSSD (ms)
- Blood Oxygen (%)
- Motion Level (0-50)
- Restlessness Index (0-1)

### **Engineered Features (12)**

- HR Deviation
- HR Zone
- HRV Stress Indicator
- HRV Zone
- Motion Category
- Stress Composite
- Engagement Indicator
- **HR/HRV Ratio** ← Top feature (17.5%)
- Motion × Restlessness Product
- Arousal Index
- **Relaxation Score** ← 2nd feature (13.3%)
- Boredom Indicator

---

## 🎯 State Indicators Reference

### **Relaxed ✅**

- HR: 60-70 bpm (LOW)
- HRV: 50+ ms (HIGH)
- O2: 97-99% (EXCELLENT)
- Motion: 0-5 (MINIMAL)
- Restlessness: 0-0.1 (VERY LOW)

### **Engaged 🎯**

- HR: 70-80 bpm (MODERATE)
- HRV: 40-50 ms (GOOD)
- O2: 96-98% (HIGH)
- Motion: 5-15 (SLIGHT)
- Restlessness: 0.1-0.2 (LOW)

### **Stressed ⚠️**

- HR: 85-105 bpm (HIGH)
- HRV: 20-35 ms (LOW) ← Key indicator!
- O2: 94-96% (LOWER)
- Motion: 10-20 (MODERATE-HIGH)
- Restlessness: 0.3-0.45 (HIGH)

### **Bored 😴**

- HR: 65-75 bpm (LOW)
- HRV: 50-60 ms (HIGH)
- O2: 97-99% (EXCELLENT)
- Motion: 25-35 (HIGH) ← Key indicator! Fidgeting
- Restlessness: 0.40-0.50 (VERY HIGH) ← Key indicator!

---

## 📌 Important Notes

### **Token Management**

1. After login (2.2), token auto-saves to {{authToken}}
2. All protected endpoints use this token
3. Token expires after 24 hours
4. Re-login if you get 401 errors

### **Test Session ID**

- Default: `6995e222b6522e5dc25a5817`
- Contains 29 real sensor readings
- Use for database integration testing
- Optional: Create your own session

### **Environment Variables**

Pre-configured in collection:

- `{{baseUrl}}` = http://localhost:5000
- `{{mlApiUrl}}` = http://localhost:8000
- `{{authToken}}` = Auto-saved JWT
- `{{userId}}` = Auto-saved user ID
- `{{sessionId}}` = Test session ID

---

## ✅ Test Results Checklist

After running all tests:

```
PHASE 1: System Health
  ✅ ML API Healthy
  ✅ Backend Healthy
  ✅ Model Loaded (99.5%)

PHASE 2: User Management
  ✅ User Registered
  ✅ User Logged In
  ✅ Token Saved

PHASE 3: ML Predictions
  ✅ Relaxed: 100% confident
  ✅ Engaged: 100% confident
  ✅ Stressed: 99.5% confident
  ✅ Bored: 100% confident

PHASE 4: Batch Processing
  ✅ All 4 states predicted
  ✅ Available states listed

PHASE 5: Database Integration
  ✅ 29 readings analyzed
  ✅ Session score calculated (68/100)
  ✅ Recommendations generated
  ✅ Predictions saved

PHASE 6: Advanced Testing
  ✅ 8-reading accuracy test passed
  ✅ Manual session analyzed

PHASE 7: Workflow Summary
  ✅ All tests completed
```

---

## 🚀 Next Steps

1. **Arduino Integration**
   - Connect hardware to collect live sensor data
   - Stream to backend API

2. **Frontend Dashboard**
   - Start React frontend: `npm start`
   - View real-time predictions
   - Display student engagement state

3. **Production Deployment**
   - Deploy ML service to cloud
   - Scale backend for multiple users
   - Multi-school deployment

---

## ❓ Troubleshooting

### **401 Unauthorized Error**

- **Cause:** Token expired or not saved
- **Fix:** Re-run login (2.2)
- **Check:** Console shows "Token saved"

### **Connection Refused**

- **Cause:** Services not running
- **Fix:** Start ML API and Backend
- **Check:** PHASE 1 requests should work

### **Prediction Wrong**

- **Cause:** Unlikely with 99.5% accuracy
- **Fix:** Check sensor values match expected state
- **Reference:** See State Indicators above

---

## 📞 Support

For issues:

1. Check description in each request
2. Verify sensor values against state indicators
3. Run PHASE 1 health checks
4. Check console for error messages

---

**Created:** February 19, 2026
**Model Accuracy:** 99.50%
**Status:** ✅ Ready for Testing
