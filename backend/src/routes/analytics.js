const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const SensorData = require('../models/SensorData');
const auth = require('../middleware/auth');

// GET - Weekly analytics
router.get('/weekly', auth, async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const analytics = await Session.aggregate([
      {
        $match: {
          userId: require('mongoose').Types.ObjectId(req.userId),
          startTime: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfWeek: '$startTime' },
            activity: '$activity'
          },
          totalDuration: { $sum: '$duration' },
          avgEngagement: { $avg: '$metrics.avgEngagementScore' },
          avgStress: { $avg: '$metrics.avgStressLevel' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.day': 1 } }
    ]);

    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Activity breakdown
router.get('/activities', auth, async (req, res) => {
  try {
    const activities = await Session.aggregate([
      {
        $match: {
          userId: require('mongoose').Types.ObjectId(req.userId)
        }
      },
      {
        $group: {
          _id: '$activity',
          count: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          avgEngagement: { $avg: '$metrics.avgEngagementScore' },
          avgStress: { $avg: '$metrics.avgStressLevel' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({ success: true, activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Session specific analytics (STEP 6 data flow)
// Frontend fetches analytics for a specific session
router.get('/session/:sessionId', auth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Get session details
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Verify user owns session
    if (session.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Get sensor data for this session
    const sensorData = await SensorData.aggregate([
      {
        $match: {
          sessionId: require('mongoose').Types.ObjectId(sessionId)
        }
      },
      {
        $group: {
          _id: null,
          avgHeartRate: { $avg: '$heartRate.value' },
          maxHeartRate: { $max: '$heartRate.value' },
          minHeartRate: { $min: '$heartRate.value' },
          avgMotion: { $avg: '$motionLevel' },
          avgEngagement: { $avg: '$processedFeatures.engagement' },
          avgStress: { $avg: '$processedFeatures.stress' },
          totalDataPoints: { $sum: 1 }
        }
      }
    ]);

    const data = sensorData[0] || {
      avgHeartRate: 0,
      avgEngagement: 0,
      avgStress: 0,
      totalDataPoints: 0
    };

    // Calculate engagement state
    const engagementScore = Math.round((data.avgEngagement || 0) * 100);
    const stressScore = Math.round((data.avgStress || 0) * 100);
    
    let state = 'Normal';
    if (engagementScore > 70) state = 'Engaged';
    if (engagementScore < 30) state = 'Bored';
    if (stressScore > 60) state = 'Stressed';

    res.json({
      success: true,
      data: {
        sessionId: session._id,
        activity: session.activity,
        duration: Math.round((new Date() - session.startTime) / 1000 / 60), // minutes
        engagementScore,
        stressScore,
        state,
        ...data
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
