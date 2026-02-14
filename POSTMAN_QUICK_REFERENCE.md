# 🎯 Postman Testing - Quick Reference Card

## 📦 Import Instructions

### Step 1: Import Collection

1. Open Postman
2. Click **Import** button (top left)
3. Drag and drop: `IoT_Student_Engagement_Postman_Collection.json`
4. Click **Import**

### Step 2: Create Environment

1. Click **Environments** (left sidebar)
2. Click **+** to create new environment
3. Name it: `IoT Local`
4. Add these variables:

| Variable    | Initial Value         | Current Value                          |
| ----------- | --------------------- | -------------------------------------- |
| BACKEND_URL | http://localhost:5000 | http://localhost:5000                  |
| ML_URL      | http://localhost:8000 | http://localhost:8000                  |
| AUTH_TOKEN  | _(leave empty)_       | _(auto-filled after login)_            |
| STUDENT_ID  | _(leave empty)_       | _(auto-filled after registration)_     |
| SESSION_ID  | _(leave empty)_       | _(auto-filled after creating session)_ |

5. Click **Save**
6. Select **IoT Local** from environment dropdown (top right)

---

## ⚡ Testing Sequence (15 min complete test)

### 🟢 Phase 1: Verify Services (2 min)

✅ **1. Health Checks** → **Backend Health Check**
✅ **1. Health Checks** → **ML Service Health Check**
✅ **1. Health Checks** → **ML Model Info**

**Expected:** All return status 200 with "healthy" status

---

### 🟢 Phase 2: Create Account (2 min)

✅ **2. Authentication** → **Register Student**

- ⚠️ **IMPORTANT:** After success, `AUTH_TOKEN` and `STUDENT_ID` auto-saved to environment
- Check **Console** (bottom) to confirm: "Token and Student ID saved!"

✅ **2. Authentication** → **Login**

- Confirms token works
- Updates token if expired

✅ **2. Authentication** → **Get Current User**

- Verifies authentication is working

---

### 🟢 Phase 3: Start Session & Record Data (3 min)

✅ **4. Session Management** → **Create Session**

- ⚠️ **IMPORTANT:** `SESSION_ID` auto-saved to environment

✅ **5. Sensor Data** → **Record Sensor Data - Normal** (Run 1x)
✅ **5. Sensor Data** → **Record Sensor Data - High Engagement** (Run 1x)
✅ **5. Sensor Data** → **Record Sensor Data - High Stress** (Run 1x)
✅ **5. Sensor Data** → **Record Sensor Data - Sports Activity** (Run 1x)
✅ **5. Sensor Data** → **Record Sensor Data - Coding Activity** (Run 1x)

**Total:** 5 sensor data points recorded

✅ **5. Sensor Data** → **Get Session Sensor Data**

- Verify all 5 data points are returned

---

### 🟢 Phase 4: Test ML Predictions (3 min)

✅ **9. ML Model Direct** → **ML Predict - High Engagement Low Stress**

- Expected: `engagement: "high"`, `stress: "low"`, `hobby: "reading"`

✅ **9. ML Model Direct** → **ML Predict - Sports Activity**

- Expected: `hobby: "sports"`

✅ **9. ML Model Direct** → **ML Predict - Coding Activity**

- Expected: `hobby: "coding"`

✅ **6. Predictions** → **Get Prediction - High Engagement**

- Backend integrated prediction

✅ **6. Predictions** → **Get Student Predictions**

- See all predictions for student

---

### 🟢 Phase 5: Analytics (2 min)

✅ **7. Analytics** → **Get Student Analytics**

- Expected: Summary with averages, distributions, recommendations

✅ **7. Analytics** → **Get Student Trends**

- Expected: Trend data over time period

---

### 🟢 Phase 6: Alerts (1 min)

✅ **8. Alerts** → **Get Student Alerts**

- May be empty if no thresholds violated

---

### 🟢 Phase 7: Session Management (2 min)

✅ **4. Session Management** → **Get All Sessions**

- View all sessions

✅ **4. Session Management** → **Get Session by ID**

- Detailed session view

✅ **4. Session Management** → **End Session**

- Mark session as completed

---

## 📊 Expected Results Cheat Sheet

### ML Predictions

| Input Characteristics         | Engagement | Stress | Hobby   |
| ----------------------------- | ---------- | ------ | ------- |
| HR: 75, HRV: 50, Motion: 2.0  | High       | Low    | Reading |
| HR: 110, HRV: 15, Motion: 7.5 | Low        | High   | Gaming  |
| HR: 120, HRV: 20, Motion: 9.0 | High       | Medium | Sports  |
| HR: 70, HRV: 55, Motion: 1.5  | High       | Low    | Coding  |
| HR: 85, HRV: 35, Motion: 4.5  | Medium     | Medium | Gaming  |

### Hobby Predictions Based on Metrics

- **Sports:** High HR (>110), High Motion (>8), Low Restlessness
- **Reading:** Low HR (<80), High HRV (>45), Low Motion (<3)
- **Coding:** Low HR (<75), Very High HRV (>50), Very Low Motion (<2)
- **Gaming:** Medium HR (80-95), Medium Motion (4-6), High Restlessness (>5)
- **Socializing:** Medium HR (75-90), Medium HRV (35-45), Medium Motion (3-5)

