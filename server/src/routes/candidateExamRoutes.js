const express = require('express');
const {
  startExam,
  submitAnswer,
  submitExam,
  trackBehavior,
  getAttempt,
} = require('../controllers/candidateExamController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes and ensure only candidates
router.use(protect);
router.use(authorize('candidate'));

router.post('/:id/start', startExam);
router.post('/attempt/:attemptId/answer', submitAnswer);
router.post('/attempt/:attemptId/submit', submitExam);
router.post('/attempt/:attemptId/behavior', trackBehavior);
router.get('/attempt/:attemptId', getAttempt);

module.exports = router;