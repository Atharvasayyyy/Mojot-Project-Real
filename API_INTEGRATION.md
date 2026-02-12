# API Integration Guide

## How to Connect Your ESP32 Wearable

### ESP32 Arduino Code Template

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";
const char* server = "http://your-backend.com";

// Your token (get from /auth/login)
const char* authToken = "your_jwt_token";

void setup() {
  Serial.begin(115200);
  connectToWiFi();
}

void connectToWiFi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected!");
}

void submitSensorData(int heartRate, int hrv, int spo2, float accelX, float accelY, float accelZ) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    String url = String(server) + "/api/sensor-data";
    http.begin(url);

    // Add headers
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Authorization", String("Bearer ") + authToken);

    // Create JSON payload
    StaticJsonDocument<200> doc;
    doc["deviceId"] = "esp32-001";
    doc["heartRate"] = heartRate;
    doc["hrv"]["rmssd"] = hrv;
    doc["bloodOxygen"]["value"] = spo2;
    doc["acceleration"]["x"] = accelX;
    doc["acceleration"]["y"] = accelY;
    doc["acceleration"]["z"] = accelZ;
    doc["sessionId"] = "session-123"; // Get from API first

    String payload;
    serializeJson(doc, payload);

    // Send request
    int httpCode = http.POST(payload);

    if (httpCode == 201) {
      Serial.println("Data sent successfully!");
    } else {
      Serial.printf("Error: %d\n", httpCode);
      Serial.println(http.getString());
    }

    http.end();
  }
}

void loop() {
  // Read sensors
  int heartRate = readHeartRate(); // From MAX30100
  int hrv = calculateHRV();
  int spo2 = readSpO2();
  float accelX = readAccelX(); // From MPU6050
  float accelY = readAccelY();
  float accelZ = readAccelZ();

  // Submit every 5 seconds
  submitSensorData(heartRate, hrv, spo2, accelX, accelY, accelZ);
  delay(5000);
}
```

## Starting a Session from Device

```cpp
void startSession() {
  HTTPClient http;
  http.begin(String(server) + "/api/sessions/start");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", String("Bearer ") + authToken);

  StaticJsonDocument<200> doc;
  doc["deviceId"] = "esp32-001";
  doc["activity"] = "classroom";
  doc["sessionType"] = "learning";

  String payload;
  serializeJson(doc, payload);

  int httpCode = http.POST(payload);
  String response = http.getString();

  // Parse response to get sessionId
  StaticJsonDocument<300> responseDoc;
  deserializeJson(responseDoc, response);

  String sessionId = responseDoc["session"]["_id"];
  // Store sessionId for sensor data submission

  http.end();
}
```

## Mobile App Integration (React Native)

```javascript
import axios from "axios";

const API_URL = "http://your-backend.com/api";

// Login
async function loginUser(email, password) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    const { token, user } = response.data;
    // Save token to secure storage
    await SecureStore.setItemAsync("authToken", token);
    return user;
  } catch (error) {
    console.error("Login failed:", error);
  }
}

// Start session
async function startSession(activity) {
  const token = await SecureStore.getItemAsync("authToken");

  try {
    const response = await axios.post(
      `${API_URL}/sessions/start`,
      {
        deviceId: "mobile-001",
        activity,
        sessionType: "classroom",
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return response.data.session;
  } catch (error) {
    console.error("Session start failed:", error);
  }
}

// Submit sensor data
async function submitData(sensorData) {
  const token = await SecureStore.getItemAsync("authToken");

  try {
    await axios.post(
      `${API_URL}/sensor-data`,
      {
        deviceId: "mobile-001",
        ...sensorData,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  } catch (error) {
    console.error("Data submission failed:", error);
  }
}
```

## ML Model Integration

### Python Client

```python
import requests
import json

ML_API = "http://localhost:8000"

# Make prediction
def get_prediction(heart_rate, hrv, blood_oxygen, motion, restlessness):
    data = {
        "heart_rate": heart_rate,
        "hrv_rmssd": hrv,
        "blood_oxygen": blood_oxygen,
        "motion_level": motion,
        "restlessness_index": restlessness
    }

    response = requests.post(f"{ML_API}/predict", json=data)
    return response.json()

# Example
result = get_prediction(75, 45, 98, 30, 20)
print(f"Engagement: {result['engagement']['level']}")
print(f"Stress: {result['stress']['level']}")
print(f"Predicted Hobby: {result['hobby']['predicted']}")
```

### JavaScript/Node.js Client

```javascript
const axios = require("axios");

const ML_API = "http://localhost:8000";

async function getPrediction(features) {
  try {
    const response = await axios.post(`${ML_API}/predict`, {
      heart_rate: features.heartRate,
      hrv_rmssd: features.hrv,
      blood_oxygen: features.bloodOxygen,
      motion_level: features.motion,
      restlessness_index: features.restlessness,
    });

    return response.data;
  } catch (error) {
    console.error("Prediction error:", error);
  }
}

// Usage
const prediction = await getPrediction({
  heartRate: 75,
  hrv: 45,
  bloodOxygen: 98,
  motion: 30,
  restlessness: 20,
});

console.log(`Hobby: ${prediction.hobby.predicted}`);
```

## Batch Processing

```bash
# Train models
curl -X POST http://localhost:8000/train \
  -H "Content-Type: application/json" \
  -d '{"model_type": "all"}'

# Get model info
curl http://localhost:8000/model-info

# Batch prediction
curl -X POST http://localhost:8000/predict-batch \
  -H "Content-Type: application/json" \
  -d '[
    {
      "heart_rate": 75,
      "hrv_rmssd": 45,
      "blood_oxygen": 98,
      "motion_level": 30,
      "restlessness_index": 20
    },
    {
      "heart_rate": 85,
      "hrv_rmssd": 30,
      "blood_oxygen": 97,
      "motion_level": 50,
      "restlessness_index": 40
    }
  ]'
```

## Error Handling

```javascript
// Backend error codes
const ERROR_CODES = {
  400: "Bad Request - Invalid data",
  401: "Unauthorized - Check token",
  403: "Forbidden - Insufficient permissions",
  404: "Not Found - Resource doesn't exist",
  500: "Server Error - Contact support",
  503: "Service Unavailable - Try later",
};

// Retry logic
async function submitWithRetry(data, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.post(`${API_URL}/sensor-data`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, i) * 1000),
      );
    }
  }
}
```

## WebSocket Real-time Updates (Future)

```javascript
// Coming soon - real-time engagement notifications
const socket = io(`${API_URL}`, {
  auth: { token: authToken },
});

socket.on("engagement-update", (data) => {
  console.log("Real-time update:", data);
});

socket.on("alert", (alert) => {
  console.log("Stress alert:", alert.message);
});
```

---

For more examples, check `/examples` folder in the repository.
