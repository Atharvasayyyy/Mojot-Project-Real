#!/usr/bin/env python3
"""
🚀 Batch Prediction Tester
Test the /predict-batch endpoint with real examples
"""

import requests
import json
import time
from datetime import datetime

# Configuration
ML_API_URL = "http://localhost:8000"
BATCH_ENDPOINT = f"{ML_API_URL}/predict-batch"

# Test Cases
TEST_CASES = {
    "all_4_states": {
        "description": "Test all 4 student states in one batch",
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
    },
    "single_reading": {
        "description": "Test single reading batch",
        "readings": [
            {
                "heart_rate": 75,
                "hrv_rmssd": 45,
                "blood_oxygen": 97,
                "motion_level": 8,
                "restlessness_index": 0.12
            }
        ]
    },
    "large_batch": {
        "description": "Test large batch (10 readings)",
        "readings": [
            {
                "heart_rate": 65 + i,
                "hrv_rmssd": 55 - (i * 2),
                "blood_oxygen": 98 - (i * 0.1),
                "motion_level": 5 + (i * 2),
                "restlessness_index": 0.08 + (i * 0.02)
            }
            for i in range(10)
        ]
    },
    "stress_variations": {
        "description": "Test varying stress levels",
        "readings": [
            {
                "heart_rate": 60,
                "hrv_rmssd": 60,
                "blood_oxygen": 99,
                "motion_level": 2,
                "restlessness_index": 0.05
            },  # Very relaxed
            {
                "heart_rate": 80,
                "hrv_rmssd": 40,
                "blood_oxygen": 97,
                "motion_level": 10,
                "restlessness_index": 0.15
            },  # Engaged
            {
                "heart_rate": 110,
                "hrv_rmssd": 15,
                "blood_oxygen": 94,
                "motion_level": 20,
                "restlessness_index": 0.45
            },  # Very stressed
        ]
    }
}


def test_batch(test_name, test_data):
    """Test batch prediction endpoint"""
    print(f"\n{'='*70}")
    print(f"📊 TEST: {test_name}")
    print(f"   {test_data['description']}")
    print(f"{'='*70}")

    payload = {"readings": test_data["readings"]}
    num_readings = len(test_data["readings"])

    print(f"\n📤 Sending {num_readings} reading(s) to {BATCH_ENDPOINT}")
    print(f"   Payload size: {len(json.dumps(payload))} bytes")

    try:
        start_time = time.time()
        response = requests.post(
            BATCH_ENDPOINT,
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        elapsed_time = time.time() - start_time

        print(f"\n⏱️  Response Time: {elapsed_time:.3f}s")
        print(f"   Status: {response.status_code}")

        if response.status_code == 200:
            predictions = response.json()

            print(f"\n✅ SUCCESS! Got {len(predictions)} predictions")
            print(f"\n📋 Results:")
            print("-" * 70)

            for i, pred in enumerate(predictions):
                confidence_pct = pred["confidence"] * 100
                confidence_bar = "█" * int(confidence_pct / 10) + "░" * (10 - int(confidence_pct / 10))

                print(f"\n   Reading {i+1}:")
                print(f"   ├─ State: {pred['state']}")
                print(f"   ├─ Confidence: {confidence_pct:.1f}% [{confidence_bar}]")
                print(f"   ├─ Probabilities:")

                for state, prob in pred["probabilities"].items():
                    prob_pct = prob * 100
                    print(f"   │  ├─ {state:10s}: {prob_pct:5.1f}%")

                print(f"   └─ Timestamp: {pred['timestamp']}")

            print(f"\n{'='*70}")
            print(f"✅ TEST PASSED")
            print(f"{'='*70}\n")
            return True

        else:
            print(f"\n❌ ERROR: {response.status_code}")
            print(f"   Response: {response.text}")
            return False

    except requests.ConnectionError:
        print(f"\n❌ ERROR: Cannot connect to {BATCH_ENDPOINT}")
        print(f"   Make sure ML API is running: python improved_api.py")
        return False
    except requests.Timeout:
        print(f"\n❌ ERROR: Request timeout after 10 seconds")
        return False
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        return False


def main():
    """Run all tests"""
    print("\n" + "="*70)
    print("🚀 BATCH PREDICTION API TESTER")
    print("="*70)
    print(f"ML API URL: {ML_API_URL}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70)

    results = {}

    # Run all tests
    for test_name, test_data in TEST_CASES.items():
        results[test_name] = test_batch(test_name, test_data)
        time.sleep(0.5)  # Small delay between tests

    # Summary
    print("\n" + "="*70)
    print("📊 TEST SUMMARY")
    print("="*70)

    passed = sum(1 for v in results.values() if v)
    total = len(results)

    for test_name, passed_flag in results.items():
        status = "✅ PASSED" if passed_flag else "❌ FAILED"
        print(f"{test_name:30s}: {status}")

    print("="*70)
    print(f"Total: {passed}/{total} tests passed")

    if passed == total:
        print("🎉 ALL TESTS PASSED!")
    else:
        print(f"⚠️  {total - passed} test(s) failed")

    print("="*70 + "\n")

    return passed == total


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
