"""
ML Model Training Script
Trains all models (Engagement, Stress, Hobby) and saves them
"""

from model import EngagementMLModel
import os

def main():
    print("\n" + "="*65)
    print("🤖 ML MODEL TRAINING SUITE")
    print("="*65 + "\n")
    
    # Initialize model
    model = EngagementMLModel(model_dir='models')
    
    print("📊 Starting training process...\n")
    
    try:
        # Train all three models
        print("[1/3] Training Engagement Model...")
        engagement_acc = model.train_engagement_model()
        print(f"      ✅ Accuracy: {engagement_acc:.4f}\n")
        
        print("[2/3] Training Stress Detection Model...")
        stress_acc = model.train_stress_model()
        print(f"      ✅ Accuracy: {stress_acc:.4f}\n")
        
        print("[3/3] Training Hobby Prediction Model...")
        hobby_acc = model.train_hobby_model()
        print(f"      ✅ Accuracy: {hobby_acc:.4f}\n")
        
        print("="*65)
        print("✅ ALL MODELS TRAINED SUCCESSFULLY!")
        print("="*65)
        
        print("\n📁 Model files saved in 'models/' directory:")
        if os.path.exists('models'):
            for file in os.listdir('models'):
                print(f"   ✓ {file}")
        
        print("\n" + "="*65)
        print("📋 SUMMARY")
        print("="*65)
        print(f"Engagement Model Accuracy: {engagement_acc:.4f}")
        print(f"Stress Model Accuracy:     {stress_acc:.4f}")
        print(f"Hobby Model Accuracy:      {hobby_acc:.4f}")
        print(f"Average Accuracy:          {(engagement_acc + stress_acc + hobby_acc)/3:.4f}")
        
        print("\n🚀 Models are ready for predictions!")
        print("   Start ML API: python -m uvicorn main:app --host 0.0.0.0 --port 8000\n")
        
        return 0
        
    except Exception as e:
        print(f"\n❌ Training failed with error: {str(e)}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    exit(main())
