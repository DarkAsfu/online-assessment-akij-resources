const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Please add question text'],
  },
  questionType: {
    type: String,
    enum: ['checkbox', 'radio', 'text'],
    required: true,
  },
  options: {
    type: [String],
    required: function () {
      return this.questionType !== 'text';
    },
  },
  correctAnswers: {
    type: [String],
    required: function () {
      return this.questionType !== 'text';
    },
  },
  textAnswer: {
    type: String,
    required: function () {
      return this.questionType === 'text';
    },
  },
  points: {
    type: Number,
    default: 1,
    min: 0,
  },
});

const questionSetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add question set title'],
      trim: true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questions: [questionSchema],
    totalQuestions: {
      type: Number,
      default: 0,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

questionSetSchema.pre('save', async function () {
  this.totalQuestions = this.questions.length;
  this.totalPoints = this.questions.reduce((sum, q) => sum + q.points, 0);
});

const QuestionSet = mongoose.model('QuestionSet', questionSetSchema);

module.exports = QuestionSet;