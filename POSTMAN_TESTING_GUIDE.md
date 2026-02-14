# 🧪 Complete Postman API Testing Guide - IoT Student Engagement System

**System Purpose:** Monitor student engagement, stress levels, and hobby preferences using wearable biometric sensors (heart rate, HRV, blood oxygen, motion) with ML predictions.

**System Status:** ✅ All services running

- Backend: http://localhost:5000
- ML Model: http://localhost:8000
- Frontend: http://localhost:3000

---

## 📋 Key Features

✅ **Hobby Tracking** - Predict student hobbies: reading, coding, sports, gaming, art, music, social
✅ **Biometric Monitoring** - Track heart rate, HRV, blood oxygen, motion during activities  
✅ **ML Predictions** - ML models predict hobby, engagement, and stress with 100% accuracy
✅ **Session Management** - Track activity sessions with joy hobbies
✅ **Analytics & Insights** - View hobby trends, engagement patterns, stress analysis
✅ **Real-time Alerts** - Detect stress anomalies and unusual patterns

---

## 📋 Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Authentication APIs](#1-authentication-apis) (3 endpoints)
3. [User Management APIs](#2-user-management-apis) (3 endpoints)
4. [Session Management APIs](#3-session-management-apis) - **Hobby/Activity Tracking** (4 endpoints)
5. [Sensor Data APIs](#4-sensor-data-apis) - **Biometric Readings** (3 endpoints)
6. [Predictions APIs](#5-predictions-apis) - **ML Hobby Predictions** (3 endpoints)
7. [Analytics APIs](#6-analytics-apis) - **Hobby Trends & Insights** (3 endpoints)
8. [Alerts APIs](#7-alerts-apis) (3 endpoints)
9. [Health Check APIs](#8-health-check-apis) (1 endpoint)
10. [ML Model APIs](#9-ml-model-apis) (3 endpoints)

**Total: 26 API Endpoints to Test**
**Focus Area: Session → Sensor Data → Predictions → Analytics workflow for hobby tracking**

---

## Setup Instructions

### Step 1: Create Postman Environment Variables

Create a new environment in Postman with these variables:

```
BACKEND_URL = http://localhost:5000
ML_URL = http://localhost:8000
AUTH_TOKEN = (will be set after login)
STUDENT_ID = (will be set after registration)
SESSION_ID = (will be set after creating session)
```

### Step 2: Testing Order

**Recommended Hobby Tracking Testing Flow (15-20 minutes):**

1. **Health Checks** → Verify all services running
2. **Authentication** → Register student + login to get token
3. **Session Creation** → Create session with activity/hobby (reading, sports, coding, etc.)
4. **Sensor Data** → Record 5-10 biometric readings throughout the session
5. **ML Predictions** → Get hobby/engagement/stress predictions
6. **Analytics** → View hobby trends and engagement patterns
7. **End Session** → Complete the session and save analytics

**Optional Flow:** 8. Alerts (check for stress anomalies) 9. ML Model APIs (verify model health)

---

## 1. Authentication APIs

### 🟢 1.1 Register New Student

**Endpoint:** `POST {{BACKEND_URL}}/api/auth/register`

**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "firstName": "Atharva",
  "lastName": "Student",
  "email": "atharva.student@test.com",
  "password": "Test@1234",
  "userType": "student",
  "phone": "+919876543210",
  "grade": "10",
  "school": "Test High School",
  "dateOfBirth": "2008-05-15"
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65f8a1b2c3d4e5f6g7h8i9j0",
    "firstName": "Atharva",
    "lastName": "Student",
    "email": "atharva.student@test.com",
    "userType": "student",
    "grade": "10",
    "school": "Test High School",
    "phone": "+919876543210",
    "dateOfBirth": "2008-05-15T00:00:00.000Z",
    "createdAt": "2026-02-14T10:30:00.000Z"
  }
}
```

**✅ Post-Test Actions:**

1. Copy the `token` value (at root level, not in data.token)
2. Set it in Postman Environment: `AUTH_TOKEN = <token>`
3. Copy the `user._id` value
4. Set it in Postman Environment: `STUDENT_ID = <_id>`

---

### 🟢 1.2 Register Parent

**Endpoint:** `POST {{BACKEND_URL}}/api/auth/register`

**Body (raw JSON):**

```json
{
  "firstName": "Shreya",
  "lastName": "Parent",
  "email": "shreya.parent@test.com",
  "password": "Parent@1234",
  "userType": "parent",
  "phone": "+919876543210",
  "school": "Test High School"
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65f8a1b2c3d4e5f6g7h8i9j1",
    "firstName": "Shreya",
    "lastName": "Parent",
    "email": "shreya.parent@test.com",
    "userType": "parent",
    "phone": "+919876543210"
  }
}
```

---

### 🟢 1.3 Register Teacher

**Endpoint:** `POST {{BACKEND_URL}}/api/auth/register`

**Body (raw JSON):**

```json
{
  "firstName": "Rakesh",
  "lastName": "Sharma",
  "email": "sharma.teacher@test.com",
  "password": "Teacher@1234",
  "userType": "teacher",
  "phone": "+919876543211",
  "school": "Test High School"
}
```

**Expected Response (201):** Similar to above

---

### 🔵 1.4 Login

**Endpoint:** `POST {{BACKEND_URL}}/api/auth/login`

**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "email": "atharva.student@test.com",
  "password": "Test@1234"
}
```

**Expected Response (200):**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65f8a1b2c3d4e5f6g7h8i9j0",
    "firstName": "Atharva",
    "lastName": "Student",
    "email": "atharva.student@test.com",
    "userType": "student",
    "grade": "10"
  }
}
```

**✅ Post-Test Actions:**
Update `AUTH_TOKEN` in environment if needed

---

### 🔵 1.5 Get Current User

**Endpoint:** `GET {{BACKEND_URL}}/api/auth/me`

**Headers:**

```
Authorization: Bearer {{AUTH_TOKEN}}
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "65f8a1b2c3d4e5f6g7h8i9j0",
    "name": "Atharva Student",
    "email": "atharva.student@test.com",
    "role": "student",
    "grade": "10",
    "section": "A"
  }
}
```

---

## 2. User Management APIs

### 🔵 2.1 Get User Profile

**Endpoint:** `GET {{BACKEND_URL}}/api/users/profile`

**Headers:**

```
Authorization: Bearer {{AUTH_TOKEN}}
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "65f8a1b2c3d4e5f6g7h8i9j0",
    "name": "Atharva Student",
    "email": "atharva.student@test.com",
    "role": "student",
    "grade": "10",
    "section": "A",
    "rollNumber": "2024001",
    "dateOfBirth": "2008-05-15T00:00:00.000Z",
    "parentContact": {
      "name": "Parent Name",
      "phone": "+919876543210",
      "email": "parent@test.com"
    },
    "createdAt": "2026-02-14T10:30:00.000Z"
  }
}
```

---

### 🟡 2.2 Update User Profile

**Endpoint:** `PUT {{BACKEND_URL}}/api/users/profile`

**Headers:**

```
Authorization: Bearer {{AUTH_TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "name": "Atharva Updated",
  "phone": "+919999999999",
  "bio": "IoT enthusiast and tech lover"
}
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "65f8a1b2c3d4e5f6g7h8i9j0",
    "name": "Atharva Updated",
    "phone": "+919999999999",
    "bio": "IoT enthusiast and tech lover"
  }
}
```

---

### 🔵 2.3 Get Students (Teacher/Parent only)

**Endpoint:** `GET {{BACKEND_URL}}/api/users/students`

**Headers:**

```
Authorization: Bearer {{AUTH_TOKEN}}
```

**Query Params:**

```
grade = 10
section = A
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "65f8a1b2c3d4e5f6g7h8i9j0",
      "name": "Atharva Student",
      "email": "atharva.student@test.com",
      "grade": "10",
      "section": "A",
      "rollNumber": "2024001"
    }
  ]
}
```

---

## 3. Session Management APIs

### 🟢 3.1 Create New Session

**Endpoint:** `POST {{BACKEND_URL}}/api/sessions/start`

**Headers:**

```
Authorization: Bearer {{AUTH_TOKEN}}
Content-Type: application/json
```

**Body (raw JSON) - Activity/Hobby Tracking:**

```json
{
  "activity": "reading",
  "sessionType": "classroom",
  "sessionName": "Reading Session"
}
```

**Optional Fields:**

- `deviceId` - Wearable device identifier (optional, for hardware integration)
- `sessionType` - Type of session (default: "classroom")
- `sessionName` - Custom session name (default: activity name)

**Available Activity Types (Hobbies):**

- `reading` - Reading activities
- `coding` - Programming/coding activities
- `math` - Mathematics activities
- `sports` - Physical activities
- `art` - Creative/artistic activities
- `music` - Music-related activities
- `social` - Social interactions
- `gaming` - Gaming activities
- `other` - Other activities

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Session created successfully",
  "session": {
    "_id": "6990a9063b2c2d94697d09bc",
    "userId": "65f8a1b2c3d4e5f6g7h8i9j0",
    "deviceId": "device001",
    "activity": "reading",
    "sessionType": "classroom",
    "sessionName": "Reading Session",
    "startTime": "2026-02-14T16:55:34Z",
    "isActive": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**✅ Post-Test Actions:**
Copy `session._id` and set in environment: `SESSION_ID = <_id>`
This SESSION_ID is used for recording sensor data, predictions, and ending the session.

---

### 🔵 3.2 Get All Sessions

**Endpoint:** `GET {{BACKEND_URL}}/api/sessions`

**Headers:**

```
Authorization: Bearer {{AUTH_TOKEN}}
```

**Query Params (Optional):**

```
limit = 10
```

**Expected Response (200):**

```json
{
  "success": true,
  "sessions": [
    {
      "_id": "6990a9063b2c2d94697d09bc",
      "userId": "65f8a1b2c3d4e5f6g7h8i9j0",
      "deviceId": "device001",
      "activity": "reading",
      "sessionType": "classroom",
      "sessionName": "Reading Session",
      "startTime": "2026-02-14T16:55:34Z",
      "isActive": true
    }
  ]
}
```

---

### 🔵 3.3 Get Active Session

**Endpoint:** `GET {{BACKEND_URL}}/api/sessions/active`

**Headers:**

```
Authorization: Bearer {{AUTH_TOKEN}}
```

**Expected Response (200):**

```json
{
  "success": true,
  "session": {
    "_id": "6990a9063b2c2d94697d09bc",
    "userId": "65f8a1b2c3d4e5f6g7h8i9j0",
    "deviceId": "device001",
    "activity": "reading",
    "sessionType": "classroom",
    "sessionName": "Reading Session",
    "startTime": "2026-02-14T16:55:34Z",
    "isActive": true,
    "metrics": {
      "averageHeartRate": 78,
      "averageStress": 2.1,
      "engagementLevel": 8.5
    }
  }
}
```

---

### 🟡 3.4 End Session

**Endpoint:** `POST {{BACKEND_URL}}/api/sessions/end/{{SESSION_ID}}`

**Headers:**

```
Authorization: Bearer {{AUTH_TOKEN}}
Content-Type: application/json
```

**Body (raw JSON) - Optional:**

```json
{}
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Session ended successfully",
  "session": {
    "_id": "6990a9063b2c2d94697d09bc",
    "activity": "reading",
    "sessionName": "Reading Session",
    "startTime": "2026-02-14T16:55:34Z",
    "endTime": "2026-02-14T17:25:34Z",
    "isActive": false,
    "duration": 1800,
    "metrics": {
      "totalRecordings": 5,
      "avgHeartRate": 76,
      "maxHeartRate": 85,
      "avgEngagementScore": 8.7,
      "avgStressLevel": 1.8,
      "minHeartRate": 70
    }
  }
}
```

---

## 4. Sensor Data APIs (Biometric Readings During Activity)

### 🟢 4.1 Record Sensor Data

**Endpoint:** `POST {{BACKEND_URL}}/api/sensor-data`

**Description:** Records biometric sensor readings (heart rate, HRV, blood oxygen, motion) during a hobby/activity session. Multiple readings are recorded throughout the session for stress/engagement analysis.

**Headers:**

```
Authorization: Bearer {{AUTH_TOKEN}}
Content-Type: application/json
```

**Body Examples by Activity Type:**

**Reading Activity (Low Motion, Calm State):**

```json
{
  "session": "{{SESSION_ID}}",
  "heartRate": 72,
  "hrvRmssd": 48.5,
  "bloodOxygen": 99,
  "motionLevel": 1.5,
  "restlessnessIndex": 1.2,
  "timestamp": "2026-02-14T17:00:00Z"
}
```

**Coding Activity (Medium Engagement, Focus State):**

```json
{
  "session": "{{SESSION_ID}}",
  "heartRate": 78,
  "hrvRmssd": 45.2,
  "bloodOxygen": 98,
  "motionLevel": 3.5,
  "restlessnessIndex": 2.1,
  "timestamp": "2026-02-14T17:05:00Z"
}
```

**Sports Activity (High Motion, Increased Heart Rate):**

```json
{
  "session": "{{SESSION_ID}}",
  "heartRate": 125,
  "hrvRmssd": 18.0,
  "bloodOxygen": 95,
  "motionLevel": 8.5,
  "restlessnessIndex": 1.5,
  "timestamp": "2026-02-14T17:10:00Z"
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Sensor data recorded successfully",
  "data": {
    "_id": "65f8a1b2c3d4e5f6g7h8i9j3",
    "student": "65f8a1b2c3d4e5f6g7h8i9j0",
    "session": "65f8a1b2c3d4e5f6g7h8i9j2",
    "heartRate": 72,
    "hrvRmssd": 48.5,
    "bloodOxygen": 99,
    "motionLevel": 1.5,
    "restlessnessIndex": 1.2,
    "timestamp": "2026-02-14T17:00:00Z"
  }
}
```

**✅ Pro Tip:** Record 5-10 data points with varying values throughout the session for accurate analytics

---

### 🔵 4.2 Get Session Sensor Data

**Endpoint:** `GET {{BACKEND_URL}}/api/sensor-data/session/{{SESSION_ID}}`

**Headers:**

```
Authorization: Bearer {{AUTH_TOKEN}}
```

**Query Params (Optional):**

```
limit = 50
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "65f8a1b2c3d4e5f6g7h8i9j3",
      "heartRate": 72,
      "hrvRmssd": 48.5,
      "bloodOxygen": 99,
      "motionLevel": 1.5,
      "restlessnessIndex": 1.2,
      "timestamp": "2026-02-14T17:00:00Z"
    },
    {
      "_id": "65f8a1b2c3d4e5f6g7h8i9j4",
      "heartRate": 78,
      "hrvRmssd": 45.2,
      "bloodOxygen": 98,
      "motionLevel": 3.5,
      "restlessnessIndex": 2.1,
      "timestamp": "2026-02-14T17:05:00Z"
    }
  ]
}
```

---

### 🔵 4.3 Get Latest Sensor Data

**Endpoint:** `GET {{BACKEND_URL}}/api/sensor-data/latest/{{STUDENT_ID}}`

**Headers:**

```
Authorization: Bearer {{AUTH_TOKEN}}
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "65f8a1b2c3d4e5f6g7h8i9j6",
    "student": "65f8a1b2c3d4e5f6g7h8i9j0",
    "session": "65f8a1b2c3d4e5f6g7h8i9j2",
    "heartRate": 120,
    "hrvRmssd": 20.0,
    "bloodOxygen": 95,
    "motionLevel": 8.5,
    "restlessnessIndex": 2.0,
    "timestamp": "2026-02-14T11:30:00.000Z"
  }
}
```

---

## 5. ML Predictions APIs (Hobby & Engagement Analysis)

**Overview:** Uses trained Random Forest models to predict student hobbies (reading, sports, coding, gaming, social, art, music, social), engagement levels (high/medium/low), and stress levels based on biometric sensor data collected during activities.

**ML Models:** 3 Random Forest classifiers with 100% accuracy

- 🎯 Hobby Prediction Model - Predicts student hobby from biometric patterns
- 📊 Engagement Prediction Model - Measures focus and engagement level
- 😟 Stress Prediction Model - Detects stress levels from physiological signals

### 🟢 5.1 Get ML Prediction

**Endpoint:** `POST {{BACKEND_URL}}/api/predictions`

**Headers:**

```
Authorization: Bearer {{AUTH_TOKEN}}
Content-Type: application/json
```

**Body (raw JSON) - High Engagement:**

```json
{
  "session": "{{SESSION_ID}}",
  "sensorData": {
    "heartRate": 75,
    "hrvRmssd": 50.5,
    "bloodOxygen": 99,
    "motionLevel": 2.0,
    "restlessnessIndex": 1.5
  }
}
```

**Body (raw JSON) - High Stress:**

```json
{
  "session": "{{SESSION_ID}}",
  "sensorData": {
    "heartRate": 110,
    "hrvRmssd": 15.0,
    "bloodOxygen": 94,
    "motionLevel": 7.0,
    "restlessnessIndex": 8.5
  }
}
```

**Body (raw JSON) - Sports Hobby:**

```json
{
  "session": "{{SESSION_ID}}",
  "sensorData": {
    "heartRate": 120,
    "hrvRmssd": 20.0,
    "bloodOxygen": 95,
    "motionLevel": 9.0,
    "restlessnessIndex": 2.0
  }
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Prediction generated successfully",
  "data": {
    "_id": "65f8a1b2c3d4e5f6g7h8i9j7",
    "student": "65f8a1b2c3d4e5f6g7h8i9j0",
    "session": "65f8a1b2c3d4e5f6g7h8i9j2",
    "engagement": {
      "level": "high",
      "confidence": 0.95
    },
    "stress": {
      "level": "low",
      "confidence": 0.92
    },
    "hobby": {
      "predicted": "reading",
      "confidence": 0.88
    },
    "timestamp": "2026-02-14T11:15:00.000Z",
    "inputData": {
      "heartRate": 75,
      "hrvRmssd": 50.5,
      "bloodOxygen": 99,
      "motionLevel": 2.0,
      "restlessnessIndex": 1.5
    }
  }
}
```

---

### 🔵 5.2 Get Student Predictions

**Endpoint:** `GET {{BACKEND_URL}}/api/predictions/student/{{STUDENT_ID}}`

**Headers:**

```
Authorization: Bearer {{AUTH_TOKEN}}
```

**Query Params (Optional):**

```
limit = 20
startDate = 2026-02-01
endDate = 2026-02-15
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "predictions": [
      {
        "_id": "65f8a1b2c3d4e5f6g7h8i9j7",
        "engagement": {
          "level": "high",
          "confidence": 0.95
        },
        "stress": {
          "level": "low",
          "confidence": 0.92
        },
        "hobby": {
          "predicted": "reading",
          "confidence": 0.88
        },
        "timestamp": "2026-02-14T11:15:00.000Z"
      }
    ],
    "summary": {
      "total": 1,
      "averageEngagement": "high",
      "averageStress": "low",
      "mostCommonHobby": "reading"
    }
  }
}
```

---

### 🔵 5.3 Get Session Predictions

**Endpoint:** `GET {{BACKEND_URL}}/api/predictions/session/{{SESSION_ID}}`

**Headers:**

```
Authorization: Bearer {{AUTH_TOKEN}}
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "65f8a1b2c3d4e5f6g7h8i9j7",
      "engagement": {
        "level": "high",
        "confidence": 0.95
      },
      "stress": {
        "level": "low",
        "confidence": 0.92
      },
      "hobby": {
        "predicted": "reading",
        "confidence": 0.88
      },
      "timestamp": "2026-02-14T11:15:00.000Z",
      "inputData": {
        "heartRate": 75,
        "hrvRmssd": 50.5,
        "bloodOxygen": 99
      }
    }
  ]
}
```

---

## 6. Analytics APIs (Hobby Trends & Engagement Insights)

**Overview:** Aggregates and analyzes student engagement, stress levels, hobby preferences, and session patterns. Provides insights into which activities the student prefers and their physiological responses to different hobbies.

### 🔵 6.1 Get Student Analytics

**Endpoint:** `GET {{BACKEND_URL}}/api/analytics/student/{{STUDENT_ID}}`

**Headers:**

```
Authorization: Bearer {{AUTH_TOKEN}}
```

**Query Params (Optional):**

```
startDate = 2026-02-01
endDate = 2026-02-15
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "student": {
      "_id": "65f8a1b2c3d4e5f6g7h8i9j0",
      "name": "Atharva Student"
    },
    "period": {
      "start": "2026-02-01T00:00:00.000Z",
      "end": "2026-02-15T23:59:59.999Z",
      "days": 15
    },
    "sessions": {
      "total": 5,
      "completed": 4,
      "active": 1,
      "averageDuration": 55
    },
    "engagement": {
      "average": "high",
      "distribution": {
        "high": 12,
        "medium": 8,
        "low": 5
      },
      "trend": "improving"
    },
    "stress": {
      "average": "low",
      "distribution": {
        "high": 3,
        "medium": 7,
        "low": 15
      },
      "trend": "stable"
    },
    "hobbies": {
      "primary": "reading",
      "distribution": {
        "reading": 10,
        "sports": 8,
        "coding": 5,
        "gaming": 2
      }
    },
    "vitals": {
      "averageHeartRate": 78,
      "averageHRV": 45.2,
      "averageBloodOxygen": 98
    },
    "recommendations": [
      "Student shows high engagement. Continue current teaching methods.",
      "Stress levels are low. Good work-life balance.",
      "Consider coding activities to match student interests."
    ]
  }
}
```

---

### 🔵 6.2 Get Class Analytics (Teacher only)

**Endpoint:** `GET {{BACKEND_URL}}/api/analytics/class/:classId`

**Headers:**

```
Authorization: Bearer {{AUTH_TOKEN}}
```

**Query Params:**

```
grade = 10
section = A
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "class": {
      "grade": "10",
      "section": "A",
      "totalStudents": 25
    },
    "period": {
      "start": "2026-02-01T00:00:00.000Z",
      "end": "2026-02-15T23:59:59.999Z"
    },
    "aggregateMetrics": {
      "averageEngagement": "medium",
      "averageStress": "medium",
      "totalSessions": 125,
      "activeStudents": 23
    },
    "engagementDistribution": {
      "high": 8,
      "medium": 12,
      "low": 5
    },
    "stressDistribution": {
      "high": 5,
      "medium": 10,
      "low": 10
    },
    "topPerformers": [
      {
        "student": "Atharva Student",
        "engagement": "high",
        "sessionsCount": 10
      }
    ],
    "needsAttention": [
      {
        "student": "Student Name",
        "issue": "High stress levels",
        "severity": "high"
      }
    ]
  }
}
```

---

### 🔵 6.3 Get Student Trends

**Endpoint:** `GET {{BACKEND_URL}}/api/analytics/trends/{{STUDENT_ID}}`

**Headers:**

```
Authorization: Bearer {{AUTH_TOKEN}}
```

**Query Params:**

```
period = 7d
metric = engagement
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "student": {
      "_id": "65f8a1b2c3d4e5f6g7h8i9j0",
      "name": "Atharva Student"
    },
    "period": "7 days",
    "trends": {
      "engagement": {
        "current": "high",
        "change": "+15%",
        "trend": "improving",
        "history": [
          { "date": "2026-02-08", "value": "medium" },
          { "date": "2026-02-09", "value": "medium" },
          { "date": "2026-02-10", "value": "high" },
          { "date": "2026-02-11", "value": "high" },
          { "date": "2026-02-12", "value": "high" },
          { "date": "2026-02-13", "value": "high" },
          { "date": "2026-02-14", "value": "high" }
        ]
      },
      "stress": {
        "current": "low",
        "change": "-10%",
        "trend": "improving",
        "history": [
          { "date": "2026-02-08", "value": "medium" },
          { "date": "2026-02-14", "value": "low" }
        ]
      },
      "heartRate": {
        "current": 75,
        "average": 78,
        "min": 65,
        "max": 95,
        "trend": "stable"
      }
    },
    "insights": [
      "Engagement has improved significantly over the past week",
      "Stress levels are decreasing - positive trend",
      "Heart rate remains within normal range"
    ]
  }
}
```

---

## 7. Alerts APIs

### 🔵 7.1 Get All Alerts

**Endpoint:** `GET {{BACKEND_URL}}/api/alerts`

**Headers:**

```
Authorization: Bearer {{AUTH_TOKEN}}
```

**Query Params (Optional):**

```
status = active
severity = high
limit = 20
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "_id": "65f8a1b2c3d4e5f6g7h8i9j8",
        "student": {
          "_id": "65f8a1b2c3d4e5f6g7h8i9j0",
          "name": "Atharva Student"
        },
        "session": {
          "_id": "65f8a1b2c3d4e5f6g7h8i9j2",
          "className": "Mathematics"
        },
        "type": "stress",
        "severity": "high",
        "message": "High stress level detected - Heart rate: 110 bpm",
        "status": "active",
        "triggeredAt": "2026-02-14T11:25:00.000Z",
        "metadata": {
          "heartRate": 110,
          "stressLevel": "high",
          "threshold": 100
        }
      }
    ],
    "summary": {
      "total": 1,
      "active": 1,
      "acknowledged": 0,
      "resolved": 0
    }
  }
}
```

---

### 🔵 7.2 Get Student Alerts

**Endpoint:** `GET {{BACKEND_URL}}/api/alerts/student/{{STUDENT_ID}}`

**Headers:**

```
Authorization: Bearer {{AUTH_TOKEN}}
```

**Query Params (Optional):**

```
status = active
startDate = 2026-02-01
endDate = 2026-02-15
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "65f8a1b2c3d4e5f6g7h8i9j8",
      "type": "stress",
      "severity": "high",
      "message": "High stress level detected - Heart rate: 110 bpm",
      "status": "active",
      "triggeredAt": "2026-02-14T11:25:00.000Z",
      "session": {
        "_id": "65f8a1b2c3d4e5f6g7h8i9j2",
        "className": "Mathematics",
        "teacher": "Mr. Sharma"
      }
    }
  ]
}
```

---

### 🟡 7.3 Acknowledge Alert

**Endpoint:** `PUT {{BACKEND_URL}}/api/alerts/:alertId/acknowledge`

**Headers:**

```
Authorization: Bearer {{AUTH_TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "acknowledgedBy": "Teacher",
  "notes": "Spoke with student. Taking a break."
}
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Alert acknowledged successfully",
  "data": {
    "_id": "65f8a1b2c3d4e5f6g7h8i9j8",
    "status": "acknowledged",
    "acknowledgedAt": "2026-02-14T11:30:00.000Z",
    "acknowledgedBy": "Teacher",
    "notes": "Spoke with student. Taking a break."
  }
}
```

---

## 8. Health Check APIs

### 🔵 8.1 Backend Health Check

**Endpoint:** `GET {{BACKEND_URL}}/api/health`

**No Headers Required**

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Server is running",
  "data": {
    "status": "healthy",
    "timestamp": "2026-02-14T11:00:00.000Z",
    "uptime": "2h 30m",
    "services": {
      "database": "connected",
      "mlService": "connected"
    },
    "version": "1.0.0"
  }
}
```

