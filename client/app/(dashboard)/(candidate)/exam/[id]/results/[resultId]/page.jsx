"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ArrowLeft, CheckCircle, XCircle, Clock, Award } from 'lucide-react'
import candidateExamService from '@/services/candidateExamService'

const stripHtml = (value = '') =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const ResultPage = () => {
  const router = useRouter()
  const { resultId } = useParams()
  const [attempt, setAttempt] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        setIsLoading(true)
        const response = await candidateExamService.getAttempt(resultId)
        if (response.success) {
          setAttempt(response.data)
        } else {
          toast.error(response.message || 'Failed to load results')
          router.push('/dashboard')
        }
      } catch (error) {
        const message = error?.response?.data?.message || 'Failed to load results'
        toast.error(message)
        router.push('/dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    if (resultId) {
      fetchAttempt()
    }
  }, [resultId, router])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    }
    return `${minutes}m ${secs}s`
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#6633ff] mx-auto mb-4'></div>
          <p className='text-primary'>Loading results...</p>
        </div>
      </div>
    )
  }

  if (!attempt) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <p className='text-primary'>Results not found</p>
        </div>
      </div>
    )
  }

  const { exam, answers = [], totalScore, percentageScore, timeSpent } = attempt

  const correctAnswers = answers.filter((a) => a.isCorrect).length
  const totalQuestions = answers.length

  return (
    <main className='bg-[#f8f8f8] px-4 pb-10 pt-8 md:px-8 md:pb-14 md:pt-14'>
      <div className='mx-auto max-w-4xl'>
        {/* Header */}
        <div className='mb-8'>
          <button
            onClick={() => router.push('/')}
            className='mb-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[14px] font-medium text-[#633CFF] hover:bg-[#f3f4f6] transition-colors'
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          <h1 className='text-[32px] font-semibold leading-[1.3] text-primary mb-2'>
            {exam?.title}
          </h1>
          <p className='text-[14px] text-[#64748b]'>
            Test completed on {new Date(attempt.endTime).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* Score Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          {/* Score Card */}
          <div className='rounded-2xl border border-[#eceff4] bg-white p-6'>
            <div className='flex items-center gap-3 mb-2'>
              <Award size={24} className='text-[#f59e0b]' />
              <p className='text-[14px] font-medium text-[#64748b]'>Total Score</p>
            </div>
            <p className='text-[32px] font-bold text-primary'>
              {totalScore}/{attempt.totalPossibleScore}
            </p>
          </div>

          {/* Percentage Card */}
          <div className='rounded-2xl border border-[#eceff4] bg-white p-6'>
            <div className='flex items-center gap-3 mb-2'>
              <CheckCircle size={24} className='text-[#10b981]' />
              <p className='text-[14px] font-medium text-[#64748b]'>Percentage</p>
            </div>
            <p className='text-[32px] font-bold text-primary'>
              {percentageScore.toFixed(2)}%
            </p>
          </div>

          {/* Time Card */}
          <div className='rounded-2xl border border-[#eceff4] bg-white p-6'>
            <div className='flex items-center gap-3 mb-2'>
              <Clock size={24} className='text-[#3b82f6]' />
              <p className='text-[14px] font-medium text-[#64748b]'>Time Spent</p>
            </div>
            <p className='text-[32px] font-bold text-primary'>
              {formatTime(timeSpent)}
            </p>
          </div>
        </div>

        {/* Questions Summary */}
        <div className='rounded-2xl border border-[#eceff4] bg-white p-6 mb-8'>
          <h2 className='text-[20px] font-semibold leading-[1.3] text-primary mb-4'>
            Answer Summary
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='text-center'>
              <p className='text-[14px] font-medium text-[#64748b]'>Total Questions</p>
              <p className='text-[24px] font-bold text-primary mt-2'>{totalQuestions}</p>
            </div>
            <div className='text-center'>
              <p className='text-[14px] font-medium text-[#64748b]'>Correct</p>
              <p className='text-[24px] font-bold text-[#10b981] mt-2'>{correctAnswers}</p>
            </div>
            <div className='text-center'>
              <p className='text-[14px] font-medium text-[#64748b]'>Incorrect</p>
              <p className='text-[24px] font-bold text-[#ef4444] mt-2'>
                {totalQuestions - correctAnswers}
              </p>
            </div>
            <div className='text-center'>
              <p className='text-[14px] font-medium text-[#64748b]'>Success Rate</p>
              <p className='text-[24px] font-bold text-[#3b82f6] mt-2'>
                {totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(0) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Answers */}
        <div className='rounded-2xl border border-[#eceff4] bg-white p-6'>
          <h2 className='text-[20px] font-semibold leading-[1.3] text-primary mb-6'>
            Detailed Answers
          </h2>

          <div className='space-y-6'>
            {answers.map((answer, index) => (
              <div
                key={index}
                className={`rounded-xl border-2 p-4 ${
                  answer.isCorrect
                    ? 'border-[#d1fae5] bg-[#f0fdf4]'
                    : 'border-[#fee2e2] bg-[#fef2f2]'
                }`}
              >
                <div className='flex items-start gap-3 mb-3'>
                  {answer.isCorrect ? (
                    <CheckCircle size={20} className='text-[#10b981] mt-1 flex-shrink-0' />
                  ) : (
                    <XCircle size={20} className='text-[#ef4444] mt-1 flex-shrink-0' />
                  )}
                  <div className='flex-1'>
                    <h3 className='text-[16px] font-semibold text-primary mb-1'>
                      Question {index + 1}
                    </h3>
                    <p
                      className='text-[14px] text-primary'
                      dangerouslySetInnerHTML={{
                        __html: answer.questionText || 'Question text not available',
                      }}
                    />
                  </div>
                  <div className='flex-shrink-0 text-right'>
                    <p className='text-[12px] font-medium text-[#64748b]'>
                      {answer.pointsEarned}/{answer.pointsPossible} pts
                    </p>
                    <p
                      className={`text-[12px] font-semibold mt-1 ${
                        answer.isCorrect ? 'text-[#10b981]' : 'text-[#ef4444]'
                      }`}
                    >
                      {answer.isCorrect ? 'Correct' : 'Incorrect'}
                    </p>
                  </div>
                </div>

                {/* Your Answer */}
                <div className='mb-3 pl-8'>
                  <p className='text-[12px] font-medium text-[#64748b] mb-1'>Your Answer:</p>
                  <p className='text-[14px] text-primary'>
                    {Array.isArray(answer.userAnswer)
                      ? answer.userAnswer.join(', ') || 'Not answered'
                      : answer.userAnswer || 'Not answered'}
                  </p>
                </div>

                {/* Correct Answer (if incorrect) */}
                {!answer.isCorrect && answer.questionType !== 'text' && (
                  <div className='pl-8'>
                    <p className='text-[12px] font-medium text-[#10b981] mb-1'>
                      Correct Answer:
                    </p>
                    <p className='text-[14px] text-[#10b981]'>
                      {(() => {
                        // Try to find correct option from questionId
                        const exam_full = attempt.exam
                        if (!exam_full?.questionSets) return 'Answer not available'

                        for (const set of exam_full.questionSets) {
                          for (const q of set.questions || []) {
                            if (q._id === answer.questionId) {
                              if (q.questionType === 'multiple-choice' && q.options) {
                                const correctOpts = q.options
                                  .filter((opt) => opt.correct)
                                  .map((opt) => opt.text)
                                return correctOpts.join(', ')
                              } else if (q.questionType === 'true-false') {
                                return q.correctAnswer ? 'True' : 'False'
                              }
                            }
                          }
                        }
                        return 'Answer not available'
                      })()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default ResultPage