# 🔧 Arduino ESP32 Integration Guide

## Quick Overview of Data Flow

```
1. Arduino gets sessionId from backend
2. Arduino sends sensor data every second
3. Backend receives data and calls ML model
4. Backend predicts: engagement, stress, hobbies
5. Response includes predictions back to Dashboard
```

---

## 📡 API Endpoints for Arduino

### 1️⃣ Get Session Info (No JWT needed)

**Before sending sensor data, get session details:**

```
GET: http://localhost:5000/api/sessions/arduino-session/:sessionId?apiKey=device_secret_key_for_esp32

Response:
{
  "success": true,
  "sessionId": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439010",
  "isActive": true,
  "status": "ongoing",
  "activity": "classroom",
  "deviceId": "ESP32-001",
  "startTime": "2024-02-13T10:30:00Z"
}
```

### 2️⃣ Send Sensor Data Every Second

**Send your sensor data in this exact format:**

```
POST: http://localhost:5000/api/sensor-data/arduino/data

Request Body (JSON):
{
  "sessionId": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439010",
  "timestamp": 25041,
  "heartRate": 85,
  "hrvRmssd": 45.5,
  "spo2": 98,
  "motionLevel": 10.23088,
  "restlessnessIndex": 0.009722,
  "deviceId": "ESP32-001"
}

Response (with predictions):
{
  "success": true,
  "message": "Sensor data recorded and analyzed",
  "data": { ... },
  "prediction": {
    "engagement": 0.82,
    "stress": 0.28,
    "hobby": "coding",
    "confidence": 0.91,
    "alternatives": ["reading", "gaming"]
  }
}
```

---

## 🎯 Arduino IDE Code Example

### Complete Arduino Sketch

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi Credentials
const char* SSID = "YOUR_WIFI_SSID";
const char* PASSWORD = "YOUR_WIFI_PASSWORD";

// Backend Server
const char* BACKEND_URL = "http://localhost:5000/api";
const char* API_KEY = "device_secret_key_for_esp32";

// Session Variables
String SESSION_ID = "S001";
String USER_ID = "";
String DEVICE_ID = "ESP32-001";
bool sessionActive = false;

// Sensor Simulation (since you're getting 0 for heart rate, etc.)
unsigned long lastSensorRead = 0;
unsigned long sensorReadInterval = 1000; // 1 second
int sensorCount = 0;

void setup() {
  Serial.begin(115200);
  delay(100);

  Serial.println("\n\nESP32 Engagement Monitoring System");
  Serial.println("==================================");

  // Connect to WiFi
  connectToWiFi();

  // Get Session Info
  getSessionInfo();

  Serial.println("Setup Complete - Ready to send sensor data");
}

void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi();
  }

  // Send sensor data every second
  if (millis() - lastSensorRead >= sensorReadInterval && sessionActive) {
    sendSensorData();
    lastSensorRead = millis();
  }
}

// ========== WiFi Connection ==========
void connectToWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(SSID, PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ WiFi Connected!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n✗ WiFi Connection Failed");
  }
}

// ========== Get Session Info from Backend ==========
void getSessionInfo() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected");
    return;
  }

  HTTPClient http;
  String url = String(BACKEND_URL) + "/sessions/arduino-session/" + SESSION_ID + "?apiKey=" + API_KEY;

  Serial.print("Getting session info: ");
  Serial.println(url);

  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  int httpCode = http.GET();

  if (httpCode == 200) {
    String payload = http.getString();
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload);

    if (doc["success"] == true) {
      USER_ID = doc["userId"].as<String>();
      DEVICE_ID = doc["deviceId"].as<String>();
      sessionActive = doc["isActive"];

      Serial.println("✓ Session Info Retrieved:");
      Serial.print("  Session ID: ");
      Serial.println(SESSION_ID);
      Serial.print("  User ID: ");
      Serial.println(USER_ID);
      Serial.print("  Device ID: ");
      Serial.println(DEVICE_ID);
      Serial.print("  Active: ");
      Serial.println(sessionActive ? "Yes" : "No");
    }
  } else {
    Serial.print("✗ Error: ");
    Serial.println(httpCode);
    Serial.println(http.getString());
  }

  http.end();
}

