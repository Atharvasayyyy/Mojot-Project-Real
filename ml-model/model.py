import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
from datetime import datetime
import json

class EngagementMLModel:
    """Machine Learning Model for Student Engagement & Hobby Prediction"""
    
    def __init__(self, model_dir='models'):
        self.model_dir = model_dir
        self.engagement_model = None
        self.stress_model = None
        self.hobby_model = None
        self.scaler = None
        self.label_encoders = {}
        self.feature_names = [
            'heart_rate', 
            'hrv_rmssd', 
            'blood_oxygen', 
            'motion_level', 
            'restlessness_index'
        ]
        
        if not os.path.exists(model_dir):
            os.makedirs(model_dir)
    
    def generate_training_data(self, n_samples=1000):
        """Generate synthetic training data for demonstration"""
        np.random.seed(42)
        
        data = {
            'heart_rate': np.random.randint(60, 120, n_samples),
            'hrv_rmssd': np.random.randint(20, 100, n_samples),
            'blood_oxygen': np.random.randint(95, 100, n_samples),
            'motion_level': np.random.randint(0, 100, n_samples),
            'restlessness_index': np.random.randint(0, 100, n_samples),
        }
        
        # Create labels based on patterns
        engagement_labels = []
        stress_labels = []
        hobby_labels = []
        
        for i in range(n_samples):
            hr = data['heart_rate'][i]
            hrv = data['hrv_rmssd'][i]
            motion = data['motion_level'][i]
            restlessness = data['restlessness_index'][i]
            
            # Engagement logic
            if hr < 75 and motion < 40:
                engagement_labels.append('high')
            elif hr > 90 and restlessness > 60:
                engagement_labels.append('low')
            else:
                engagement_labels.append('medium')
            
            # Stress logic
            if hr > 100 and hrv < 30:
                stress_labels.append('stressed')
            elif hr < 70 and hrv > 60:
                stress_labels.append('relaxed')
            else:
                stress_labels.append('normal')
            
            # Hobby prediction based on activity patterns
            if motion > 60:
                hobby_labels.append('sports')
            elif restlessness < 20:
                hobby_labels.append('reading')
            elif motion > 40 and motion < 60:
                hobby_labels.append('gaming')
            elif restlessness > 40:
                hobby_labels.append('socializing')
            else:
                hobby_labels.append('coding')
        
        df = pd.DataFrame(data)
        df['engagement'] = engagement_labels
        df['stress'] = stress_labels
        df['hobby'] = hobby_labels
        
        return df
    
    def train_engagement_model(self):
        """Train engagement prediction model"""
        print("🏋️ Training Engagement Model...")
        
        # Generate training data
        df = self.generate_training_data(1000)
        
        X = df[self.feature_names].values
        y = df['engagement'].values
        
        # Encode labels
        le = LabelEncoder()
        y_encoded = le.fit_transform(y)
        self.label_encoders['engagement'] = le
        
        # Scale features
        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)
        
        # Train model
        self.engagement_model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        self.engagement_model.fit(X_scaled, y_encoded)
        
        # Evaluate
        y_pred = self.engagement_model.predict(X_scaled)
        accuracy = accuracy_score(y_encoded, y_pred)
        print(f"✅ Engagement Model Accuracy: {accuracy:.4f}")
        
        # Save model
        joblib.dump(self.engagement_model, f'{self.model_dir}/engagement_model.pkl')
        joblib.dump(self.scaler, f'{self.model_dir}/scaler.pkl')
        joblib.dump(le, f'{self.model_dir}/engagement_encoder.pkl')
        
        return accuracy
    
    def train_hobby_model(self):
        """Train hobby prediction model"""
        print("🎯 Training Hobby Prediction Model...")
        
        # Generate training data
        df = self.generate_training_data(1000)
        
        X = df[self.feature_names].values
        y = df['hobby'].values
        
        # Encode labels
        le = LabelEncoder()
        y_encoded = le.fit_transform(y)
        self.label_encoders['hobby'] = le
        
        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Train model
        self.hobby_model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        self.hobby_model.fit(X_scaled, y_encoded)
        
        # Evaluate
        y_pred = self.hobby_model.predict(X_scaled)
        accuracy = accuracy_score(y_encoded, y_pred)
        print(f"✅ Hobby Model Accuracy: {accuracy:.4f}")
        
        # Save model
        joblib.dump(self.hobby_model, f'{self.model_dir}/hobby_model.pkl')
        joblib.dump(le, f'{self.model_dir}/hobby_encoder.pkl')
        
        return accuracy
    
    def train_stress_model(self):
        """Train stress prediction model"""
        print("😰 Training Stress Detection Model...")
        
        # Generate training data
        df = self.generate_training_data(1000)
        
        X = df[self.feature_names].values
        y = df['stress'].values
        
        # Encode labels
        le = LabelEncoder()
        y_encoded = le.fit_transform(y)
        self.label_encoders['stress'] = le
        
        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Train model
        self.stress_model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        self.stress_model.fit(X_scaled, y_encoded)
        
        # Evaluate
        y_pred = self.stress_model.predict(X_scaled)
        accuracy = accuracy_score(y_encoded, y_pred)
        print(f"✅ Stress Model Accuracy: {accuracy:.4f}")
        
        # Save model
        joblib.dump(self.stress_model, f'{self.model_dir}/stress_model.pkl')
        joblib.dump(le, f'{self.model_dir}/stress_encoder.pkl')
        
        return accuracy
    
    def predict(self, features_dict):
        """Make predictions on new data"""
        try:
            # Extract features in correct order
            features = np.array([
                features_dict.get('heart_rate', 75),
                features_dict.get('hrv_rmssd', 50),
                features_dict.get('blood_oxygen', 98),
                features_dict.get('motion_level', 30),
                features_dict.get('restlessness_index', 20)
            ]).reshape(1, -1)
            
            # Scale features
            scaler = joblib.load(f'{self.model_dir}/scaler.pkl')
            features_scaled = scaler.transform(features)
            
            # Get predictions
            engagement_pred = self.engagement_model.predict(features_scaled)[0]
            engagement_proba = self.engagement_model.predict_proba(features_scaled)[0]
            
            hobby_pred = self.hobby_model.predict(features_scaled)[0]
            hobby_proba = self.hobby_model.predict_proba(features_scaled)[0]
            
            stress_pred = self.stress_model.predict(features_scaled)[0]
            stress_proba = self.stress_model.predict_proba(features_scaled)[0]
            
            # Decode predictions
            engagement_le = joblib.load(f'{self.model_dir}/engagement_encoder.pkl')
            hobby_le = joblib.load(f'{self.model_dir}/hobby_encoder.pkl')
            stress_le = joblib.load(f'{self.model_dir}/stress_encoder.pkl')
            
            engagement_label = engagement_le.inverse_transform([engagement_pred])[0]
            hobby_label = hobby_le.inverse_transform([hobby_pred])[0]
            stress_label = stress_le.inverse_transform([stress_pred])[0]
            
            # Get top 3 hobbies
            top_hobby_indices = np.argsort(hobby_proba)[-3:][::-1]
            top_hobbies = [
                {
                    'hobby': hobby_le.inverse_transform([i])[0],
                    'confidence': float(hobby_proba[i])
                }
                for i in top_hobby_indices
            ]
            
            return {
                'engagement': {
                    'level': engagement_label,
                    'confidence': float(engagement_proba[engagement_pred])
                },
                'stress': {
                    'level': stress_label,
                    'confidence': float(stress_proba[stress_pred])
                },
                'hobby': {
                    'predicted': hobby_label,
                    'confidence': float(hobby_proba[hobby_pred]),
                    'top_3': top_hobbies
                },
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            print(f"Prediction error: {e}")
            raise

# Initialize model
ml_model = EngagementMLModel()
