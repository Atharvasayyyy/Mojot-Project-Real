const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  // Entity References
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    index: true
  },

  // Input Features
  inputFeatures: {
    heartRate: Number,
    hrv_rmssd: Number,
    bloodOxygen: Number,
    motionLevel: Number,
    restlessnessIndex: Number,
    sessionDuration: Number,
    timeOfDay: String,
    dayOfWeek: String
  },

  // Predictions
  predictions: {
    engagementLevel: {
      category: String, // very-low, low, medium, high, very-high
      confidence: Number,
      score: Number
    },
    stressLevel: {
      category: String, // relaxed, calm, normal, stressed, very-stressed
      confidence: Number,
      score: Number
    },
    predictedHobby: {
      hobby: String,
      confidence: Number,
      top5Hobbies: [{
        hobby: String,
        confidence: Number
      }]
    },
    activityType: {
      activity: String,
      confidence: Number
    },
    emotionalState: {
      state: String,
      confidence: Number
    }
  },

  // Model Metadata
  modelVersion: {
    type: String,
    default: '1.0.0'
  },
  modelUsed: {
    type: String,
    enum: ['random-forest', 'xgboost', 'svm', 'neural-network', 'ensemble'],
    default: 'random-forest'
  },
  processingTime: Number, // in ms

  // Validation
  isAccurate: Boolean,
  userFeedback: {
    correct: Boolean,
    actualValue: String,
    notes: String,
    feedbackAt: Date
  },

  // Feature Importance
  featureImportance: {
    heartRate: Number,
    hrv: Number,
    motionLevel: Number,
    restlessness: Number,
    timeContext: Number
  },

  // Model Explanation
  explanation: {
    summary: String,
    details: [String],
    topFeatures: [String]
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, { timestamps: true });

// Compound indices
PredictionSchema.index({ userId: 1, createdAt: -1 });
PredictionSchema.index({ sessionId: 1 });

module.exports = mongoose.model('Prediction', PredictionSchema);