---

## 🐛 Common Errors & Quick Fixes

| Error                                | Solution                                                 |
| ------------------------------------ | -------------------------------------------------------- |
| ❌ "Unauthorized" / 401              | Re-run: **2. Authentication** → **Login**                |
| ❌ "Session not found"               | Re-run: **4. Session Management** → **Create Session**   |
| ❌ "Token expired"                   | Re-run: **2. Authentication** → **Login**                |
| ❌ "ML Service unavailable"          | Check terminal: ML model running on port 8000?           |
| ❌ "MongoDB connection error"        | Check MongoDB Atlas IP whitelist                         |
| ❌ Empty `AUTH_TOKEN` in environment | Manually copy token from response and set in environment |

---

## 📝 Manual Environment Variable Setup (If Auto-Save Fails)

### After **Register Student** or **Login**:

1. Click on response body
2. Copy the `token` value (long string starting with `eyJ...`)
3. Click **Environments** (top right)
4. Click on **IoT Local**
5. Paste into `AUTH_TOKEN` → **Current Value** column
6. Copy the `_id` value
7. Paste into `STUDENT_ID` → **Current Value** column
8. Click **Save**

### After **Create Session**:

1. Copy `_id` from response
2. Paste into `SESSION_ID` → **Current Value**
3. Click **Save**

---

## 🎯 Testing Checklist (Print This!)

### ✅ Health Checks (3 tests)

- [ ] Backend Health
- [ ] ML Health
- [ ] ML Model Info

### ✅ Authentication (5 tests)

- [ ] Register Student ⚠️ _Save Token & ID_
- [ ] Register Parent
- [ ] Register Teacher
- [ ] Login
- [ ] Get Current User

### ✅ User Management (3 tests)

- [ ] Get Profile
- [ ] Update Profile
- [ ] Get Students

### ✅ Sessions (4 tests)

- [ ] Create Session ⚠️ _Save Session ID_
- [ ] Get All Sessions
- [ ] Get Session by ID
- [ ] End Session

### ✅ Sensor Data (7 tests)

- [ ] Record Normal Data
- [ ] Record High Engagement
- [ ] Record High Stress
- [ ] Record Sports Activity
- [ ] Record Coding Activity
- [ ] Get Session Data
- [ ] Get Latest Data

### ✅ Predictions (4 tests)

- [ ] Backend Prediction - High Engagement
- [ ] Backend Prediction - High Stress
- [ ] Get Student Predictions
- [ ] Get Session Predictions

### ✅ ML Model Direct (5 tests)

- [ ] ML High Engagement
- [ ] ML High Stress
- [ ] ML Sports
- [ ] ML Coding
- [ ] ML Gaming

### ✅ Analytics (2 tests)

- [ ] Student Analytics
- [ ] Student Trends

### ✅ Alerts (2 tests)

- [ ] Get All Alerts
- [ ] Get Student Alerts

**Total: 35 API Calls**

---

## 🚀 Speed Run (5 min - Essential Tests Only)

1. **Backend Health Check**
2. **Register Student** ⚠️ _Save token_
3. **Create Session** ⚠️ _Save session ID_
4. **Record Sensor Data - Sports Activity** (or any variant)
5. **ML Predict - Sports Activity**
6. **Get Student Analytics**
7. **End Session**

✅ **7 calls = Core functionality verified!**

---

## 📞 Sample Response Codes

| Status | Meaning           | Common For                       |
| ------ | ----------------- | -------------------------------- |
| 200    | Success (GET/PUT) | Getting data, updates            |
| 201    | Created           | POST requests (register, create) |
| 400    | Bad Request       | Invalid input data               |
| 401    | Unauthorized      | Missing/invalid token            |
| 404    | Not Found         | Invalid ID in URL                |
| 500    | Server Error      | Backend/DB issues                |

---

## 💡 Pro Tips

1. **Collections Runner:** Use Postman Runner to run all tests automatically
2. **Tests Tab:** Check the "Tests" tab in requests for auto-save scripts
3. **Console:** Keep Console (View → Show Postman Console) open to see auto-save confirmations
4. **Pre-request Scripts:** Some requests have scripts that validate environment variables
5. **Duplicate Requests:** Right-click any request → Duplicate to test with different data
6. **Save Responses:** Click "Save Response" to compare changes over time

---

## 🎨 Color Coding

In the collection:

- **🟢 Green Badge (POST):** Creates new data
- **🔵 Blue Badge (GET):** Retrieves data
- **🟡 Orange Badge (PUT):** Updates existing data
- **🔴 Red Badge (DELETE):** Deletes data (none in this project)

---

## 📄 Full Documentation

For detailed information, see:

- **POSTMAN_TESTING_GUIDE.md** - Complete guide with all endpoints
- **API_INTEGRATION.md** - API documentation
- **README.md** - Project overview

---

**Happy Testing! 🧪**

_Last Updated: February 14, 2026_
