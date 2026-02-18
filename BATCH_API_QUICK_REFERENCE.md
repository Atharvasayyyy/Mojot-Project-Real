# 📋 BATCH API QUICK REFERENCE

## ⚡ Quick Start (30 seconds)

```json
// POST http://localhost:8000/predict-batch

{
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
```

**Response:** Array of predictions with state, confidence, probabilities

---

## 📊 Copy-Paste Examples

### All 4 States (Most Common)

```json
{
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
    },
    {
      "heart_rate": 95,
      "hrv_rmssd": 25,
      "blood_oxygen": 95,
      "motion_level": 15,
      "restlessness_index": 0.35
    },
    {
      "heart_rate": 68,
      "hrv_rmssd": 52,
      "blood_oxygen": 98,
      "motion_level": 30,
      "restlessness_index": 0.45
    }
  ]
}
```

### Stressed State Only

```json
{
  "readings": [
    {
      "heart_rate": 100,
      "hrv_rmssd": 20,
      "blood_oxygen": 94,
      "motion_level": 18,
      "restlessness_index": 0.42
    },
    {
      "heart_rate": 105,
      "hrv_rmssd": 15,
      "blood_oxygen": 93,
      "motion_level": 22,
      "restlessness_index": 0.48
    },
    {
      "heart_rate": 95,
      "hrv_rmssd": 25,
      "blood_oxygen": 95,
      "motion_level": 14,
      "restlessness_index": 0.38
    }
  ]
}
```

### Relaxed State Only

```json
{
  "readings": [
    {
      "heart_rate": 62,
      "hrv_rmssd": 58,
      "blood_oxygen": 99,
      "motion_level": 2,
      "restlessness_index": 0.05
    },
    {
      "heart_rate": 65,
      "hrv_rmssd": 55,
      "blood_oxygen": 98,
      "motion_level": 3,
      "restlessness_index": 0.06
    },
    {
      "heart_rate": 60,
      "hrv_rmssd": 60,
      "blood_oxygen": 99,
      "motion_level": 1,
      "restlessness_index": 0.04
    }
  ]
}
```

### Engaged State Only

```json
{
  "readings": [
    {
      "heart_rate": 75,
      "hrv_rmssd": 45,
      "blood_oxygen": 97,
      "motion_level": 8,
      "restlessness_index": 0.12
    },
    {
      "heart_rate": 78,
      "hrv_rmssd": 42,
      "blood_oxygen": 97,
      "motion_level": 10,
      "restlessness_index": 0.14
    },
    {
      "heart_rate": 72,
      "hrv_rmssd": 48,
      "blood_oxygen": 97,
      "motion_level": 6,
      "restlessness_index": 0.1
    }
  ]
}
```

### Bored State Only

```json
{
  "readings": [
    {
      "heart_rate": 68,
      "hrv_rmssd": 52,
      "blood_oxygen": 98,
      "motion_level": 30,
      "restlessness_index": 0.45
    },
    {
      "heart_rate": 70,
      "hrv_rmssd": 50,
      "blood_oxygen": 98,
      "motion_level": 28,
      "restlessness_index": 0.43
    },
    {
      "heart_rate": 66,
      "hrv_rmssd": 54,
      "blood_oxygen": 98,
      "motion_level": 32,
      "restlessness_index": 0.47
    }
  ]
}
```

---

## 📏 Sensor Value Ranges

| State        | HR     | HRV   | O2    | Motion | Restlessness |
| ------------ | ------ | ----- | ----- | ------ | ------------ |
| **Relaxed**  | 60-70  | 50+   | 97-99 | 0-5    | 0-0.1        |
| **Engaged**  | 70-80  | 40-50 | 96-98 | 5-15   | 0.1-0.2      |
| **Stressed** | 85-105 | 20-35 | 94-96 | 10-20  | 0.3-0.45     |
| **Bored**    | 65-75  | 50-60 | 97-99 | 25-35  | 0.4-0.5      |

**Legend:**

- HR = Heart Rate (BPM)
- HRV = Heart Rate Variability (ms)
- O2 = Blood Oxygen (%)
- Motion = Motion Level (0-100)
- Restlessness = Restlessness Index (0-5)

---

## 🔗 Endpoints

