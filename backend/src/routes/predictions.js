const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Session = require('../models/Session');
const Prediction = require('../models/Prediction');
const auth = require('../middleware/auth');

// ========== SPECIFIC ROUTES (MUST COME FIRST) ==========

// GET - Hobby insights
router.get('/hobbies/insights', auth, async (req, res) => {
  try {
    const hobbyInsights = await Prediction.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(req.userId)
        }
      },
      {
        $group: {
          _id: '$predictions.predictedHobby.hobby',
          count: { $sum: 1 },
          avgConfidence: { $avg: '$predictions.predictedHobby.confidence' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({ success: true, hobbies: hobbyInsights });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Latest predictions
router.get('/latest', auth, async (req, res) => {
  try {
    const predictions = await Prediction.find({
      userId: req.userId
    }).sort({ createdAt: -1 }).limit(10);

    res.json({ success: true, predictions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Get predictions for session
router.get('/session/:sessionId', auth, async (req, res) => {
  try {
    // Validate and convert sessionId to ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.sessionId)) {
      return res.status(400).json({ success: false, message: 'Invalid sessionId format' });
    }

    const sessionId = mongoose.Types.ObjectId(req.params.sessionId);
    const session = await Session.findById(sessionId);
    
    if (!session || session.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const predictions = await Prediction.find({
      sessionId: sessionId
    }).sort({ createdAt: -1 });

    res.json({ success: true, predictions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== GENERIC ROUTES (MUST COME LAST) ==========

// POST - Feedback on prediction
router.post('/:predictionId/feedback', auth, async (req, res) => {
  try {
    // Validate and convert predictionId to ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.predictionId)) {
      return res.status(400).json({ success: false, message: 'Invalid predictionId format' });
    }

    const predictionId = mongoose.Types.ObjectId(req.params.predictionId);
    const { isCorrect, actualValue, notes } = req.body;

    const prediction = await Prediction.findById(predictionId);
    if (!prediction || prediction.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    prediction.userFeedback = {
      correct: isCorrect,
      actualValue,
      notes,
      feedbackAt: new Date()
    };

    await prediction.save();

    res.json({
      success: true,
      message: 'Feedback recorded',
      prediction
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
