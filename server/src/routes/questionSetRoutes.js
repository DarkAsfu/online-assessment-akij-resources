const express = require('express');
const {
  createQuestionSet,
  getQuestionSets,
  getQuestionSet,
  updateQuestionSet,
  deleteQuestionSet,
} = require('../controllers/questionSetController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('employer'));

router.post('/', createQuestionSet);
router.get('/', getQuestionSets);
router.get('/:id', getQuestionSet);
router.put('/:id', updateQuestionSet);
router.delete('/:id', deleteQuestionSet);

module.exports = router;