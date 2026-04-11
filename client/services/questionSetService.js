import api from './api'

const questionSetService = {
  createQuestionSet: async (data) => {
    const response = await api.post('/question-sets', data)
    return response.data
  },

  getQuestionSets: async () => {
    const response = await api.get('/question-sets')
    return response.data
  },

  getQuestionSetById: async (id) => {
    const response = await api.get(`/question-sets/${id}`)
    return response.data
  },

  updateQuestionSet: async (id, data) => {
    const response = await api.put(`/question-sets/${id}`, data)
    return response.data
  },

  deleteQuestionSet: async (id) => {
    const response = await api.delete(`/question-sets/${id}`)
    return response.data
  },
}

export default questionSetService