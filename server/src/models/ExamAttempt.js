const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  questionText: String,
  questionType: String,
  userAnswer: mongoose.Schema.Types.Mixed,
  isCorrect: Boolean,
  pointsEarned: Number,
  pointsPossible: Number,
});

const behavioralEventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    enum: ['tab-switch', 'fullscreen-exit', 'page-blur', 'copy-attempt'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  details: mongoose.Schema.Types.Mixed,
});

const examAttemptSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
    },
    candidateExam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CandidateExam',
      required: true,
    },
    answers: [answerSchema],
    behavioralEvents: [behavioralEventSchema],
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    timeSpent: {
      type: Number, 
      default: 0,
    },
    status: {
      type: String,
      enum: ['in-progress', 'submitted', 'auto-submitted', 'expired'],
      default: 'in-progress',
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    totalPossibleScore: {
      type: Number,
      default: 0,
    },
    percentageScore: {
      type: Number,
      default: 0,
    },
    isAutoSubmitted: {
      type: Boolean,
      default: false,
    },
    tabSwitchCount: {
      type: Number,
      default: 0,
    },
    fullscreenExitCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const ExamAttempt = mongoose.model('ExamAttempt', examAttemptSchema);

module.exports = ExamAttempt;