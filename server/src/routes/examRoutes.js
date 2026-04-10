const express = require('express');
const {
  createExam,
  getEmployerExams,
  getExam,
  updateExam,
  deleteExam,
  getExamCandidates,
  getAllCandidateExams,
} = require('../controllers/examController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(protect);

// Employer routes
router.post('/', authorize('employer'), createExam);
router.get('/employer/my-exams', authorize('employer'), getEmployerExams);
router.get('/:id/candidates', authorize('employer'), getExamCandidates);
router.put('/:id', authorize('employer'), updateExam);
router.delete('/:id', authorize('employer'), deleteExam);

// Candidate routes
router.get('/candidate/all-exams', authorize('candidate'), getAllCandidateExams);

// Shared routes
router.get('/:id', getExam);

module.exports = router;