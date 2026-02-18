"""
ML Model Testing Script
Tests all ML model endpoints and validates predictions
"""

import requests
import json
import time
from datetime import datetime

# Configuration
ML_MODEL_URL = "http://localhost:8000"
TEST_TIMEOUT = 10

# Colors for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_section(title):
    print(f"\n{Colors.BOLD}{Colors.OKBLUE}{'='*65}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.OKBLUE}{title}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.OKBLUE}{'='*65}{Colors.ENDC}\n")

def print_success(msg):
    print(f"{Colors.OKGREEN}✅ {msg}{Colors.ENDC}")

def print_error(msg):
    print(f"{Colors.FAIL}❌ {msg}{Colors.ENDC}")

def print_warning(msg):
    print(f"{Colors.WARNING}⚠️  {msg}{Colors.ENDC}")

def print_info(msg):
    print(f"{Colors.OKCYAN}ℹ️  {msg}{Colors.ENDC}")

def test_health():
    """Test 1: Health Check"""
    print_section("TEST 1: HEALTH CHECK")
    try:
        response = requests.get(
            f"{ML_MODEL_URL}/health",
            timeout=TEST_TIMEOUT
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"ML Model is healthy!")
            print_info(f"Service: {data.get('service', 'N/A')}")
            print_info(f"Version: {data.get('version', 'N/A')}")
            print_info(f"Status: {data.get('status', 'N/A')}")
            return True
        else:
            print_error(f"Health check failed with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_error(f"Cannot connect to ML Model at {ML_MODEL_URL}")
        print_warning("Make sure the ML model is running: python -m uvicorn main:app --host 0.0.0.0 --port 8000")
        return False
    except Exception as e:
        print_error(f"Health check error: {str(e)}")
        return False

def test_prediction_normal():
    """Test 2: Prediction with Normal Sensor Data"""
    print_section("TEST 2: NORMAL SENSOR DATA PREDICTION")
    
    # Normal, engaged student sensor data
    test_data = {
        "heart_rate": 72,
        "hrv_rmssd": 45.5,
        "blood_oxygen": 97,
        "motion_level": 5.2,
        "restlessness_index": 0.08
    }
    
    print_info("Testing with normal engaged student data:")
    print_info(f"  Heart Rate: {test_data['heart_rate']} bpm")
    print_info(f"  HRV RMSSD: {test_data['hrv_rmssd']} ms")
    print_info(f"  Blood Oxygen: {test_data['blood_oxygen']}%")
    print_info(f"  Motion Level: {test_data['motion_level']}")
    print_info(f"  Restlessness: {test_data['restlessness_index']}")
    
    try:
        response = requests.post(
            f"{ML_MODEL_URL}/predict",
            json=test_data,
            timeout=TEST_TIMEOUT
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success("Prediction received!")
            
            # Display results
            print(f"\n{Colors.BOLD}Prediction Results:{Colors.ENDC}")
            
            if "engagement" in data:
                eng = data["engagement"]
                print_info(f"Engagement: {eng.get('level', 'N/A')} (confidence: {eng.get('confidence', 'N/A')})")
            
            if "stress" in data:
                stress = data["stress"]
                print_info(f"Stress Level: {stress.get('level', 'N/A')} (confidence: {stress.get('confidence', 'N/A')})")
            
            if "hobby" in data:
                hobby = data["hobby"]
                print_info(f"Hobby Detected: {hobby.get('activity', 'N/A')} (confidence: {hobby.get('confidence', 'N/A')})")
            
            return True
        else:
            print_error(f"Prediction failed with status {response.status_code}")
            print_error(f"Response: {response.text}")
            return False
    except Exception as e:
        print_error(f"Prediction error: {str(e)}")
        return False

def test_prediction_stressed():
    """Test 3: Prediction with Stressed Student Data"""
    print_section("TEST 3: STRESSED STUDENT DATA PREDICTION")
    
    # Stressed student sensor data (high heart rate, low HRV, high restlessness)
    test_data = {
        "heart_rate": 105,
        "hrv_rmssd": 18.3,
        "blood_oxygen": 94,
        "motion_level": 12.8,
        "restlessness_index": 0.45
    }
    
    print_info("Testing with stressed student data:")
    print_info(f"  Heart Rate: {test_data['heart_rate']} bpm (elevated)")
    print_info(f"  HRV RMSSD: {test_data['hrv_rmssd']} ms (low - stressed)")
    print_info(f"  Blood Oxygen: {test_data['blood_oxygen']}% (low)")
    print_info(f"  Motion Level: {test_data['motion_level']} (high)")
    print_info(f"  Restlessness: {test_data['restlessness_index']} (high)")
    
    try:
        response = requests.post(
            f"{ML_MODEL_URL}/predict",
            json=test_data,
            timeout=TEST_TIMEOUT
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success("Prediction received!")
            
            print(f"\n{Colors.BOLD}Prediction Results:{Colors.ENDC}")
            
            if "engagement" in data:
                eng = data["engagement"]
                print_info(f"Engagement: {eng.get('level', 'N/A')} (confidence: {eng.get('confidence', 'N/A')})")
            
            if "stress" in data:
                stress = data["stress"]
                print_info(f"Stress Level: {stress.get('level', 'N/A')} (confidence: {stress.get('confidence', 'N/A')})")
            
            if "hobby" in data:
                hobby = data["hobby"]
                print_info(f"Hobby Detected: {hobby.get('activity', 'N/A')} (confidence: {hobby.get('confidence', 'N/A')})")
            
            return True
        else:
            print_error(f"Prediction failed with status {response.status_code}")
            print_error(f"Response: {response.text}")
            return False
    except Exception as e:
        print_error(f"Prediction error: {str(e)}")
        return False

def test_prediction_disengaged():
    """Test 4: Prediction with Disengaged Student Data"""
    print_section("TEST 4: DISENGAGED STUDENT DATA PREDICTION")
    
    # Disengaged student sensor data (low motion, irregular patterns)
    test_data = {
        "heart_rate": 58,
        "hrv_rmssd": 62.1,
        "blood_oxygen": 98,
        "motion_level": 1.2,
        "restlessness_index": 0.02
    }
    
    print_info("Testing with disengaged student data:")
    print_info(f"  Heart Rate: {test_data['heart_rate']} bpm (low)")
    print_info(f"  HRV RMSSD: {test_data['hrv_rmssd']} ms (very high)")
    print_info(f"  Blood Oxygen: {test_data['blood_oxygen']}%")
    print_info(f"  Motion Level: {test_data['motion_level']} (very low)")
    print_info(f"  Restlessness: {test_data['restlessness_index']} (very low)")
    
    try:
        response = requests.post(
            f"{ML_MODEL_URL}/predict",
            json=test_data,
            timeout=TEST_TIMEOUT
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success("Prediction received!")
            
            print(f"\n{Colors.BOLD}Prediction Results:{Colors.ENDC}")
            
            if "engagement" in data:
                eng = data["engagement"]
                print_info(f"Engagement: {eng.get('level', 'N/A')} (confidence: {eng.get('confidence', 'N/A')})")
            
            if "stress" in data:
                stress = data["stress"]
                print_info(f"Stress Level: {stress.get('level', 'N/A')} (confidence: {stress.get('confidence', 'N/A')})")
            
            if "hobby" in data:
                hobby = data["hobby"]
                print_info(f"Hobby Detected: {hobby.get('activity', 'N/A')} (confidence: {hobby.get('confidence', 'N/A')})")
            
            return True
        else:
            print_error(f"Prediction failed with status {response.status_code}")
            print_error(f"Response: {response.text}")
            return False
    except Exception as e:
        print_error(f"Prediction error: {str(e)}")
        return False

def test_invalid_data():
    """Test 5: Invalid Data Handling"""
    print_section("TEST 5: INVALID DATA HANDLING")
    
    # Missing required fields
    test_data = {
        "heart_rate": 72,
        # Missing other fields
    }
    
    print_info("Testing with incomplete data (missing fields):")
    
    try:
        response = requests.post(
            f"{ML_MODEL_URL}/predict",
            json=test_data,
            timeout=TEST_TIMEOUT
        )
        
        if response.status_code != 200:
            print_success(f"Properly rejected invalid data (status: {response.status_code})")
            print_info(f"Error: {response.json().get('detail', 'N/A')}")
            return True
        else:
            print_warning("Model accepted incomplete data (possible validation issue)")
            return False
    except Exception as e:
        print_error(f"Error testing invalid data: {str(e)}")
        return False

def test_edge_cases():
    """Test 6: Edge Cases"""
    print_section("TEST 6: EDGE CASES")
    
    edge_cases = [
        {
            "name": "Extreme high values",
            "data": {
                "heart_rate": 200,
                "hrv_rmssd": 150,
                "blood_oxygen": 100,
                "motion_level": 50,
                "restlessness_index": 3.0
            }
        },
        {
            "name": "Extreme low values",
            "data": {
                "heart_rate": 30,
                "hrv_rmssd": 5,
                "blood_oxygen": 80,
                "motion_level": 0,
                "restlessness_index": 0
            }
        },
        {
            "name": "All zeros",
            "data": {
                "heart_rate": 0,
                "hrv_rmssd": 0,
                "blood_oxygen": 0,
                "motion_level": 0,
                "restlessness_index": 0
            }
        }
    ]
    
    results = []
    for test_case in edge_cases:
        print_info(f"\nTesting: {test_case['name']}")
        try:
            response = requests.post(
                f"{ML_MODEL_URL}/predict",
                json=test_case['data'],
                timeout=TEST_TIMEOUT
            )
            
            if response.status_code == 200:
                print_success(f"  ✓ Handled successfully")
                results.append(True)
            else:
                print_warning(f"  ⚠ Returned status {response.status_code}")
                results.append(False)
        except Exception as e:
            print_error(f"  ✗ Error: {str(e)}")
            results.append(False)
    
    return all(results)

def print_summary(results):
    """Print test summary"""
    print_section("TEST SUMMARY")
    
    tests = [
        ("Health Check", results[0]),
        ("Normal Prediction", results[1]),
        ("Stressed Prediction", results[2]),
        ("Disengaged Prediction", results[3]),
        ("Invalid Data Handling", results[4]),
        ("Edge Cases", results[5])
    ]
    
    passed = sum(1 for _, result in tests if result)
    total = len(tests)
    
    for test_name, result in tests:
        status = f"{Colors.OKGREEN}PASS{Colors.ENDC}" if result else f"{Colors.FAIL}FAIL{Colors.ENDC}"
        print(f"{test_name:.<40} {status}")
    
    print()
    print_info(f"Results: {passed}/{total} tests passed")
    
    if passed == total:
        print_success("🎉 All tests passed! ML Model is working properly!")
        return True
    else:
        print_warning(f"⚠️  {total - passed} test(s) failed. Check the details above.")
        return False

def main():
    print(f"\n{Colors.BOLD}{Colors.HEADER}")
    print("╔═══════════════════════════════════════════╗")
    print("║     🤖 ML MODEL TESTING SUITE 🤖         ║")
    print("║     IoT Student Engagement AI             ║")
    print("╚═══════════════════════════════════════════╝")
    print(Colors.ENDC)
    
    print_info(f"Testing ML Model at: {ML_MODEL_URL}")
    print_info(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    # Run all tests
    results = []
    
    # Test 1: Health
    results.append(test_health())
    
    # Test 2: Normal prediction
    results.append(test_prediction_normal())
    
    # Test 3: Stressed prediction
    results.append(test_prediction_stressed())
    
    # Test 4: Disengaged prediction
    results.append(test_prediction_disengaged())
    
    # Test 5: Invalid data
    results.append(test_invalid_data())
    
    # Test 6: Edge cases
    results.append(test_edge_cases())
    
    # Print summary
    success = print_summary(results)
    
    print_info(f"Test completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    return 0 if success else 1

if __name__ == "__main__":
    exit(main())
