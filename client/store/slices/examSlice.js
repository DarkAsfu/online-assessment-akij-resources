import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  exams: [],
  currentExam: null,
  isLoading: false,
  error: null,
}

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setExams: (state, action) => {
      state.exams = action.payload
      state.isLoading = false
      state.error = null
    },
    setCurrentExam: (state, action) => {
      state.currentExam = action.payload
      state.isLoading = false
      state.error = null
    },
    addExam: (state, action) => {
      state.exams.push(action.payload)
    },
    updateExam: (state, action) => {
      const index = state.exams.findIndex(exam => exam._id === action.payload._id)
      if (index !== -1) {
        state.exams[index] = action.payload
      }
      if (state.currentExam?._id === action.payload._id) {
        state.currentExam = action.payload
      }
    },
    deleteExam: (state, action) => {
      state.exams = state.exams.filter(exam => exam._id !== action.payload)
      if (state.currentExam?._id === action.payload) {
        state.currentExam = null
      }
    },
    setError: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    },
    clearExamState: (state) => {
      state.currentExam = null
      state.error = null
    },
  },
})

export const {
  setLoading,
  setExams,
  setCurrentExam,
  addExam,
  updateExam,
  deleteExam,
  setError,
  clearExamState,
} = examSlice.actions
export default examSlice.reducer
