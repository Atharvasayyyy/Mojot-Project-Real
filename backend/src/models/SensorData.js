const mongoose = require('mongoose');

const SensorDataSchema = new mongoose.Schema({
  // Entity References
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  deviceId: {
    type: String,
    required: true,
    index: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    index: true
  },

  // Timestamp
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  recordedAt: Date,

  // Physiological Data
  heartRate: {
    value: Number,
    unit: String, // bpm
    confidence: Number
  },
  hrv: {
    rmssd: Number, // Root Mean Square of Successive Differences
    sdnn: Number,  // Standard Deviation of NN intervals
    pnn50: Number  // Percentage of successive RR intervals > 50ms
  },
  bloodOxygen: {
    value: Number,
    unit: String, // %
    confidence: Number
  },
  skinTemperature: {
    value: Number,
    unit: String, // Celsius
    confidence: Number
  },

  // Motion Data
  acceleration: {
    x: Number,
    y: Number,
    z: Number
  },
  gyroscope: {
    x: Number,
    y: Number,
    z: Number
  },
  motionLevel: Number, // 0-100
  restlessnessIndex: Number, // 0-100

  // Processed Features
  processedFeatures: {
    energyLevel: Number,
    stressIndicator: Number,
    engagementScore: Number,
    activityType: String
  },

  // Raw Data (for debugging)
  rawData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // Data Quality
  dataQuality: {
    signalStrength: Number, // 0-100
    dataComplete: Boolean,
    anomalyDetected: Boolean
  },

  // Server Processing
  processed: {
    type: Boolean,
    default: false
  },
  processedAt: Date,

  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, { timestamps: true });

// Create compound indices for common queries
SensorDataSchema.index({ userId: 1, timestamp: -1 });
SensorDataSchema.index({ deviceId: 1, timestamp: -1 });
SensorDataSchema.index({ sessionId: 1, timestamp: -1 });
SensorDataSchema.index({ 'processedFeatures.engagementScore': 1 });

// TTL Index - Auto delete after 90 days (optional)
SensorDataSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

// Aggregation pipeline for statistics
SensorDataSchema.statics.getSessionStats = async function(sessionId) {
  return this.aggregate([
    { $match: { sessionId: mongoose.Types.ObjectId(sessionId) } },
    {
      $group: {
        _id: null,
        avgHeartRate: { $avg: '$heartRate.value' },
        maxHeartRate: { $max: '$heartRate.value' },
        minHeartRate: { $min: '$heartRate.value' },
        avgHRV: { $avg: '$hrv.rmssd' },
        avgMotionLevel: { $avg: '$motionLevel' },
        avgEngagementScore: { $avg: '$processedFeatures.engagementScore' },
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('SensorData', SensorDataSchema);