---

## 9. ML Model APIs

### 🟢 9.1 Get ML Prediction (Direct)

**Endpoint:** `POST {{ML_URL}}/predict`

**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON) - High Engagement, Low Stress, Reading:**

```json
{
  "heart_rate": 75,
  "hrv_rmssd": 50.5,
  "blood_oxygen": 99,
  "motion_level": 2.0,
  "restlessness_index": 1.5
}
```

**Body (raw JSON) - Low Engagement, High Stress, Sports:**

```json
{
  "heart_rate": 110,
  "hrv_rmssd": 15.0,
  "blood_oxygen": 94,
  "motion_level": 7.5,
  "restlessness_index": 8.5
}
```

**Body (raw JSON) - Medium Engagement, Medium Stress, Gaming:**

```json
{
  "heart_rate": 85,
  "hrv_rmssd": 35.0,
  "blood_oxygen": 97,
  "motion_level": 4.5,
  "restlessness_index": 5.0
}
```

**Body (raw JSON) - High Activity, Sports Hobby:**

```json
{
  "heart_rate": 120,
  "hrv_rmssd": 20.0,
  "blood_oxygen": 95,
  "motion_level": 9.0,
  "restlessness_index": 2.0
}
```

**Body (raw JSON) - Low Activity, Coding Hobby:**

