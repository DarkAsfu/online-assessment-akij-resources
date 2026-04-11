import api from './api'

const candidateExamService = {
  startExam: async (examId) => {
    const response = await api.post(`/candidate-exams/${examId}/start`)
    return response.data
  },

  submitAnswer: async (attemptId, questionId, answer) => {
    const response = await api.post(
      `/candidate-exams/attempt/${attemptId}/answer`,
      {
        questionId,
        answer,
      }
    )
    return response.data
  },

  submitExam: async (attemptId) => {
    const response = await api.post(`/candidate-exams/attempt/${attemptId}/submit`)
    return response.data
  },

  trackBehavior: async (attemptId, eventType, details = {}) => {
    const response = await api.post(`/candidate-exams/attempt/${attemptId}/behavior`, {
      eventType,
      details,
    })
    return response.data
  },

  getAttempt: async (attemptId) => {
    const response = await api.get(`/candidate-exams/attempt/${attemptId}`)
    return response.data
  },
}

export default candidateExamService
