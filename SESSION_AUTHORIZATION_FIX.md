# 🔐 Session Authorization Fix - Complete Guide

**Error:** `"Unauthorized access to session"`  
**Cause:** Session belongs to different user than JWT token  
**Status:** ✅ FIXABLE

---

## 🚨 Why This Happens

The ML API has **user-level authorization** (security feature):

```javascript
// In backend/src/routes/ml.js line 48

if (session.userId.toString() !== req.userId) {
  return res.status(403).json({
    success: false,
    message: "Unauthorized access to session",
  });
}
```

This checks: **"Does this session belong to YOU?"**

### ❌ What's Happening Now:

```
1. You login → Get JWT token for USER A
2. You try to access session → Session belongs to USER B
3. Authorization check fails ❌
4. API returns: "Unauthorized access to session"
```

### ✅ What Should Happen:

```
1. You login → Get JWT token for USER A
2. You create session → Session belongs to USER A
3. You access session → Authorization check passes ✅
4. API returns: Predictions
```

---

## ✅ Fix: Proper Workflow

### Step 1: Register User (First Time Only)

```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

Body:
{
  "email": "testuser@engage.dev",
  "password": "password123",
  "name": "Test User",
  "userType": "student"
}

Response:
{
  "message": "User registered successfully",
  "user": {
    "_id": "USER_ID_HERE",
    "email": "testuser@engage.dev"
  }
}
```

### Step 2: Login to Get Token

```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

Body:
{
  "email": "testuser@engage.dev",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

⚠️ IMPORTANT: Copy this token!
Save it in Postman variable: {{authToken}}
```

### Step 3: Create a New Session (Belongs to Your User!)

```
POST http://localhost:5000/api/sessions/start
Content-Type: application/json
Authorization: Bearer {{authToken}}

Body:
{
  "activity": "Math Learning Session",
  "sessionName": "Algebra Class",
  "sessionType": "classroom",
  "deviceId": "device-123"
}

Response:
{
  "success": true,
  "message": "Session started",
  "session": {
    "_id": "NEW_SESSION_ID",
    "userId": "YOUR_USER_ID",  ← THIS MATCHES YOUR JWT!
    "activity": "Math Learning Session",
    "startTime": "2026-02-19T..."
  }
}

✅ IMPORTANT: Copy the _id from response!
Save it in Postman variable: {{sessionId}}
```

### Step 4: Add Sensor Data to Session

```
POST http://localhost:5000/api/sensorData
Content-Type: application/json
Authorization: Bearer {{authToken}}

Body:
{
  "sessionId": "{{sessionId}}",
  "heartRate": {
    "value": 75,
    "unit": "bpm"
  },
  "hrv": {
    "rmssd": 45
  },
  "bloodOxygen": {
    "value": 97,
    "unit": "%"
  },
  "motionLevel": 8,
  "restlessnessIndex": 0.12,
  "timestamp": "2026-02-19T01:30:00Z"
}

Response:
{
  "success": true,
  "message": "Sensor data recorded",
  "sensorData": {
    "_id": "SENSOR_ID",
    "sessionId": "YOUR_SESSION_ID"  ← MATCHES!
  }
}
```

### Step 5: NOW Predict from Session (This Will Work!)

```
POST http://localhost:5000/api/ml/predict/session/{{sessionId}}
Content-Type: application/json
Authorization: Bearer {{authToken}}

Body:
{
  "limit": 100,
  "analyzeSession": false
}

Response:
{
  "success": true,
  "message": "Predictions retrieved successfully",
  "total_readings": 1,
  "valid_readings": 1,
  "predictions": [
    {
      "state": "Engaged",
      "confidence": 1.0,
      "probabilities": {...}
    }
  ]
}

✅ SUCCESS! No more authorization errors!
```

---

## 📊 Why the Hardcoded Session Failed

The test session ID we were using: `6995e222b6522e5dc25a5817`

This session:

- ✅ Exists in database
- ✅ Has valid sensor data (29 readings)
- ❌ **Belongs to a pre-seeded test user**
- ❌ **NOT your authenticated user**

So authorization fails even with valid JWT!

---

## 🔧 Solution Summary

### Before (Broken):

```
1. Login as USER A
2. Try to access SESSION_B (belongs to USER_C)
3. Authorization check fails
4. Error: "Unauthorized access to session"
```

### After (Fixed):

```
1. Login as USER A → Get token
2. Create SESSION_A (belongs to USER_A)
3. Add sensor data to SESSION_A
4. Access SESSION_A with token
5. Authorization check passes ✅
6. Get predictions successfully
```

---

## 🎯 Quick Implementation (5 minutes)

### In Postman:

```
1. PHASE 2: User Management
   ├─ 2.1 Register User (Run once)
   └─ 2.2 Login User (Gets token auto-saved ✅)

2. CREATE NEW SESSION (Add this request):
   POST http://localhost:5000/api/sessions/start
   Authorization: Bearer {{authToken}}
   Body: {
     "activity": "Test Session",
     "sessionName": "ML Testing",
     "sessionType": "classroom"
   }

   Save response session._id to {{sessionId}} ✅

3. ADD SENSOR DATA (Add this request):
   POST http://localhost:5000/api/sensorData
   Authorization: Bearer {{authToken}}
   Body: {
     "sessionId": "{{sessionId}}",
     "heartRate": {"value": 75},
     "hrv": {"rmssd": 45},
     "bloodOxygen": {"value": 97},
     "motionLevel": 8,
     "restlessnessIndex": 0.12
   }

4. PREDICT FROM SESSION:
   POST http://localhost:5000/api/ml/predict/session/{{sessionId}}
   Authorization: Bearer {{authToken}}
   Body: {"limit": 100}

   ✅ THIS NOW WORKS!
```