// ========== Read Sensors ==========
// Replace with your actual sensor reading code
SensorData readSensors() {
  SensorData data;

  // Simulated sensor data (replace with real sensor reads)
  data.heartRate = random(60, 100);        // 60-100 bpm
  data.hrvRmssd = random(20, 60) + random(0, 100) / 100.0;  // 20-60 ms
  data.spo2 = random(95, 100);             // 95-100%
  data.motionLevel = random(0, 100) / 10.0;  // 0-10
  data.restlessnessIndex = random(0, 100) / 1000.0; // 0-0.1

  return data;
}

// Real sensor data structure you can modify
struct SensorData {
  int heartRate;        // From heart rate sensor
  float hrvRmssd;       // Heart Rate Variability
  int spo2;             // Blood Oxygen %
  float motionLevel;    // 0-100 (from accelerometer)
  float restlessnessIndex;  // Calculated restlessness
};

// ========== Send Sensor Data to Backend ==========
void sendSensorData() {
  if (!sessionActive) {
    Serial.println("Session not active");
    return;
  }

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected");
    return;
  }

  // Read current sensor data
  SensorData sensors = readSensors();

  // Create JSON payload
  DynamicJsonDocument doc(256);
  doc["sessionId"] = SESSION_ID;
  doc["userId"] = USER_ID;
  doc["timestamp"] = millis();
  doc["heartRate"] = sensors.heartRate;
  doc["hrvRmssd"] = sensors.hrvRmssd;
  doc["spo2"] = sensors.spo2;
  doc["motionLevel"] = sensors.motionLevel;
  doc["restlessnessIndex"] = sensors.restlessnessIndex;
  doc["deviceId"] = DEVICE_ID;

  // Convert to JSON string
  String payload;
  serializeJson(doc, payload);

  // Send HTTP POST
  HTTPClient http;
  String url = String(BACKEND_URL) + "/sensor-data/arduino/data";

  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  int httpCode = http.POST(payload);

  if (httpCode == 201) {
    sensorCount++;

    // Parse response for predictions
    String response = http.getString();
    DynamicJsonDocument respDoc(512);
    deserializeJson(respDoc, response);

    if (respDoc["prediction"]) {
      Serial.print("[#");
      Serial.print(sensorCount);
      Serial.print("] Predicted Hobby: ");
      Serial.print(respDoc["prediction"]["hobby"].as<String>());
      Serial.print(" (");
      Serial.print(respDoc["prediction"]["confidence"].as<float>() * 100);
      Serial.println("%)");

      Serial.print("  Engagement: ");
      Serial.print(respDoc["prediction"]["engagement"].as<float>() * 100);
      Serial.print("% | Stress: ");
      Serial.print(respDoc["prediction"]["stress"].as<float>() * 100);
      Serial.println("%");
    }
  } else {
    Serial.print("✗ HTTP Error: ");
    Serial.println(httpCode);
  }

  http.end();
}