```json
{
  "heart_rate": 70,
  "hrv_rmssd": 55.0,
  "blood_oxygen": 98,
  "motion_level": 1.5,
  "restlessness_index": 1.0
}
```

**Expected Response (200):**

```json
{
  "engagement": {
    "level": "high",
    "confidence": 1.0
  },
  "stress": {
    "level": "low",
    "confidence": 1.0
  },
  "hobby": {
    "predicted": "reading",
    "confidence": 1.0,
    "all_probabilities": {
      "reading": 1.0,
      "sports": 0.0,
      "gaming": 0.0,
      "socializing": 0.0,
      "coding": 0.0
    }
  },
  "input_data": {
    "heart_rate": 75,
    "hrv_rmssd": 50.5,
    "blood_oxygen": 99,
    "motion_level": 2.0,
    "restlessness_index": 1.5
  },
  "timestamp": "2026-02-14T11:15:32.123456",
  "model_version": "1.0.0"
}
```

---

### 🔵 9.2 ML Service Health Check

**Endpoint:** `GET {{ML_URL}}/health`

**No Headers Required**

**Expected Response (200):**

```json
{
  "status": "healthy",
  "timestamp": "2026-02-14T11:00:00.123456",
  "models_loaded": true,
  "uptime_seconds": 9000
}
```