---

## 🚨 Common Mistakes

### ❌ Mistake 1: Using Hardcoded Session ID

```
// WRONG - Session belongs to different user
sessionId = "6995e222b6522e5dc25a5817"
```

### ✅ Fix:

```
// RIGHT - Create your own session
POST /sessions/start with your JWT token
Use the returned sessionId
```

---

### ❌ Mistake 2: Wrong Authorization Header

```
// WRONG
Authorization: {{authToken}}

// ALSO WRONG
Authorization: Bearer
```

### ✅ Fix:

```
// RIGHT
Authorization: Bearer {{authToken}}
```

---

### ❌ Mistake 3: No Token Provided

```
// WRONG - No auth header
POST /api/ml/predict/session/id
```

### ✅ Fix:

```
// RIGHT - Include auth header
POST /api/ml/predict/session/id
Authorization: Bearer {{authToken}}
```

---

### ❌ Mistake 4: Token Expired

```
// WRONG - Token expired after 24 hours
// Error: "Token is not valid"
```

### ✅ Fix:

```
// RIGHT - Login again to get new token
POST /api/auth/login
```

---

## 🔍 Debugging Steps

### If You Still Get "Unauthorized access to session":

#### Step 1: Verify Token is Correct

```javascript
// Copy your token and paste at: jwt.io
// Verify:
// - userId is present
// - Not expired
// - Signature is valid
```

#### Step 2: Verify Session Belongs to You

```javascript
// In MongoDB, run:
db.sessions.findById("your_session_id");

// Check:
// session.userId === your_user_id from JWT?

// If NOT:
// - Delete session
// - Create new one with: POST /sessions/start
```

#### Step 3: Check JWT Token Format

```javascript
// CORRECT format in Postman:
Headers tab:
Key: Authorization
Value: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Check:
// - "Bearer " (with space) is present
// - Token value comes after "Bearer "
```

#### Step 4: Check Session ID Format

```javascript
// Valid session ID:
"6995e222b6522e5dc25a5817"; // 24 hex characters (MongoDB ObjectId)

// Invalid examples:
"session123"; // Too short
""; // Empty
null; // Null value
undefined; // Not provided
```

---

## 📋 Complete Workflow in Postman

### Setup (Run These Once):

```
✅ Phase 2.1: Register User
   Request: POST /api/auth/register
   Response: User created

✅ Phase 2.2: Login User
   Request: POST /api/auth/login
   Response: Token auto-saved to {{authToken}}
```

### Main Workflow (Run These Each Time):

```
✅ Create Session
   POST /sessions/start
   Headers: Authorization: Bearer {{authToken}}
   Response: Save sessionId to {{sessionId}}

✅ Add Sensor Data
   POST /sensorData
   Headers: Authorization: Bearer {{authToken}}
   Body: Use sessionId from above
   Response: Data recorded

✅ Predict from Session
   POST /api/ml/predict/session/{{sessionId}}
   Headers: Authorization: Bearer {{authToken}}
   Response: ✅ Predictions! No more errors!

✅ Optional: Get Full Analysis
   POST /api/ml/analyze/session/{{sessionId}}
   Headers: Authorization: Bearer {{authToken}}
   Response: Detailed engagement analysis
```

---

## 🎓 Why This Security Exists

This authorization check is **important for production**:

✅ **Protects user privacy:**

- Users can't see other students' data
- Teachers can't access other teachers' classes
- School A can't access School B's data

✅ **Prevents data leaks:**

- API returns 403 if unauthorized
- Malicious users can't brute force sessions

✅ **Ensures data integrity:**

- Only session creator can read their data
- Prevents unauthorized modifications

---

## 🚀 Next Steps

### Immediate:

1. ✅ Create a new session using `/sessions/start`
2. ✅ Add sensor data using `/sensorData`
3. ✅ Try predicting again using `/predict/session/:id`
4. ✅ No more "Unauthorized access" errors!

### For Backend Integration:

1. Always create sessions with authenticated user
2. Always include JWT token in requests
3. Always use `Bearer ` prefix in Authorization header
4. Handle 403 errors gracefully

### For Production:

1. Users only see their own sessions
2. Teachers see their class sessions
3. Admins have elevated permissions
4. All requests require valid JWT

---

## 📞 Quick Reference

| Issue                            | Solution                                     |
| -------------------------------- | -------------------------------------------- |
| "Unauthorized access to session" | Create session with your JWT token           |
| "Token is not valid"             | Login again to get fresh token               |
| "No token, authorization denied" | Add `Authorization: Bearer {{token}}` header |
| "Invalid session ID format"      | Use 24-char MongoDB ObjectId                 |
| "Session not found"              | Verify sessionId is correct                  |

---

## ✅ Verification Checklist

Before making prediction request, verify:

- [ ] Have you registered a user?
- [ ] Have you logged in and got JWT token?
- [ ] Is token saved to {{authToken}} variable?
- [ ] Have you created a new session using /sessions/start?
- [ ] Is sessionId saved to {{sessionId}} variable?
- [ ] Have you added sensor data to the session?
- [ ] Is Authorization header: `Bearer {{authToken}}`?
- [ ] Are you using the correct sessionId?

If all checked ✅ → Request will succeed!

---

**Created:** February 19, 2026  
**System:** IoT Student Engagement v2.1  
**Status:** ✅ Authorization Explained & Fixed  
**Next:** Follow 5-minute workflow above
