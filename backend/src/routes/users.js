const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET - Current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, user: user.getPublicProfile() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, phone, dateOfBirth, school, grade } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
        phone,
        dateOfBirth,
        school,
        grade,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.json({ success: true, user: user.getPublicProfile() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - Link student (for parents)
router.post('/link-student', auth, async (req, res) => {
  try {
    const { studentId } = req.body;

    const parent = await User.findById(req.userId);
    const student = await User.findById(studentId);

    if (!parent || !student) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!parent.linkedStudents.includes(studentId)) {
      parent.linkedStudents.push(studentId);
      await parent.save();
    }

    if (!student.linkedParents.includes(req.userId)) {
      student.linkedParents.push(req.userId);
      await student.save();
    }

    res.json({ success: true, message: 'Student linked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Linked students
router.get('/students', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('linkedStudents', '-password');
    res.json({ success: true, students: user?.linkedStudents || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