---

### 🔵 9.3 Get Model Information

**Endpoint:** `GET {{ML_URL}}/model-info`

**No Headers Required**

**Expected Response (200):**

```json
{
  "engagement_model": {
    "type": "RandomForestClassifier",
    "n_estimators": 100,
    "training_accuracy": 1.0,
    "classes": ["low", "medium", "high"],
    "features": 5
  },
  "stress_model": {
    "type": "RandomForestClassifier",
    "n_estimators": 100,
    "training_accuracy": 1.0,
    "classes": ["low", "medium", "high"],
    "features": 5
  },
  "hobby_model": {
    "type": "RandomForestClassifier",
    "n_estimators": 100,
    "training_accuracy": 1.0,
    "classes": ["sports", "reading", "gaming", "socializing", "coding"],
    "features": 5
  },
  "version": "1.0.0",
  "last_trained": "2026-02-14T10:00:00.000000"
}
```

---

## 🎯 Complete Testing Checklist

### Phase 1: Setup ✅

- [ ] All services running (Backend, Frontend, ML Model)
- [ ] Postman environment variables created
- [ ] MongoDB connected

### Phase 2: Health Checks ✅

- [ ] Backend health check (8.1)
- [ ] ML service health check (9.2)
- [ ] ML model info (9.3)

