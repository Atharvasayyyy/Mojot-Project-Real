const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'Please provide a first name'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Please provide a last name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    trim: true
  },

  // User Type
  userType: {
    type: String,
    enum: ['student', 'parent', 'teacher', 'admin'],
    default: 'student',
    required: true
  },

  // Profile Information
  dateOfBirth: Date,
  grade: String,
  school: String,
  
  // Relationships
  linkedStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  linkedParents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  linkedTeachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Device Information
  devices: [{
    deviceId: String,
    deviceName: String,
    macAddress: String,
    addedAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],

  // Preferences
  preferences: {
    notificationsEnabled: {
      type: Boolean,
      default: true
    },
    dataRetentionDays: {
      type: Number,
      default: 90
    },
    privacyLevel: {
      type: String,
      enum: ['public', 'private', 'restricted'],
      default: 'private'
    }
  },

  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpire: Date,

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
}, { timestamps: true });

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get public profile
UserSchema.methods.getPublicProfile = function() {
  const user = this.toObject();
  delete user.password;
  delete user.verificationToken;
  return user;
};

module.exports = mongoose.model('User', UserSchema);
