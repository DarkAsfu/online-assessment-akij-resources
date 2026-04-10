const ExamAttempt = require('../models/ExamAttempt');
const CandidateExam = require('../models/CandidateExam');
const Exam = require('../models/Exam');
const QuestionSet = require('../models/QuestionSet');

// @desc    Start exam
// @route   POST /api/candidate-exams/:id/start
// @access  Private (Candidate only)
exports.startExam = async (req, res, next) => {
  try {
    const candidateExam = await CandidateExam.findById(req.params.id)
      .populate('exam');
    
    if (!candidateExam) {
      return res.status(404).json({
        success: false,
        message: 'Exam assignment not found',
      });
    }
    
    // Check if candidate is authorized
    if (candidateExam.candidate.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }
    
    // Check if exam can be started
    const now = new Date();
    const examStartTime = new Date(candidateExam.exam.startTime);
    const examEndTime = new Date(candidateExam.exam.endTime);
    
    if (now < examStartTime) {
      return res.status(400).json({
        success: false,
        message: 'Exam has not started yet',
      });
    }
    
    if (now > examEndTime) {
      return res.status(400).json({
        success: false,
        message: 'Exam has already ended',
      });
    }
    
    if (candidateExam.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Exam already completed',
      });
    }
    
    // Check for existing attempt
    let attempt = await ExamAttempt.findOne({
      candidate: req.user.id,
      candidateExam: candidateExam._id,
      status: 'in-progress',
    });
    
    if (!attempt) {
      // Get all questions
      const questionSets = await QuestionSet.find({
        _id: { $in: candidateExam.exam.questionSets },
      });
      
      const allQuestions = questionSets.flatMap(qs => qs.questions);
      let totalPossibleScore = 0;
      
      const answers = allQuestions.map(question => ({
        questionId: question._id,
        questionText: question.questionText,
        questionType: question.questionType,
        userAnswer: null,
        isCorrect: false,
        pointsEarned: 0,
        pointsPossible: question.points,
      }));
      
      totalPossibleScore = allQuestions.reduce((sum, q) => sum + q.points, 0);
      
      // Create new attempt
      attempt = await ExamAttempt.create({
        candidate: req.user.id,
        exam: candidateExam.exam._id,
        candidateExam: candidateExam._id,
        answers,
        startTime: now,
        totalPossibleScore,
      });
    }
    
    // Update candidate exam status
    candidateExam.status = 'in-progress';
    candidateExam.startedAt = now;
    await candidateExam.save();
    
    // Get questions for response
    const questionSets = await QuestionSet.find({
      _id: { $in: candidateExam.exam.questionSets },
    });
    
    res.status(200).json({
      success: true,
      data: {
        attemptId: attempt._id,
        exam: candidateExam.exam,
        questions: questionSets,
        timeRemaining: calculateTimeRemaining(attempt.startTime, candidateExam.exam.duration),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit answer
// @route   POST /api/candidate-exams/attempt/:attemptId/answer
// @access  Private (Candidate only)
exports.submitAnswer = async (req, res, next) => {
  try {
    const { questionId, answer } = req.body;
    const attempt = await ExamAttempt.findById(req.params.attemptId)
      .populate('exam');
    
    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Attempt not found',
      });
    }
    
    if (attempt.candidate.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }
    
    if (attempt.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Exam already submitted',
      });
    }
    
    // Find question in attempt
    const questionIndex = attempt.answers.findIndex(
      a => a.questionId.toString() === questionId
    );
    
    if (questionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }
    
    // Get original question from exam
    const questionSets = await QuestionSet.find({
      _id: { $in: attempt.exam.questionSets },
    });
    
    let originalQuestion = null;
    for (const qs of questionSets) {
      originalQuestion = qs.questions.find(q => q._id.toString() === questionId);
      if (originalQuestion) break;
    }
    
    if (!originalQuestion) {
      return res.status(404).json({
        success: false,
        message: 'Question not found in exam',
      });
    }
    
    // Check if answer is correct
    let isCorrect = false;
    if (originalQuestion.questionType === 'text') {
      // For text questions, compare case-insensitive trimmed strings
      isCorrect = originalQuestion.textAnswer?.toLowerCase().trim() === 
                  answer?.toLowerCase().trim();
    } else {
      // For checkbox/radio, compare arrays
      isCorrect = arraysEqual(originalQuestion.correctAnswers, answer);
    }
    
    const pointsEarned = isCorrect ? originalQuestion.points : 
                        (attempt.exam.negativeMarking ? -attempt.exam.negativeMarkingValue : 0);
    
    // Update answer
    attempt.answers[questionIndex].userAnswer = answer;
    attempt.answers[questionIndex].isCorrect = isCorrect;
    attempt.answers[questionIndex].pointsEarned = pointsEarned;
    
    // Recalculate total score
    attempt.totalScore = attempt.answers.reduce((sum, a) => sum + a.pointsEarned, 0);
    attempt.percentageScore = (attempt.totalScore / attempt.totalPossibleScore) * 100;
    
    await attempt.save();
    
    res.status(200).json({
      success: true,
      data: {
        isCorrect,
        pointsEarned,
        totalScore: attempt.totalScore,
        totalPossibleScore: attempt.totalPossibleScore,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit exam
// @route   POST /api/candidate-exams/attempt/:attemptId/submit
// @access  Private (Candidate only)
exports.submitExam = async (req, res, next) => {
  try {
    const attempt = await ExamAttempt.findById(req.params.attemptId);
    
    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Attempt not found',
      });
    }
    
    if (attempt.candidate.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }
    
    if (attempt.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Exam already submitted',
      });
    }
    
    attempt.endTime = new Date();
    attempt.timeSpent = Math.floor((attempt.endTime - attempt.startTime) / 1000);
    attempt.status = 'submitted';
    await attempt.save();
    
    // Update candidate exam
    const candidateExam = await CandidateExam.findById(attempt.candidateExam);
    candidateExam.status = 'completed';
    candidateExam.completedAt = new Date();
    candidateExam.score = attempt.totalScore;
    candidateExam.percentage = attempt.percentageScore;
    await candidateExam.save();
    
    res.status(200).json({
      success: true,
      data: {
        totalScore: attempt.totalScore,
        totalPossibleScore: attempt.totalPossibleScore,
        percentageScore: attempt.percentageScore,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track behavioral event
// @route   POST /api/candidate-exams/attempt/:attemptId/behavior
// @access  Private (Candidate only)
exports.trackBehavior = async (req, res, next) => {
  try {
    const { eventType, details } = req.body;
    const attempt = await ExamAttempt.findById(req.params.attemptId);
    
    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Attempt not found',
      });
    }
    
    if (attempt.candidate.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }
    
    // Add behavioral event
    attempt.behavioralEvents.push({
      eventType,
      details,
      timestamp: new Date(),
    });
    
    // Update counters
    if (eventType === 'tab-switch') {
      attempt.tabSwitchCount += 1;
    } else if (eventType === 'fullscreen-exit') {
      attempt.fullscreenExitCount += 1;
    }
    
    await attempt.save();
    
    res.status(200).json({
      success: true,
      data: {
        tabSwitchCount: attempt.tabSwitchCount,
        fullscreenExitCount: attempt.fullscreenExitCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper functions
function calculateTimeRemaining(startTime, durationMinutes) {
  const elapsed = (new Date() - new Date(startTime)) / 1000 / 60;
  const remaining = Math.max(0, durationMinutes - elapsed);
  return {
    minutes: Math.floor(remaining),
    seconds: Math.floor((remaining % 1) * 60),
    totalSeconds: Math.floor(remaining * 60),
  };
}

function arraysEqual(a, b) {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  return JSON.stringify(a.sort()) === JSON.stringify(b.sort());
}