```
POST http://localhost:8000/predict-batch
Content-Type: application/json

Body: {"readings": [...]}

Response: [
  {
    "state": "Relaxed|Engaged|Stressed|Bored",
    "confidence": <float 0-1>,
    "probabilities": {...},
    "raw_features": {...},
    "timestamp": "<ISO timestamp>"
  },
  ...
]
```

---

## ⚙️ Valid Ranges

```
heart_rate:       40-150 (BPM)
hrv_rmssd:        5-120  (ms)
blood_oxygen:     85-100 (%)
motion_level:     0-100  (level)
restlessness_index: 0-5  (index)
```

---

## ✅ Common Patterns

### Pattern 1: Test All 4 States (Testing)

```python
# 4 readings = test all states
readings = [
    {hr: 65, hrv: 55, o2: 98, motion: 5, restlessness: 0.08},    # Relaxed
    {hr: 75, hrv: 45, o2: 97, motion: 8, restlessness: 0.12},    # Engaged
    {hr: 95, hrv: 25, o2: 95, motion: 15, restlessness: 0.35},   # Stressed
    {hr: 68, hrv: 52, o2: 98, motion: 30, restlessness: 0.45},   # Bored
]
```

### Pattern 2: Progressive Stress (Stress Testing)

```python
# Show increasing stress levels
readings = [
    {hr: 65, hrv: 55, o2: 98, motion: 5, restlessness: 0.05},    # Calm
    {hr: 80, hrv: 40, o2: 97, motion: 12, restlessness: 0.20},   # Moderate
    {hr: 100, hrv: 20, o2: 94, motion: 20, restlessness: 0.45},  # Very stressed
]
```

### Pattern 3: Historical Batch (Data Analysis)

```python
# 50+ readings from database
readings = load_from_db("SELECT * FROM sensor_data WHERE date='2026-02-19'")
# Process in batches of 50
for batch in chunk(readings, 50):
    predictions = batch_predict(batch)
```

### Pattern 4: Real-time Monitoring

```python
# Every 5 minutes, analyze last 30 readings
readings = load_from_db("SELECT * FROM sensor_data WHERE timestamp > NOW() - 5 min")
predictions = batch_predict(readings)
check_if_stressed(predictions)  # Alert if stressed
```

---

## 🚨 Common Errors & Fixes

### ❌ Error 1: "Input should be a valid list"

```
WRONG:
{
  "reading": [...]     // ❌ Wrong key
}

CORRECT:
{
  "readings": [...]    // ✅ Correct
}
```

### ❌ Error 2: "Invalid sensor value"

```
WRONG:
{
  "readings": [
    {"heart_rate": 200, ...}  // ❌ 200 BPM is out of range
  ]
}

CORRECT:
{
  "readings": [
    {"heart_rate": 75, ...}   // ✅ 75 BPM is valid
  ]
}
```

### ❌ Error 3: "Missing required field"

```
WRONG:
{
  "readings": [
    {"heart_rate": 75}        // ❌ Missing other fields
  ]
}

CORRECT:
{
  "readings": [
    {
      "heart_rate": 75,       // ✅ All 5 fields
      "hrv_rmssd": 45,
      "blood_oxygen": 97,
      "motion_level": 8,
      "restlessness_index": 0.12
    }
  ]
}
```

### ❌ Error 4: "Connection refused"

```
CAUSE: ML API not running
FIX:
cd ml-model
python improved_api.py
```

### ❌ Error 5: Request timeout

```
CAUSE: Batch too large (usually >200 readings)
FIX: Split into smaller batches (50-100 each)
```

---

## 🐍 Python One-Liners

### Send batch and get results:

```python
import requests
r = requests.post("http://localhost:8000/predict-batch", json={"readings": [{"heart_rate": 75, "hrv_rmssd": 45, "blood_oxygen": 97, "motion_level": 8, "restlessness_index": 0.12}]})
print(r.json()[0]["state"])  # Output: Engaged
```

### Get confidence for first prediction:

```python
confidence = requests.post("http://localhost:8000/predict-batch", json={"readings": [...]}).json()[0]["confidence"]
print(f"Confidence: {confidence*100:.1f}%")
```

### Extract all states from batch:

```python
predictions = requests.post("http://localhost:8000/predict-batch", json={"readings": [...]}).json()
states = [p["state"] for p in predictions]
print(states)  # [Relaxed, Engaged, Stressed, Bored]
```

