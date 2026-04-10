const express = require('express');
const {
  createExam,
  getEmployerExams,
  getExam,
  updateExam,
  deleteExam,
  getExamCandidates,
  getAllCandidateExams,
  publishExam
} = require('../controllers/examController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', authorize('employer'), createExam);
router.get('/employer/my-exams', authorize('employer'), getEmployerExams);
router.get('/:examId/candidates', authorize('employer'), getExamCandidates);
router.put('/:examId', authorize('employer'), updateExam);
router.delete('/:examId', authorize('employer'), deleteExam);
router.put('/:examId/publish', authorize('employer'), publishExam);
router.get('/candidate/all-exams', authorize('candidate'), getAllCandidateExams);
router.get('/:id', getExam);

module.exports = router;