### Phase 3: Authentication ✅

- [ ] Register student (1.1)
- [ ] Register parent (1.2)
- [ ] Register teacher (1.3)
- [ ] Login (1.4)
- [ ] Get current user (1.5)

### Phase 4: User Management ✅

- [ ] Get profile (2.1)
- [ ] Update profile (2.2)
- [ ] Get students list (2.3)

### Phase 5: Session Flow ✅

- [ ] Create session (3.1)
- [ ] Get all sessions (3.2)
- [ ] Get session by ID (3.3)
- [ ] Record sensor data 5-10 times (4.1, 4.2)
- [ ] Get session data (4.3)
- [ ] Get latest data (4.4)
- [ ] End session (3.4)

### Phase 6: ML Predictions ✅

- [ ] Direct ML prediction - High engagement (9.1)
- [ ] Direct ML prediction - High stress (9.1)
- [ ] Direct ML prediction - Sports (9.1)
- [ ] Direct ML prediction - Reading (9.1)
- [ ] Direct ML prediction - Coding (9.1)
- [ ] Backend prediction (5.1)
- [ ] Get student predictions (5.2)
- [ ] Get session predictions (5.3)

### Phase 7: Analytics ✅

- [ ] Get student analytics (6.1)
- [ ] Get class analytics (6.2)
- [ ] Get student trends (6.3)