// ========== Helper: Start Session ==========
// Call this to start a new session (optional)
void startNewSession(String activity = "classroom") {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected");
    return;
  }

  DynamicJsonDocument doc(256);
  doc["activity"] = activity;
  doc["deviceId"] = DEVICE_ID;

  String payload;
  serializeJson(doc, payload);

  HTTPClient http;
  String url = String(BACKEND_URL) + "/sessions/start";

  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  int httpCode = http.POST(payload);

  if (httpCode == 201) {
    String response = http.getString();
    DynamicJsonDocument respDoc(512);
    deserializeJson(respDoc, response);

    SESSION_ID = respDoc["session"]["_id"].as<String>();
    Serial.print("✓ New Session Created: ");
    Serial.println(SESSION_ID);

    getSessionInfo();
  }

  http.end();
}
```

---

## ⚙️ Installation Steps

### 1. Install Required Libraries in Arduino IDE

**Sketch → Include Library → Manage Libraries**

Search for and install:

- `ArduinoJson` (by Benoit Blanchon) - v6.21.0 or higher
- `HTTPClient` (usually built-in)

### 2. Configure WiFi & Backend

Edit these lines in the code:

```cpp
const char* SSID = "YOUR_WIFI_SSID";
const char* PASSWORD = "YOUR_WIFI_PASSWORD";
const char* BACKEND_URL = "http://localhost:5000/api";  // Or your backend IP
```

### 3. Replace Sensor Reading Function

Replace the `readSensors()` function with your actual sensor code:

```cpp
SensorData readSensors() {
  SensorData data;

  // YOUR ACTUAL SENSOR READS HERE
  data.heartRate = readHeartRate();      // Your heart rate sensor
  data.hrvRmssd = calculateHRV();        // Your HRV calculation
  data.spo2 = readSpO2();                // Your SpO2 sensor
  data.motionLevel = readMotion();       // Your accelerometer data
  data.restlessnessIndex = calculateRestlessness();

  return data;
}
```

### 4. Upload & Monitor

1. Connect ESP32 via USB
2. Select Board: ESP32 Dev Module
3. Upload sketch
4. Open Serial Monitor (115200 baud)
5. Watch real-time predictions!

---

## 📊 Expected Serial Output

```
ESP32 Engagement Monitoring System
==================================
Connecting to WiFi: MyNetwork
.....
✓ WiFi Connected!
IP: 192.168.1.100
Getting session info: http://localhost:5000/api/sessions/arduino-session/S001?apiKey=device_secret_key_for_esp32
✓ Session Info Retrieved:
  Session ID: S001
  User ID: 507f1f77bcf86cd799439010
  Device ID: ESP32-001
  Active: Yes
Setup Complete - Ready to send sensor data
[#1] Predicted Hobby: coding (92%)
  Engagement: 82% | Stress: 28%
[#2] Predicted Hobby: reading (85%)
  Engagement: 78% | Stress: 32%
[#3] Predicted Hobby: gaming (88%)
  Engagement: 85% | Stress: 25%
```

---

## 🔧 Troubleshooting

| Issue                  | Solution                                         |
| ---------------------- | ------------------------------------------------ |
| Cannot connect to WiFi | Check SSID/password, check router distance       |
| HTTP 401 Error         | Verify `API_KEY` matches backend `.env` file     |
| HTTP 404 Error         | Check `BACKEND_URL` and `SESSION_ID` are correct |
| jsonlib errors         | Install ArduinoJson library via Library Manager  |
| Sensor data all zeros  | Implement actual sensor reading code             |
| No predictions         | Ensure ML service (port 8000) is running         |

---

## 🎯 Real-Time Dashboard Integration

After sending data, check your dashboard:

1. Student sees predictions update live
2. Parent gets alerts if stress too high
3. Teacher sees class engagement heatmap
4. Hobbies update based on movement patterns

---

## 📱 Sample Data Format

Your Arduino is sending good data! Here's what backend expects:

```json
{
  "sessionId": "S001",
  "userId": "user_id_from_session",
  "timestamp": 25041,
  "heartRate": 85,
  "hrvRmssd": 45.5,
  "spo2": 98,
  "motionLevel": 10.23088,
  "restlessnessIndex": 0.009722,
  "deviceId": "ESP32-001"
}
```

✅ Your motion and restlessness data is perfect!
⏳ Heart rate/HRV/SpO2 will show as 0 until you wire the sensors

---

## 🚀 Next Steps

1. **Test locally**: Run backend & send test data
2. **Wire sensors**: Connect heart rate, SpO2 sensors
3. **Calibrate**: Adjust sensor reading functions
4. **Deploy**: Move to production backend URL
5. **Monitor**: Watch real-time predictions

---

**Questions?**

- Check backend logs: See `/backend/.env` for `LOG_LEVEL=info`
- Test endpoint manually: Use Postman/curl
- Check device API key matches: `DEVICE_API_KEY` in `.env`
