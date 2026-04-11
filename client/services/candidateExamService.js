import api from './api'

const candidateExamService = {
  startExam: async (examId) => {
    const response = await api.post(`/candidate-exams/${examId}/start`)
    return response.data
  },

  submitExam: async (examId, answers) => {
    const response = await api.post(`/candidate-exams/${examId}/submit`, {
      answers,
    })
    return response.data
  },

  getExamAttempt: async (attemptId) => {
    const response = await api.get(`/candidate-exams/attempt/${attemptId}`)
    return response.data
  },

  getMyExamAttempts: async (examId) => {
    const response = await api.get(`/candidate-exams/${examId}/my-attempts`)
    return response.data
  },

  getExamProgress: async (attemptId) => {
    const response = await api.get(
      `/candidate-exams/attempt/${attemptId}/progress`
    )
    return response.data
  },

  saveAnswer: async (attemptId, questionId, answer) => {
    const response = await api.post(
      `/candidate-exams/attempt/${attemptId}/save-answer`,
      {
        questionId,
        answer,
      }
    )
    return response.data
  },

  getExamResult: async (attemptId) => {
    const response = await api.get(`/candidate-exams/attempt/${attemptId}/result`)
    return response.data
  },

  getCandidateExamStats: async () => {
    const response = await api.get('/candidate-exams/stats')
    return response.data
  },

  getCurrentAttempt: async (examId) => {
    const response = await api.get(
      `/candidate-exams/${examId}/current-attempt`
    )
    return response.data
  },
}

export default candidateExamService