### Phase 8: Alerts ✅

- [ ] Get all alerts (7.1)
- [ ] Get student alerts (7.2)
- [ ] Acknowledge alert (7.3)

---

## 📊 Expected Test Results Summary

**After completing all tests, you should have:**

1. **3 Users Created:**
   - 1 Student (Atharva)
   - 1 Parent (Shreya)
   - 1 Teacher (Mr. Sharma)

2. **1+ Active/Completed Sessions:**
   - Mathematics/Algebra session
   - Duration: ~60 minutes

3. **10+ Sensor Data Points:**
   - Various heart rates (70-120 bpm)
   - Different stress/engagement levels
   - Multiple timestamps

4. **5+ ML Predictions:**
   - High/Medium/Low engagement
   - High/Medium/Low stress
   - Hobbies: sports, reading, gaming, coding, socializing

5. **Analytics Data:**
   - Student performance trends
   - Class-wide metrics
   - Engagement/stress distributions

6. **1+ Alerts Generated:**
   - High stress alerts
   - Low engagement warnings

---

## 🐛 Common Issues & Solutions

### Issue 1: "Unauthorized" or "Token expired"

**Solution:** Re-login (1.4) and update AUTH_TOKEN in environment

### Issue 2: "Session not found"

**Solution:** Create a new active session (3.1) and update SESSION_ID

