const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  // Recipients
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Alert Information
  alertType: {
    type: String,
    enum: ['high-stress', 'low-engagement', 'unusual-pattern', 'critical-health', 'achievement', 'reminder', 'recommendation'],
    required: true
  },

  severity: {
    type: String,
    enum: ['info', 'warning', 'critical'],
    default: 'info'
  },

  title: {
    type: String,
    required: true
  },

  message: {
    type: String,
    required: true
  },

  details: mongoose.Schema.Types.Mixed,

  // Related Data
  relatedSessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },

  // Status
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,

  isResolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: Date,

  // Action
  actionUrl: String,
  actionLabel: String,
  resolveNotes: String,

  // Notification
  notificationSent: {
    type: Boolean,
    default: false
  },
  notificationChannel: {
    type: [String],
    enum: ['email', 'push', 'sms', 'in-app'],
    default: ['in-app']
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000) // 30 days
  }
}, { timestamps: true });

// TTL Index - Auto delete after 90 days
AlertSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound indices
AlertSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Alert', AlertSchema);
