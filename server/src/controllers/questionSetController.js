const QuestionSet = require('../models/QuestionSet');
const Exam = require('../models/Exam');

exports.createQuestionSet = async (req, res, next) => {
  try {
    req.body.employer = req.user.id;
    
    const { examId } = req.body;
    
    const questionSet = await QuestionSet.create(req.body);
    
    if (examId) {
      const exam = await Exam.findById(examId);
      
      if (!exam) {
        return res.status(404).json({
          success: false,
          message: 'Exam not found'
        });
      }
      
      if (exam.employer.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to modify this exam'
        });
      }
      
      if (!exam.questionSets.includes(questionSet._id)) {
        exam.questionSets.push(questionSet._id);
        await exam.save();
      }
    }
    
    res.status(201).json({
      success: true,
      data: {
        questionSet,
        examId: examId || null,
        message: examId ? 'Question set created and added to exam' : 'Question set created'
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getQuestionSets = async (req, res, next) => {
  try {
    const questionSets = await QuestionSet.find({ employer: req.user.id })
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: questionSets.length,
      data: questionSets,
    });
  } catch (error) {
    next(error);
  }
};

exports.getQuestionSet = async (req, res, next) => {
  try {
    const questionSet = await QuestionSet.findById(req.params.id);
    
    if (!questionSet) {
      return res.status(404).json({
        success: false,
        message: 'Question set not found',
      });
    }
    
    if (req.user.role === 'employer' && questionSet.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }
    
    res.status(200).json({
      success: true,
      data: questionSet,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateQuestionSet = async (req, res, next) => {
  try {
    let questionSet = await QuestionSet.findById(req.params.id);
    
    if (!questionSet) {
      return res.status(404).json({
        success: false,
        message: 'Question set not found',
      });
    }
    
    if (questionSet.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }
    
    questionSet = await QuestionSet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    res.status(200).json({
      success: true,
      data: questionSet,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteQuestionSet = async (req, res, next) => {
  try {
    const questionSet = await QuestionSet.findById(req.params.id);
    
    if (!questionSet) {
      return res.status(404).json({
        success: false,
        message: 'Question set not found',
      });
    }
    
    if (questionSet.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }
    
    await questionSet.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};