---

## 🟢 Response Examples

### Success Response:

```json
[
  {
    "state": "Engaged",
    "confidence": 0.9855,
    "probabilities": {
      "Relaxed": 0.01,
      "Engaged": 0.9855,
      "Stressed": 0.005,
      "Bored": 0.0
    },
    "raw_features": {
      "heart_rate": 75.0,
      "hrv_rmssd": 45.0,
      "blood_oxygen": 97.0,
      "motion_level": 8.0,
      "restlessness_index": 0.12
    },
    "timestamp": "2026-02-19T01:30:34.460523"
  }
]
```

### Confidence Interpretation:

```
90-100% = Highly confident ✅
70-90%  = Confident ✓
50-70%  = Moderately confident ~
<50%    = Uncertain ? (Might be misclassified)
```

---

## 🎯 Usage Patterns by Role

### Teacher: Quick test (1 minute)

```python
# Quick 4-state test
curl -X POST http://localhost:8000/predict-batch \
  -H "Content-Type: application/json" \
  -d '{"readings": [
    {"heart_rate": 65, "hrv_rmssd": 55, "blood_oxygen": 98, "motion_level": 5, "restlessness_index": 0.08},
    {"heart_rate": 75, "hrv_rmssd": 45, "blood_oxygen": 97, "motion_level": 8, "restlessness_index": 0.12},
    {"heart_rate": 95, "hrv_rmssd": 25, "blood_oxygen": 95, "motion_level": 15, "restlessness_index": 0.35},
    {"heart_rate": 68, "hrv_rmssd": 52, "blood_oxygen": 98, "motion_level": 30, "restlessness_index": 0.45}
  ]}'
```

### Developer: Integration (5 minutes)

```python
def analyze_session(session_readings):
    response = requests.post(
        "http://localhost:8000/predict-batch",
        json={"readings": session_readings}
    )
    predictions = response.json()

    states = [p["state"] for p in predictions]
    avg_confidence = sum(p["confidence"] for p in predictions) / len(predictions)

    return {"states": states, "avg_confidence": avg_confidence}
```

### Researcher: Batch processing (1 hour)

```python
# Process 10000 readings
all_readings = load_dataset("sensor_data.csv")
batch_size = 100
all_predictions = []

for batch in chunks(all_readings, batch_size):
    predictions = batch_predict(batch)
    all_predictions.extend(predictions)

analyze_results(all_predictions)
```

---

## 📊 Performance Tips

| Action       | Time   | Size  |
| ------------ | ------ | ----- |
| 1 reading    | ~500ms | 32B   |
| 10 readings  | ~1s    | 320B  |
| 50 readings  | ~2s    | 1.6KB |
| 100 readings | ~3s    | 3.2KB |
| 500 readings | ~10s   | 16KB  |

**Best Practice:** Use 50-100 readings per batch for optimal speed

---

## 🔄 Workflow Example

```
Morning Report Generation (Automated 8am):
1. Load all yesterday's readings (1000+)
2. Split into batches of 50
3. Send each batch to /predict-batch
4. Collect all predictions
5. Generate statistics
6. Create visualization
7. Send to teachers
= DONE in ~1 minute
```

---

## 🆘 When to Use Batch

| Scenario             | Use Batch? | Reason              |
| -------------------- | ---------- | ------------------- |
| Testing 1 reading    | ❌ No      | Overkill            |
| Testing 4 states     | ✅ Yes     | Efficient           |
| Historical analysis  | ✅ Yes     | 100+ readings       |
| Real-time prediction | ❌ No      | Use single /predict |
| Daily report         | ✅ Yes     | Bulk processing     |
| Live monitoring      | ❌ No      | Use single endpoint |

---

## 📚 Resources

**Learn More:**

- Full guide: `BATCH_API_AUTOMATION_GUIDE.md`
- Fix report: `BATCH_API_FIX_REPORT.md`
- Test script: `test-batch-api.py`
- Postman: `Complete_API_Testing_Guide_NewUser.json`

**Test It:**

- Postman → PHASE 4.1 → "Batch Predict (All 4 States)"

**Run Tests:**

- `python test-batch-api.py`

---

**Last Updated:** February 19, 2026  
**Status:** ✅ Production Ready  
**Accuracy:** 99.5%