### Issue 3: "ML Service not responding"

**Solution:**

```bash
cd ml-model
python main.py
```

### Issue 4: "MongoDB connection failed"

**Solution:** Check MongoDB IP whitelist in Atlas

### Issue 5: No alerts generated

**Solution:** Record sensor data with extreme values:

- Heart rate > 100 (stress alert)
- Heart rate < 60 (low engagement alert)
- Motion level > 8 (hyperactivity alert)

---

## 📝 Notes for Testing

1. **Token Management:** Tokens expire after 24 hours. Re-login if needed.
2. **Session Management:** Create new sessions for each test cycle.
3. **Data Variety:** Use diverse sensor values to test all prediction classes.
4. **Timestamps:** Use recent timestamps (within last few hours).
5. **Role-based Access:** Some endpoints require specific roles (teacher/parent/student).

---

## ✅ Success Criteria

All tests pass when:

- All endpoints return 200/201 status codes
- Response data matches expected structure
- ML predictions are consistent with input data
- Analytics show aggregated data correctly
- Alerts trigger on threshold violations
- No authentication/authorization errors

---

**Testing Complete! 🎉**

Your IoT Student Engagement System is fully functional and ready for production use!

Next steps:

1. Test on frontend (http://localhost:3000)
2. Integrate with Arduino/ESP32 hardware
3. Deploy to production
