"""
🧠 Improved ML Model for Student State Classification
Multi-Class Classification: Relaxed, Engaged, Stressed, Bored
"""

import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
from datetime import datetime
from typing import Dict, List
import warnings
warnings.filterwarnings('ignore')


class StudentStateClassifier:
    """
    Multi-class classifier for student engagement states
    States: Relaxed, Engaged, Stressed, Bored
    """
    
    def __init__(self, model_dir='models'):
        self.model_dir = model_dir
        self.model = None
        self.scaler = None
        self.feature_names = [
            'heart_rate',
            'hrv_rmssd', 
            'blood_oxygen',
            'motion_level',
            'restlessness_index'
        ]
        self.states = ['Relaxed', 'Engaged', 'Stressed', 'Bored']
        
        if not os.path.exists(model_dir):
            os.makedirs(model_dir)
    
    def generate_realistic_training_data(self, n_samples=5000):
        """
        Generate physiologically realistic training data with improved separation
        Based on actual research patterns for each state
        """
        np.random.seed(42)
        
        samples_per_state = n_samples // 4
        
        data = []
        labels = []
        
        # ==================== RELAXED STATE ====================
        # Low HR, High HRV, Low motion, Very low restlessness
        # Clear separation: Focus on parasympathetic dominance
        for _ in range(samples_per_state):
            # Create more distinct patterns
            base_hr = np.random.normal(63, 4.5)  # Narrower, lower range
            base_hrv = np.random.normal(62, 7)    # Higher HRV
            
            data.append({
                'heart_rate': base_hr,
                'hrv_rmssd': base_hrv,
                'blood_oxygen': np.random.normal(98, 0.8),
                'motion_level': np.random.exponential(3) + 1,  # Skewed low
                'restlessness_index': np.random.exponential(0.03)  # Very low
            })
            labels.append('Relaxed')
        
        # ==================== ENGAGED STATE ====================
        # Normal HR, Moderate HRV, Controlled motion, Low restlessness
        # Key: Stable patterns, moderate arousal
        for _ in range(samples_per_state):
            base_hr = np.random.normal(76, 5)  # Slightly higher, tighter
            base_hrv = np.random.normal(43, 6)  # Moderate
            
            data.append({
                'heart_rate': base_hr,
                'hrv_rmssd': base_hrv,
                'blood_oxygen': np.random.normal(97, 0.9),
                'motion_level': np.random.normal(8, 3.5),  # Controlled movement
                'restlessness_index': np.random.gamma(2, 0.06)  # Low but variable
            })
            labels.append('Engaged')
        
        # ==================== STRESSED STATE ====================
        # High HR, Low HRV, Variable motion, High restlessness
        # Clear markers: Sympathetic dominance
        for _ in range(samples_per_state):
            base_hr = np.random.normal(102, 7)  # Higher
            base_hrv = np.random.normal(23, 5)  # Much lower HRV
            
            data.append({
                'heart_rate': base_hr,
                'hrv_rmssd': base_hrv,
                'blood_oxygen': np.random.normal(95.5, 1.5),  # Slightly lower
                'motion_level': np.random.normal(16, 6),
                'restlessness_index': np.random.gamma(3, 0.2) + 0.3  # High variability
            })
            labels.append('Stressed')
        
        # ==================== BORED STATE ====================
        # Low-normal HR, Moderate HRV, High motion (fidgeting), Moderate restlessness
        # Key distinction: High motion with normal physiology
        for _ in range(samples_per_state):
            base_hr = np.random.normal(69, 4.5)  # Lower than engaged
            base_hrv = np.random.normal(52, 7)    # Decent HRV
            
            data.append({
                'heart_rate': base_hr,
                'hrv_rmssd': base_hrv,
                'blood_oxygen': np.random.normal(97, 0.9),
                'motion_level': np.random.gamma(4, 8) + 15,  # High motion (fidgeting)
                'restlessness_index': np.random.gamma(3, 0.12) + 0.1  # Moderate-high
            })
            labels.append('Bored')
        
        df = pd.DataFrame(data)
        df['state'] = labels
        
        # Clip values to realistic ranges
        df['heart_rate'] = df['heart_rate'].clip(55, 140)
        df['hrv_rmssd'] = df['hrv_rmssd'].clip(10, 100)
        df['blood_oxygen'] = df['blood_oxygen'].clip(90, 100)
        df['motion_level'] = df['motion_level'].clip(0, 60)
        df['restlessness_index'] = df['restlessness_index'].clip(0, 3)
        
        return df
    
    def engineer_features(self, data: pd.DataFrame) -> pd.DataFrame:
        """
        Enhanced feature engineering with interaction features
        """
        features = data.copy()
        
        # Heart Rate features
        features['hr_deviation'] = features['heart_rate'] - 75  # Deviation from normal
        features['hr_zone'] = pd.cut(features['heart_rate'], 
                                      bins=[0, 70, 85, 100, 150], 
                                      labels=[0, 1, 2, 3])
        
        # HRV features (inverse relationship with stress)
        features['hrv_stress_indicator'] = 1 / (features['hrv_rmssd'] + 1)
        features['hrv_zone'] = pd.cut(features['hrv_rmssd'],
                                      bins=[0, 30, 50, 70, 150],
                                      labels=[3, 2, 1, 0])  # Lower HRV = higher stress
        
        # Motion patterns
        features['motion_category'] = pd.cut(features['motion_level'],
                                             bins=[0, 10, 20, 40, 100],
                                             labels=[0, 1, 2, 3])
        
        # Combined stress indicator (improved)
        features['stress_composite'] = (
            features['hr_deviation'] * 0.3 +
            features['hrv_stress_indicator'] * 30 +
            features['restlessness_index'] * 50
        )
        
        # Engagement indicator (improved thresholds)
        features['engagement_indicator'] = (
            (features['heart_rate'] > 70) & (features['heart_rate'] < 85) &
            (features['motion_level'] < 15) &
            (features['restlessness_index'] < 0.25)
        ).astype(int)
        
        # NEW: Interaction features for better discrimination
        features['hr_hrv_ratio'] = features['heart_rate'] / (features['hrv_rmssd'] + 1)
        features['motion_restlessness_product'] = features['motion_level'] * features['restlessness_index']
        features['arousal_index'] = features['heart_rate'] * (1 - features['blood_oxygen'] / 100)
        
        # NEW: Relaxation indicator
        features['relaxation_score'] = (
            (features['hrv_rmssd'] / 70) * 0.6 +
            (1 - features['heart_rate'] / 120) * 0.3 +
            (1 - features['motion_level'] / 50) * 0.1
        )
        
        # NEW: Boredom indicator (high motion, normal physiology)
        features['boredom_indicator'] = (
            (features['motion_level'] > 25) &
            (features['heart_rate'] < 80) &
            (features['hrv_rmssd'] > 40)
        ).astype(int)
        
        return features
    
    def train(self, use_feature_engineering=True):
        """
        Train the Random Forest classifier
        """
        print("\n" + "="*60)
        print("🧠 TRAINING STUDENT STATE CLASSIFIER")
        print("="*60)
        
        # Generate training data
        print("\n📊 Generating realistic training data...")
        df = self.generate_realistic_training_data(2000)
        print(f"✅ Generated {len(df)} samples across {len(df['state'].unique())} states")
        print(f"\nClass distribution:")
        print(df['state'].value_counts())
        
        # Feature engineering
        if use_feature_engineering:
            print("\n🔧 Engineering features...")
            df_engineered = self.engineer_features(df)
            feature_cols = [
                'heart_rate', 'hrv_rmssd', 'blood_oxygen', 
                'motion_level', 'restlessness_index',
                'hr_deviation', 'hrv_stress_indicator', 'stress_composite',
                'engagement_indicator', 'hr_hrv_ratio', 'motion_restlessness_product',
                'arousal_index', 'relaxation_score', 'boredom_indicator'
            ]
            # Convert categorical to numeric - handle NaN
            df_engineered['hr_zone'] = pd.to_numeric(df_engineered['hr_zone'], errors='coerce').fillna(1).astype(int)
            df_engineered['hrv_zone'] = pd.to_numeric(df_engineered['hrv_zone'], errors='coerce').fillna(1).astype(int)
            df_engineered['motion_category'] = pd.to_numeric(df_engineered['motion_category'], errors='coerce').fillna(1).astype(int)
            feature_cols.extend(['hr_zone', 'hrv_zone', 'motion_category'])
        else:
            df_engineered = df
            feature_cols = self.feature_names
        
        X = df_engineered[feature_cols].values
        y = df['state'].values
        
        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Scale features
        print("\n⚖️  Scaling features...")
        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train Random Forest with optimized hyperparameters
        print("\n🌲 Training Random Forest Classifier...")
        self.model = RandomForestClassifier(
            n_estimators=300,        # Increased from 200
            max_depth=18,            # Slightly deeper for complex patterns
            min_samples_split=8,     # Lower for better fitting
            min_samples_leaf=3,      # Lower for finer decision boundaries
            max_features='sqrt',     # Use sqrt of features
            random_state=42,
            class_weight='balanced',
            bootstrap=True,          # Bootstrap sampling
            oob_score=True,          # Out-of-bag score
            n_jobs=-1
        )
        
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate
        print("\n📈 Evaluating model...")
        y_pred = self.model.predict(X_test_scaled)
        accuracy = accuracy_score(y_test, y_pred)
        
        # Get OOB score
        oob_accuracy = self.model.oob_score_ if hasattr(self.model, 'oob_score_') else None
        
        print(f"\n{'='*60}")
        print(f"✅ MODEL TRAINING COMPLETED")
        print(f"{'='*60}")
        print(f"\n🎯 Test Accuracy: {accuracy:.2%}")
        if oob_accuracy:
            print(f"🎯 OOB Accuracy: {oob_accuracy:.2%}")
        
        print(f"\n📊 Classification Report:")
        print(classification_report(y_test, y_pred, target_names=self.states))
        
        print(f"\n🔍 Confusion Matrix:")
        cm = confusion_matrix(y_test, y_pred, labels=self.states)
        print(pd.DataFrame(cm, index=self.states, columns=self.states))
        
        # Feature importance
        if use_feature_engineering:
            print(f"\n🔑 Top Feature Importances:")
            importances = pd.DataFrame({
                'feature': feature_cols,
                'importance': self.model.feature_importances_
            }).sort_values('importance', ascending=False).head(10)
            print(importances.to_string(index=False))
        
        # Cross-validation
        print(f"\n🔄 Cross-validation (5-fold)...")
        cv_scores = cross_val_score(self.model, X_train_scaled, y_train, cv=5)
        print(f"CV Accuracy: {cv_scores.mean():.2%} (+/- {cv_scores.std() * 2:.2%})")
        
        # Save model
        print(f"\n💾 Saving model...")
        joblib.dump(self.model, os.path.join(self.model_dir, 'state_classifier.pkl'))
        joblib.dump(self.scaler, os.path.join(self.model_dir, 'state_scaler.pkl'))
        
        # Save feature configuration
        config = {
            'feature_cols': feature_cols,
            'use_feature_engineering': use_feature_engineering,
            'states': self.states,
            'accuracy': accuracy,
            'trained_at': datetime.now().isoformat()
        }
        import json
        with open(os.path.join(self.model_dir, 'model_config.json'), 'w') as f:
            json.dump(config, f, indent=2)
        
        print(f"✅ Model saved to {self.model_dir}/")
        print(f"\n{'='*60}\n")
        
        return accuracy
    
    def load_model(self):
        """Load trained model from disk"""
        try:
            self.model = joblib.load(os.path.join(self.model_dir, 'state_classifier.pkl'))
            self.scaler = joblib.load(os.path.join(self.model_dir, 'state_scaler.pkl'))
            
            # Load config
            import json
            with open(os.path.join(self.model_dir, 'model_config.json'), 'r') as f:
                config = json.load(f)
            
            print(f"✅ Model loaded successfully")
            print(f"   Accuracy: {config['accuracy']:.2%}")
            print(f"   Trained: {config['trained_at']}")
            return True
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            return False
    
    def predict_single(self, sensor_data: Dict) -> Dict:
        """
        Predict student state from single sensor reading
        
        Args:
            sensor_data: {
                'heart_rate': float,
                'hrv_rmssd': float,
                'blood_oxygen': float,
                'motion_level': float,
                'restlessness_index': float
            }
        
        Returns:
            {
                'state': str,
                'confidence': float,
                'probabilities': dict,
                'features_used': dict
            }
        """
        if self.model is None:
            raise ValueError("Model not trained or loaded")
        
        # Create DataFrame
        df = pd.DataFrame([sensor_data])
        
        # Load config to know if feature engineering was used
        import json
        with open(os.path.join(self.model_dir, 'model_config.json'), 'r') as f:
            config = json.load(f)
        
        if config['use_feature_engineering']:
            df = self.engineer_features(df)
            X = df[config['feature_cols']].values
        else:
            X = df[self.feature_names].values
        
        # Scale and predict
        X_scaled = self.scaler.transform(X)
        prediction = self.model.predict(X_scaled)[0]
        probabilities = self.model.predict_proba(X_scaled)[0]
        
        # Create probability dict
        prob_dict = {state: float(prob) for state, prob in zip(self.states, probabilities)}
        confidence = float(max(probabilities))
        
        return {
            'state': prediction,
            'confidence': confidence,
            'probabilities': prob_dict,
            'raw_features': sensor_data,
            'timestamp': datetime.now().isoformat()
        }
    
    def predict_batch(self, sensor_data_list: List[Dict]) -> List[Dict]:
        """Predict states for multiple sensor readings"""
        return [self.predict_single(data) for data in sensor_data_list]
    
    def analyze_session(self, sensor_data_list: List[Dict]) -> Dict:
        """
        Analyze entire session and provide summary
        
        Returns session-level analytics:
        - Percentage time in each state
        - Dominant state
        - State transitions
        - Recommendations
        """
        predictions = self.predict_batch(sensor_data_list)
        
        total = len(predictions)
        state_counts = {state: 0 for state in self.states}
        
        for pred in predictions:
            state_counts[pred['state']] += 1
        
        state_percentages = {
            state: (count / total * 100) for state, count in state_counts.items()
        }
        
        dominant_state = max(state_percentages, key=state_percentages.get)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(state_percentages, dominant_state)
        
        return {
            'total_samples': total,
            'state_percentages': state_percentages,
            'dominant_state': dominant_state,
            'state_counts': state_counts,
            'predictions': predictions,
            'recommendations': recommendations,
            'session_score': self._calculate_session_score(state_percentages)
        }
    
    def _calculate_session_score(self, state_percentages: Dict) -> int:
        """Calculate overall session engagement score (0-100)"""
        score = (
            state_percentages.get('Engaged', 0) * 1.0 +
            state_percentages.get('Relaxed', 0) * 0.7 +
            state_percentages.get('Bored', 0) * 0.3 +
            state_percentages.get('Stressed', 0) * 0.4
        )
        return int(score)
    
    def _generate_recommendations(self, state_percentages: Dict, dominant_state: str) -> List[str]:
        """Generate actionable recommendations based on session analysis"""
        recommendations = []
        
        if state_percentages.get('Stressed', 0) > 30:
            recommendations.append("⚠️ High stress detected - Consider break intervals")
            recommendations.append("💆 Implement relaxation techniques")
        
        if state_percentages.get('Bored', 0) > 40:
            recommendations.append("😴 High boredom detected - Activity may not match interest")
            recommendations.append("🎯 Consider more interactive or challenging content")
        
        if state_percentages.get('Engaged', 0) > 60:
            recommendations.append("✅ Excellent engagement! Current activity is effective")
        
        if state_percentages.get('Relaxed', 0) > 50:
            recommendations.append("😌 Student is comfortable but may need more challenge")
        
        if dominant_state == 'Stressed':
            recommendations.append("🔴 Dominant state: STRESSED - Immediate intervention recommended")
        elif dominant_state == 'Engaged':
            recommendations.append("🟢 Dominant state: ENGAGED - Optimal learning state")
        elif dominant_state == 'Bored':
            recommendations.append("🟡 Dominant state: BORED - Content adjustment needed")
        elif dominant_state == 'Relaxed':
            recommendations.append("🔵 Dominant state: RELAXED - Good baseline, room for engagement")
        
        return recommendations


