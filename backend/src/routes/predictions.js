const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const Prediction = require('../models/Prediction');
const auth = require('../middleware/auth');

// GET - Get predictions for session
router.get('/session/:sessionId', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session || session.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const predictions = await Prediction.find({
      sessionId: req.params.sessionId
    }).sort({ createdAt: -1 });

    res.json({ success: true, predictions });
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

// POST - Feedback on prediction
router.post('/:predictionId/feedback', auth, async (req, res) => {
  try {
    const { isCorrect, actualValue, notes } = req.body;

    const prediction = await Prediction.findById(req.params.predictionId);
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

// GET - Hobby insights
router.get('/hobbies/insights', auth, async (req, res) => {
  try {
    const hobbyInsights = await Prediction.aggregate([
      {
        $match: {
          userId: require('mongoose').Types.ObjectId(req.userId)
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

module.exports = router;
