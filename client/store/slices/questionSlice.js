import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  questionSet: null,
  questions: [],
  answers: {},
  currentQuestionIndex: 0,
  isLoading: false,
  error: null,
}

const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setQuestionSet: (state, action) => {
      state.questionSet = action.payload
      state.isLoading = false
      state.error = null
    },
    setQuestions: (state, action) => {
      state.questions = action.payload
      state.isLoading = false
      state.error = null
    },
    setAnswer: (state, action) => {
      const { questionId, answer } = action.payload
      state.answers[questionId] = answer
    },
    setCurrentQuestionIndex: (state, action) => {
      state.currentQuestionIndex = action.payload
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1
      }
    },
    goToQuestion: (state, action) => {
      state.currentQuestionIndex = action.payload
    },
    clearAnswers: (state) => {
      state.answers = {}
    },
    setError: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    },
    resetQuestionState: (state) => {
      return initialState
    },
  },
})

export const {
  setLoading,
  setQuestionSet,
  setQuestions,
  setAnswer,
  setCurrentQuestionIndex,
  nextQuestion,
  previousQuestion,
  goToQuestion,
  clearAnswers,
  setError,
  resetQuestionState,
} = questionSlice.actions
export default questionSlice.reducer