if __name__ == "__main__":
    # Train the model
    classifier = StudentStateClassifier()
    accuracy = classifier.train(use_feature_engineering=True)
    
    # Test prediction
    print("\n" + "="*60)
    print("🧪 TESTING PREDICTION")
    print("="*60)
    
    test_cases = [
        {
            'name': 'Engaged Student',
            'data': {
                'heart_rate': 75,
                'hrv_rmssd': 45,
                'blood_oxygen': 97,
                'motion_level': 8,
                'restlessness_index': 0.12
            }
        },
        {
            'name': 'Stressed Student',
            'data': {
                'heart_rate': 105,
                'hrv_rmssd': 22,
                'blood_oxygen': 95,
                'motion_level': 15,
                'restlessness_index': 0.65
            }
        },
        {
            'name': 'Bored Student',
            'data': {
                'heart_rate': 68,
                'hrv_rmssd': 52,
                'blood_oxygen': 97,
                'motion_level': 38,
                'restlessness_index': 0.38
            }
        },
        {
            'name': 'Relaxed Student',
            'data': {
                'heart_rate': 62,
                'hrv_rmssd': 65,
                'blood_oxygen': 98,
                'motion_level': 3,
                'restlessness_index': 0.04
            }
        }
    ]
    
    for test in test_cases:
        print(f"\n📊 Test: {test['name']}")
        result = classifier.predict_single(test['data'])
        print(f"   Predicted State: {result['state']}")
        print(f"   Confidence: {result['confidence']:.1%}")
        print(f"   Probabilities:")
        for state, prob in result['probabilities'].items():
            print(f"      {state}: {prob:.1%}")
