const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const auth = require('../middleware/auth');

// GET - User alerts
router.get('/', auth, async (req, res) => {
  try {
    const alerts = await Alert.find({
      userId: req.userId
    }).sort({ createdAt: -1 }).limit(50);

    res.json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Unread alerts count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Alert.countDocuments({
      userId: req.userId,
      isRead: false
    });

    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Mark alert as read
router.put('/:alertId/read', auth, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.alertId);
    if (!alert || alert.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    alert.isRead = true;
    alert.readAt = new Date();
    await alert.save();

    res.json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Resolve alert
router.put('/:alertId/resolve', auth, async (req, res) => {
  try {
    const { resolveNotes } = req.body;
    const alert = await Alert.findById(req.params.alertId);
    if (!alert || alert.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    alert.isResolved = true;
    alert.resolvedAt = new Date();
    alert.resolveNotes = resolveNotes;
    await alert.save();

    res.json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
