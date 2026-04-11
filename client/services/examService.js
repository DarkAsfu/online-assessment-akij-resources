import api from './api'

const examService = {
  createExam: async (examData) => {
    const response = await api.post('/exams', examData)
    return response.data
  },

  getEmployerExams: async () => {
    const response = await api.get('/exams/employer/my-exams')
    return response.data
  },

  getExamById: async (id) => {
    const response = await api.get(`/exams/${id}`)
    return response.data
  },

  updateExam: async (id, examData) => {
    const response = await api.put(`/exams/${id}`, examData)
    return response.data
  },

  deleteExam: async (id) => {
    const response = await api.delete(`/exams/${id}`)
    return response.data
  },

  publishExam: async (examId) => {
    const response = await api.put(`/exams/${examId}/publish`)
    return response.data
  },

  getCandidateExams: async () => {
    const response = await api.get('/exams/candidate/all-exams')
    return response.data
  },
}

export default examService