const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  // Entity References
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  deviceId: {
    type: String,
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Session Metadata
  sessionName: String,
  description: String,
  
  sessionType: {
    type: String,
    enum: ['classroom', 'homework', 'exercise', 'recreation', 'sleep', 'other'],
    default: 'classroom'
  },

  activity: {
    type: String,
    enum: ['reading', 'coding', 'math', 'sports', 'art', 'music', 'social', 'gaming', 'other'],
    required: true
  },

  duration: Number, // in seconds
  startTime: {
    type: Date,
    required: true,
    index: true
  },
  endTime: Date,

  isActive: {
    type: Boolean,
    default: true
  },

  // Session Metrics
  metrics: {
    totalDataPoints: {
      type: Number,
      default: 0
    },
    avgHeartRate: Number,
    avgHRV: Number,
    maxHeartRate: Number,
    minHeartRate: Number,
    avgEngagementScore: Number,
    avgStressLevel: Number,
    timeEngaged: Number, // in seconds
    timeUnengaged: Number
  },

  // Predictions
  predictions: {
    engagementLevel: {
      type: String,
      enum: ['very-low', 'low', 'medium', 'high', 'very-high'],
      default: 'medium'
    },
    stressLevel: {
      type: String,
      enum: ['relaxed', 'calm', 'normal', 'stressed', 'very-stressed'],
      default: 'normal'
    },
    predictedInterest: String,
    predictedHobby: String,
    prediction_confidence: Number,
    predictedAt: Date
  },

  // Mood & Feedback
  studentMood: {
    type: String,
    enum: ['very-happy', 'happy', 'neutral', 'sad', 'very-sad']
  },
  studentFeedback: String,
  teacherNotes: String,
  parentNotes: String,

  // Context
  environmentFactors: {
    noiseLevel: String,
    lightingCondition: String,
    temperature: Number,
    humidity: Number
  },

  // Tags for categorization
  tags: [String],

  // Recommendations
  recommendations: [{
    title: String,
    description: String,
    priority: String, // high, medium, low
    category: String
  }],

  // Status
  status: {
    type: String,
    enum: ['pending', 'ongoing', 'completed', 'paused', 'cancelled'],
    default: 'pending'
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Auto-calculate duration on save
SessionSchema.pre('save', function(next) {
  if (this.startTime && this.endTime) {
    this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  }
  next();
});

// Method to end session
SessionSchema.methods.endSession = function() {
  this.endTime = new Date();
  this.isActive = false;
  this.status = 'completed';
  return this.save();
};

// Method to get session summary
SessionSchema.methods.getSummary = function() {
  return {
    id: this._id,
    activity: this.activity,
    duration: this.duration,
    startTime: this.startTime,
    endTime: this.endTime,
    metrics: this.metrics,
    predictions: this.predictions,
    status: this.status
  };
};

module.exports = mongoose.model('Session', SessionSchema);
