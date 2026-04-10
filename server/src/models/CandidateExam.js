const mongoose = require('mongoose');

const candidateExamSchema = new mongoose.Schema(
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
    assignedDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['assigned', 'in-progress', 'completed', 'expired'],
      default: 'assigned',
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    score: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const CandidateExam = mongoose.model('CandidateExam', candidateExamSchema);

module.exports = CandidateExam; 