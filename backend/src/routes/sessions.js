const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const SensorData = require('../models/SensorData');
const auth = require('../middleware/auth');

// POST - Start new session
router.post('/start', auth, async (req, res) => {
  try {
    const { deviceId, activity, sessionType, sessionName } = req.body;

    // Validate activity is provided
    if (!activity) {
      return res.status(400).json({ success: false, message: 'Activity is required' });
    }

    const session = new Session({
      userId: req.userId,
      deviceId: deviceId || null,
      activity,
      sessionType: sessionType || 'classroom',
      sessionName: sessionName || activity,
      startTime: new Date(),
      isActive: true,
      status: 'ongoing'
    });

    await session.save();

    res.status(201).json({
      success: true,
      message: 'Session started',
      session
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - End session (must come before /:sessionId route)
router.post('/end/:sessionId', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session || session.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Calculate metrics
    const stats = await SensorData.aggregate([
      { $match: { sessionId: session._id } },
      {
        $group: {
          _id: null,
          avgHeartRate: { $avg: '$heartRate.value' },
          maxHeartRate: { $max: '$heartRate.value' },
          minHeartRate: { $min: '$heartRate.value' },
          avgHRV: { $avg: '$hrv.rmssd' },
          avgEngagementScore: { $avg: '$processedFeatures.engagementScore' },
          avgStressLevel: { $avg: '$processedFeatures.stressIndicator' },
          totalDataPoints: { $sum: 1 }
        }
      }
    ]);

    session.endTime = new Date();
    session.isActive = false;
    session.status = 'completed';
    if (stats[0]) {
      session.metrics = stats[0];
    }

    await session.save();

    res.json({
      success: true,
      message: 'Session ended',
      session
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Active session
router.get('/active', auth, async (req, res) => {
  try {
    const session = await Session.findOne({
      userId: req.userId,
      isActive: true
    });

    res.json({
      success: true,
      session: session || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Session history
router.get('/', auth, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.userId })
      .sort({ startTime: -1 })
      .limit(50);

    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Session details (generic ID matcher - must be last)
router.get('/:sessionId', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session || session.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Arduino session info (No auth required - uses API key)
// Used by Arduino IDE to get session details
// Query: /arduino-session/:sessionId?apiKey=device_secret_key_for_esp32
router.get('/arduino-session/:sessionId', async (req, res) => {
  try {
    const { apiKey } = req.query;
    
    // Validate device API key
    if (apiKey !== process.env.DEVICE_API_KEY) {
      return res.status(401).json({ success: false, message: 'Invalid device API key' });
    }
    
    const session = await Session.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Return only necessary info for Arduino
    res.json({
      success: true,
      sessionId: session._id,
      userId: session.userId,
      isActive: session.isActive,
      status: session.status,
      activity: session.activity,
      deviceId: session.deviceId,
      startTime: session.startTime,
      message: 'Session info retrieved'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Get current/active session for user (Frontend use)
// Complete data flow - STEP 1
router.get('/current', auth, async (req, res) => {
  try {
    const session = await Session.findOne({
      userId: req.userId,
      isActive: true,
      status: 'ongoing'
    }).sort({ startTime: -1 });

    if (!session) {
      return res.status(404).json({
        success: true,
        session: null,
        message: 'No active session'
      });
    }

    res.json({
      success: true,
      session: {
        sessionId: session._id,
        userId: session.userId,
        activity: session.activity,
        sessionType: session.sessionType,
        isActive: session.isActive,
        status: session.status,
        startTime: session.startTime,
        deviceId: session.deviceId
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
