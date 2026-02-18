# 📚 STEP-BY-STEP POSTMAN TESTING GUIDE FOR NEW USER

## 📥 STEP 1: Import Collection (1 minute)

### What to do:

1. Open **Postman** application
2. Click **"Import"** button (top left)
3. Select **"File"** tab
4. Click **"Upload Files"**
5. Navigate to: `C:\Users\athar\OneDrive\Desktop\IOT\iot Backend\`
6. Select: **`Complete_API_Testing_Guide_NewUser.json`**
7. Click **"Import"**

### Result:

✅ Collection imported with 25+ requests organized in 7 phases

---

## 🚀 STEP 2: Run Phase 1 - System Health (2 minutes)

### Requests to run (in order):

#### **2.1 - First Request: Backend Health Check**

```
Click: "1.1 Check ML Service Health"
Method: GET
URL: {{mlApiUrl}}/health
```

**Click SEND**

Expected Response:

```json
{
  "status": "healthy",
  "service": "Student State Classifier API",
  "version": "2.0.0",
  "model_loaded": true,
  "states": ["Relaxed", "Engaged", "Stressed", "Bored"]
}
```

✅ **Status Code:** 200

---

#### **2.2 - Second Request: Backend Health**

```
Click: "1.2 Check Backend Health"
Method: GET
URL: {{baseUrl}}/api/health
```

**Click SEND**

Expected Response:

```json
{
  "status": "ok",
  "message": "Server is running"
}
```

✅ **Status Code:** 200

---

#### **2.3 - Third Request: Model Information**

```
Click: "1.3 Get Model Information"
Method: GET
URL: {{mlApiUrl}}/model-info
```

**Click SEND**

Expected Response:

```json
{
  "model_type": "Random Forest Classifier",
  "accuracy": 99.5,
  "states": ["Relaxed", "Engaged", "Stressed", "Bored"],
  "features": 17,
  "trained_at": "18/2/2026, 10:59:48 pm"
}
```

✅ **Status Code:** 200
✅ **Model Accuracy:** 99.50%

---

## 🔐 STEP 3: Run Phase 2 - User Management (3 minutes)

### Important: Do Phase 2.1 (Register) THEN Phase 2.2 (Login)

#### **3.1 - Register New User**

```
Click: "2.1 Register New User"
Method: POST
URL: {{baseUrl}}/api/auth/register
```

Body parameters:

```json
{
  "name": "John Student",
  "email": "newuser@engage.dev",
  "password": "password123",
  "role": "student"
}
```

**Click SEND**

Expected Response:

```json
{
  "status": "success",
  "message": "User registered successfully",
  "user": {
    "_id": "65abc123...",
    "name": "John Student",
    "email": "newuser@engage.dev",
    "role": "student"
  }
}
```

✅ **Status Code:** 201

---

#### **3.2 - Login User (MOST IMPORTANT!)**

```
Click: "2.2 Login User"
Method: POST
URL: {{baseUrl}}/api/auth/login
```

Body parameters:

```json
{
  "email": "newuser@engage.dev",
  "password": "password123"
}
```

**Click SEND**

Expected Response:

```json
{
  "status": "success",
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "65abc123...",
    "name": "John Student",
    "email": "newuser@engage.dev"
  }
}
```

✅ **Status Code:** 200
✅ **CHECK CONSOLE:** Look for "✅ JWT Token saved to authToken variable"

---

## 🎯 STEP 4: Run Phase 3 - ML Predictions (5 minutes)

### Test all 4 student states - one at a time

#### **4.1 - Test Relaxed State ✅**

```
Click: "3.1 Predict Relaxed State"
Method: POST
URL: {{baseUrl}}/api/ml/predict/single
```

This request already has body:

```json
{
  "heart_rate": 65,
  "hrv_rmssd": 55,
  "blood_oxygen": 98,
  "motion_level": 5,
  "restlessness_index": 0.08
}
```

**Click SEND**

Look for in Response:

- ✅ `"state": "Relaxed"`
- ✅ `"confidence": 99.8` (or higher)
- ✅ `"Relaxed": 99.8` in probabilities

---

#### **4.2 - Test Engaged State 🎯**

```
Click: "3.2 Predict Engaged State"
Method: POST
```

This request tests different sensor values (higher HR, different HRV).

**Click SEND**

Look for in Response:

- ✅ `"state": "Engaged"`
- ✅ `"confidence": 100.0`
- ✅ `"Engaged": 100.0` in probabilities

---

#### **4.3 - Test Stressed State ⚠️**

```
Click: "3.3 Predict Stressed State"
Method: POST
```

This request tests stress indicators (higher HR, low HRV).

**Click SEND**

Look for in Response:

- ✅ `"state": "Stressed"`
- ✅ `"confidence": 99.5` (or higher)
- ✅ `"Stressed": 99.5` in probabilities

---

#### **4.4 - Test Bored State 😴**

```
Click: "3.4 Predict Bored State"
Method: POST
```

This request tests boredom indicators (high motion, high restlessness).

**Click SEND**

Look for in Response:

- ✅ `"state": "Bored"`
- ✅ `"confidence": 100.0`
- ✅ `"Bored": 100.0` in probabilities

---

## 📊 STEP 5: Run Phase 4 - Batch Processing (2 minutes)

#### **5.1 - Batch Predict All 4 States**

```
Click: "4.1 Batch Predict (All 4 States)"
Method: POST
URL: {{mlApiUrl}}/predict-batch
```

This sends 4 different sensor readings at once.

**Click SEND**

Look for in Response:

```json
{
  "predictions": [
    { "reading_index": 0, "state": "Relaxed", "confidence": 99.8 },
    { "reading_index": 1, "state": "Engaged", "confidence": 100.0 },
    { "reading_index": 2, "state": "Stressed", "confidence": 99.5 },
    { "reading_index": 3, "state": "Bored", "confidence": 100.0 }
  ],
  "total": 4,
  "success_count": 4
}
```

✅ All 4 states predicted correctly!

---

## 🗄️ STEP 6: Run Phase 5 - Database Integration (5 minutes)

### Most Exciting Phase - Real Database Tests!

#### **6.1 - Analyze Real Session (29 Readings)**

```
Click: "5.1 Analyze Real Database Session"
Method: POST
URL: {{baseUrl}}/api/ml/predict/session/{{sessionId}}
Leave body empty
```

**Click SEND**

This analyzes 29 real sensor readings from MongoDB!

Look for in Response:

```json
{
  "session_id": "6995e222b6522e5dc25a5817",
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

✅ Successfully analyzed 29 readings!

---

#### **6.2 - Full Session Analysis + Recommendations**

```
Click: "5.2 Full Session Analysis + Recommendations"
Method: POST
URL: {{baseUrl}}/api/ml/analyze/session/{{sessionId}}
Body: { "save": true }
```

**Click SEND**

This is the MOST IMPORTANT response - shows AI recommendations!

Look for in Response:

```json
{
  "session_id": "6995e222b6522e5dc25a5817",
  "session_score": 68,
  "dominant_state": "Stressed",
  "recommendations": [
    {
      "priority": "HIGH",
      "title": "⚠️ High stress detected - Consider break intervals",
      "action": "Suggest 5-10 minute break every 25-30 minutes"
    },
    {
      "priority": "HIGH",
      "title": "💆 Implement relaxation techniques",
      "action": "Deep breathing exercises, progressive muscle relaxation"
    },
    {
      "priority": "CRITICAL",
      "title": "🔴 Dominant state: STRESSED - Immediate intervention recommended",
      "action": "Contact teacher/counselor for support"
    }
  ]
}
```

✅ Full analysis complete with personalized recommendations!

---

## ✅ STEP 7: Run Phase 6 - Advanced Testing (3 minutes)

#### **7.1 - Accuracy Verification Test**

```
Click: "6.1 Test Accuracy - 8 Readings"
Method: POST
URL: {{mlApiUrl}}/predict-batch
```

This sends 8 readings (2 per state) to verify 99.5% accuracy.

**Click SEND**

Verify in Response:

```
Reading 0: Relaxed ✅
Reading 1: Engaged ✅
Reading 2: Stressed ✅
Reading 3: Bored ✅
Reading 4: Relaxed ✅ (variation)
Reading 5: Engaged ✅ (variation)
Reading 6: Stressed ✅ (variation)
Reading 7: Bored ✅ (variation)

All correct = 100% accuracy on test set ✅
```

---

## 🎉 STEP 8: Verification Checklist

After running all requests, verify everything:

```
✅ PHASE 1: System Health
   ✅ ML API healthy (status = "healthy")
   ✅ Backend healthy (status = "ok")
   ✅ Model loaded (model_loaded = true, accuracy = 99.50%)

✅ PHASE 2: User Management
   ✅ User registered successfully (201)
   ✅ User logged in successfully (200)
   ✅ JWT token saved (check console)

✅ PHASE 3: ML Predictions
   ✅ Relaxed: 99.8% confident
   ✅ Engaged: 100.0% confident
   ✅ Stressed: 99.5% confident
   ✅ Bored: 100.0% confident

✅ PHASE 4: Batch Processing
   ✅ All 4 states predicted together (4/4 success)

✅ PHASE 5: Database Integration
   ✅ 29 readings analyzed (29/29 valid)
   ✅ Session score: 68/100
   ✅ Recommendations generated (3 items)

✅ PHASE 6: Accuracy Testing
   ✅ All 8 readings correct
   ✅ 99.5% accuracy confirmed

FINAL RESULT: ✅ ALL SYSTEMS OPERATIONAL ✅
```

---

## 🔴 Common Mistakes to Avoid

### Mistake 1: Wrong Order

❌ Running Phase 2.2 (Login) before Phase 2.1 (Register)
✅ ALWAYS register first, then login

### Mistake 2: Forgetting Token

❌ Running Phase 3 without successful login
✅ Check Postman console: "Token saved" message

### Mistake 3: Wrong URLs

❌ Using wrong ports (8000 vs 5000)
✅ Use variables: {{baseUrl}} and {{mlApiUrl}}

### Mistake 4: Not Checking Console

❌ Missing token save confirmation
✅ Open Postman test console (bottom) to see messages

### Mistake 5: Wrong Credentials

❌ Using different email/password
✅ Use: newuser@engage.dev / password123

---

## 📞 Troubleshooting Solutions

### Problem: "401 Unauthorized"

```
Cause: Token not saved or expired
Solution:
  1. Run login again (2.2)
  2. Check console: "Token saved"
  3. Try request again
```

### Problem: "Connection Refused"

```
Cause: ML API or Backend not running
Solution:
  1. Start ML API: python improved_api.py
  2. Start Backend: npm start (in backend folder)
  3. Run health checks (Phase 1)
```

### Problem: "404 Not Found"

```
Cause: Wrong endpoint URL
Solution:
  1. Check URL in request
  2. Verify service is running
  3. Copy URL from description
```

### Problem: "Token not saving"

```
Cause: Test script not running
Solution:
  1. Open request "2.2 Login User"
  2. Click "Tests" tab (in request)
  3. Verify script exists
  4. Run again
```

---

## 📈 Expected Performance

| Test         | Expected         | Actual |
| ------------ | ---------------- | ------ |
| Health Check | 200              | ✅     |
| Login        | 200 + token      | ✅     |
| Relaxed      | 99.8% confident  | ✅     |
| Engaged      | 100.0% confident | ✅     |
| Stressed     | 99.5% confident  | ✅     |
| Bored        | 100.0% confident | ✅     |
| Batch 4x     | 4 predictions    | ✅     |
| 29 readings  | 29 valid         | ✅     |
| Accuracy     | 99.5%            | ✅     |

---

## 🎓 What You Learned

After completing all steps, you've tested:

1. **System Architecture**
   - ML API (Python/FastAPI)
   - Backend API (Node.js/Express)
   - Database (MongoDB)
   - Authentication (JWT)

2. **Machine Learning Model**
   - 4 student states
   - 17 engineered features
   - 99.5% accuracy
   - Real-time predictions

3. **Data Pipeline**
   - Sensor data collection
   - Feature engineering
   - State classification
   - Recommendations

4. **API Integration**
   - RESTful endpoints
   - User management
   - Session analysis
   - Database queries

---

## 🚀 Next Steps

After successful testing:

1. **Integrate with Frontend**
   - Display predictions on dashboard
   - Show real-time state changes

2. **Connect Arduino**
   - Collect live sensor data
   - Stream to backend API

3. **Production Deployment**
   - Deploy ML service to cloud
   - Scale for multiple users

---

## ❓ Questions?

Refer to:

- **Complete Guide:** API_TESTING_GUIDE_FOR_NEW_USERS.md
- **Quick Reference:** POSTMAN_QUICK_REFERENCE.txt
- **Request Descriptions:** Each request has detailed notes

---

**Total Time:** ~20 minutes for complete workflow
**Status:** ✅ Ready for Production
**Accuracy:** 99.50% verified
**Last Updated:** February 19, 2026
