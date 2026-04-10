const Exam = require('../models/Exam');
const QuestionSet = require('../models/QuestionSet');
const ExamAttempt = require('../models/ExamAttempt');
const User = require('../models/User');

exports.createExam = async (req, res, next) => {
  try {
    req.body.employer = req.user.id;
    const exam = await Exam.create(req.body);
    
    res.status(201).json({
      success: true,
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

exports.getEmployerExams = async (req, res, next) => {
  try {
    const exams = await Exam.find({ employer: req.user.id })
      .populate('questionSets')
      .sort('-createdAt');
    
    const examsWithCounts = await Promise.all(
      exams.map(async (exam) => {
        const currentCandidates = await ExamAttempt.countDocuments({ 
          exam: exam._id,
          status: { $in: ['in-progress', 'submitted', 'auto-submitted'] }
        });
        return {
          ...exam.toObject(),
          currentCandidates: currentCandidates,
          availableSlots: exam.totalCandidates - currentCandidates,
        };
      })
    );
    
    res.status(200).json({
      success: true,
      count: exams.length,
      data: examsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

exports.getExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('questionSets')
      .populate('employer', 'name email');
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
      });
    }
    
    if (req.user.role === 'employer' && exam.employer._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this exam',
      });
    }
    
    res.status(200).json({
      success: true,
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateExam = async (req, res, next) => {
  try {
    let exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
      });
    }
    
    if (exam.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this exam',
      });
    }
    
    exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    res.status(200).json({
      success: true,
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
      });
    }
    
    if (exam.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this exam',
      });
    }
    
    await exam.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

exports.getExamCandidates = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
      });
    }
    
    if (exam.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }
    
    const attempts = await ExamAttempt.find({ 
      exam: exam._id,
      status: { $in: ['submitted', 'auto-submitted'] }
    }).populate('candidate', 'name email');
    
    const candidates = attempts.map(attempt => ({
      id: attempt.candidate._id,
      name: attempt.candidate.name,
      email: attempt.candidate.email,
      score: attempt.totalScore,
      percentage: attempt.percentageScore,
      submittedAt: attempt.endTime,
      status: attempt.status,
      tabSwitchCount: attempt.tabSwitchCount,
      fullscreenExitCount: attempt.fullscreenExitCount,
    }));
    
    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllCandidateExams = async (req, res, next) => {
  try {
    const now = new Date();
    
    const exams = await Exam.find({
      status: 'published',
      startTime: { $lte: now },
      endTime: { $gte: now }
    }).populate('questionSets');
    
    const examsWithStatus = await Promise.all(
      exams.map(async (exam) => {
        const existingAttempt = await ExamAttempt.findOne({
          exam: exam._id,
          candidate: req.user.id,
          status: { $in: ['submitted', 'auto-submitted', 'in-progress'] }
        });
        
        const currentCandidates = await ExamAttempt.countDocuments({
          exam: exam._id,
          status: { $in: ['submitted', 'auto-submitted', 'in-progress'] }
        });
        
        const isFull = currentCandidates >= exam.totalCandidates;
        const hasTaken = !!existingAttempt;
        const isInProgress = existingAttempt?.status === 'in-progress';
        
        return {
          ...exam.toObject(),
          currentCandidates,
          availableSlots: exam.totalCandidates - currentCandidates,
          isFull,
          hasTaken,
          isInProgress,
          attemptId: existingAttempt?._id || null,
        };
      })
    );
    
    const availableExams = examsWithStatus.filter(
      exam => !exam.isFull && !exam.hasTaken
    );
    
    res.status(200).json({
      success: true,
      count: availableExams.length,
      data: availableExams,
    });
  } catch (error) {
    next(error);
  }
};