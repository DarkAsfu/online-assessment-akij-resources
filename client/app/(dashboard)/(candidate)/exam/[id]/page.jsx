"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { CircleCheck } from 'lucide-react'
import examService from '@/services/examService'
import candidateExamService from '@/services/candidateExamService'

const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} left`
}

const normalizeText = (value) => (value || '').trim().toLowerCase()

const arraysMatch = (a = [], b = []) => {
    if (!Array.isArray(a) || !Array.isArray(b)) return false
    if (a.length !== b.length) return false

    const left = [...a].sort()
    const right = [...b].sort()
    return left.every((item, index) => item === right[index])
}

const renderAnswerText = (answer) => {
    if (Array.isArray(answer)) return answer.length ? answer.join(', ') : 'Not Answered'
    if (typeof answer === 'string') return answer.trim() ? answer : 'Not Answered'
    return answer || 'Not Answered'
}

const TextEditorPlaceholder = ({ value, onChange }) => {
    return (
        <div className='w-full rounded-lg border border-[#e5e7eb]'>
            <div className='flex items-center gap-4 border-b border-[#e5e7eb] bg-[#f9fafb] px-4 py-2 text-[14px] text-[#374151]'>
                <span className='cursor-default'>↩</span>
                <span className='cursor-default'>↪</span>
                <span className='cursor-default'>Normal text</span>
                <span className='cursor-default'>≡</span>
                <span className='cursor-default font-semibold'>B</span>
                <span className='cursor-default italic'>I</span>
                <span className='cursor-default underline'>U</span>
            </div>
            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className='h-44 w-full resize-none rounded-b-lg bg-white px-4 py-3 text-[14px] text-primary placeholder:text-[#94a3b8] focus:outline-none'
                placeholder='Type questions here..'
            />
        </div>
    )
}

const Page = () => {
    const { id } = useParams()
    const router = useRouter()
    const [exam, setExam] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isFinished, setIsFinished] = useState(false)
    const [attemptId, setAttemptId] = useState(null)
    const [isSubmittingExam, setIsSubmittingExam] = useState(false)
    const [serverResult, setServerResult] = useState(null)
    const [questionIndex, setQuestionIndex] = useState(0)
    const [remainingSeconds, setRemainingSeconds] = useState(0)
    const [answers, setAnswers] = useState({})
    const [questionSets, setQuestionSets] = useState([])

    const allQuestions = useMemo(() => {
        if (questionSets.length > 0) {
            return questionSets.flatMap((set) => set.questions || [])
        }
        if (!exam?.questionSets) return []
        return exam.questionSets.flatMap((set) => set.questions || [])
    }, [exam, questionSets])

    const examResult = useMemo(() => {
        const evaluated = allQuestions.map((question, index) => {
            const userAnswer = answers[question._id]
            const points = Number(question.points) || 1

            let isCorrect = false
            if (question.questionType === 'radio') {
                isCorrect = userAnswer && question.correctAnswers?.[0] === userAnswer
            } else if (question.questionType === 'checkbox') {
                isCorrect = arraysMatch(question.correctAnswers || [], userAnswer || [])
            } else {
                isCorrect = normalizeText(question.textAnswer) === normalizeText(userAnswer)
            }

            const hasAnswer =
                (Array.isArray(userAnswer) && userAnswer.length > 0) ||
                (typeof userAnswer === 'string' && userAnswer.trim()) ||
                (!!userAnswer && !Array.isArray(userAnswer))

            const earnedPoints = isCorrect
                ? points
                : hasAnswer && exam?.negativeMarking
                  ? -Number(exam.negativeMarkingValue || 0)
                  : 0

            return {
                id: question._id,
                index: index + 1,
                questionText: question.questionText,
                questionType: question.questionType,
                userAnswer,
                correctAnswer:
                    question.questionType === 'text'
                        ? question.textAnswer
                        : question.correctAnswers,
                isCorrect,
                hasAnswer,
                points,
                earnedPoints,
            }
        })

        const totalPossible = evaluated.reduce((sum, item) => sum + item.points, 0)
        const totalScore = evaluated.reduce((sum, item) => sum + item.earnedPoints, 0)
        const correctCount = evaluated.filter((item) => item.isCorrect).length
        const wrongQuestions = evaluated.filter((item) => !item.isCorrect)
        const answeredCount = evaluated.filter((item) => item.hasAnswer).length
        const skippedCount = evaluated.length - answeredCount
        const percentage = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0

        return {
            totalPossible,
            totalScore,
            correctCount,
            wrongQuestions,
            answeredCount,
            skippedCount,
            percentage,
        }
    }, [allQuestions, answers, exam?.negativeMarking, exam?.negativeMarkingValue])

    const currentQuestion = allQuestions[questionIndex]

    const finalStats = useMemo(() => {
        if (!serverResult) return examResult

        return {
            ...examResult,
            totalScore: Number(serverResult.totalScore ?? examResult.totalScore),
            totalPossible: Number(serverResult.totalPossibleScore ?? examResult.totalPossible),
            percentage: Number(serverResult.percentageScore ?? examResult.percentage),
        }
    }, [examResult, serverResult])

    useEffect(() => {
        const fetchExam = async () => {
            try {
                setIsLoading(true)
                const startResponse = await candidateExamService.startExam(id)
                const startedData = startResponse?.data

                setAttemptId(startedData?.attemptId || null)
                setQuestionSets(Array.isArray(startedData?.questions) ? startedData.questions : [])

                if (startedData?.exam) {
                    setExam(startedData.exam)
                } else {
                    const fallbackResponse = await examService.getExamById(id)
                    setExam(fallbackResponse?.data || null)
                }

                const totalSeconds = startedData?.timeRemaining?.totalSeconds
                if (typeof totalSeconds === 'number') {
                    setRemainingSeconds(totalSeconds)
                } else if (startedData?.exam?.duration) {
                    setRemainingSeconds(Number(startedData.exam.duration) * 60)
                }
            } catch (error) {
                const message = error?.response?.data?.message || 'Failed to load exam'
                toast.error(message)
            } finally {
                setIsLoading(false)
            }
        }

        if (id) fetchExam()
    }, [id])

    const handleExamSubmit = useCallback(async () => {
        if (isSubmittingExam || isFinished) return

        try {
            setIsSubmittingExam(true)
            if (attemptId) {
                const response = await candidateExamService.submitExam(attemptId)
                setServerResult(response?.data || null)
            }
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to submit exam'
            toast.error(message)
        } finally {
            setIsFinished(true)
            setIsSubmittingExam(false)
        }
    }, [attemptId, isFinished, isSubmittingExam])

    useEffect(() => {
        if (isLoading || isFinished || remainingSeconds <= 0 || isSubmittingExam) return

        const intervalId = setInterval(() => {
            setRemainingSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalId)
                    handleExamSubmit()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(intervalId)
    }, [handleExamSubmit, isLoading, isFinished, remainingSeconds, isSubmittingExam])

    const submitCurrentAnswer = async () => {
        if (!attemptId || !currentQuestion) return true

        const answer = answers[currentQuestion._id]
        const hasAnswer =
            (Array.isArray(answer) && answer.length > 0) ||
            (typeof answer === 'string' && answer.trim()) ||
            (!!answer && !Array.isArray(answer))

        if (!hasAnswer) return true

        try {
            await candidateExamService.submitAnswer(attemptId, currentQuestion._id, answer)
            return true
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to save answer'
            toast.error(message)
            return false
        }
    }

    const handleSingleChoice = (questionId, option) => {
        setAnswers((prev) => ({ ...prev, [questionId]: option }))
    }

    const handleMultiChoice = (questionId, option) => {
        setAnswers((prev) => {
            const existing = Array.isArray(prev[questionId]) ? prev[questionId] : []
            const updated = existing.includes(option)
                ? existing.filter((item) => item !== option)
                : [...existing, option]
            return { ...prev, [questionId]: updated }
        })
    }

    const handleTextChoice = (questionId, value) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }))
    }

    const handleSkip = () => {
        if (questionIndex < allQuestions.length - 1) {
            setQuestionIndex((prev) => prev + 1)
            return
        }
        handleExamSubmit()
    }

    const handleNext = async () => {
        const saved = await submitCurrentAnswer()
        if (!saved) return

        if (questionIndex < allQuestions.length - 1) {
            setQuestionIndex((prev) => prev + 1)
            return
        }
        handleExamSubmit()
    }

    const handleRetake = () => {
        setAnswers({})
        setServerResult(null)
        setQuestionIndex(0)
        setRemainingSeconds(Number(exam?.duration || 0) * 60)
        setIsFinished(false)
    }

    if (isLoading) {
        return (
            <main className='bg-[#f8f8f8] px-4 pb-16 pt-8 md:px-8 md:pt-14'>
                <section className='mx-auto max-w-212.25 rounded-2xl border border-[#e5e7eb] bg-white p-10 text-center'>
                    <p className='text-[16px] text-[#64748b]'>Loading exam...</p>
                </section>
            </main>
        )
    }

    if (!exam || allQuestions.length === 0) {
        return (
            <main className='bg-[#f8f8f8] px-4 pb-16 pt-8 md:px-8 md:pt-14'>
                <section className='mx-auto max-w-212.25 rounded-2xl border border-[#e5e7eb] bg-white p-10 text-center'>
                    <p className='text-[16px] text-[#64748b]'>No questions found for this exam.</p>
                </section>
            </main>
        )
    }

    if (isFinished) {
        return (
            <main className='bg-[#f8f8f8] px-4 pb-16 pt-8 md:px-8 md:pt-14'>
                <section className='mx-auto max-w-7xl rounded-[20px] border border-[#e5e7eb] bg-white px-6 py-12 text-center md:px-16 md:py-14'>
                    <div className='mx-auto max-w-4xl'>
                        <CircleCheck size={56} className='mx-auto mb-3 text-[#2f80ed]' />
                        <h2 className='text-[20px] font-semibold text-primary'>Test Completed</h2>
                        <p className='mt-2 text-[16px] text-[#64748b]'>
                            Congratulations! {`You have completed ${exam.title}. Thank you for participating.`}
                        </p>

                        <div className='mt-8 grid gap-3 text-left md:grid-cols-4'>
                            <div className='rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4'>
                                <p className='text-[12px] text-[#64748b]'>Score</p>
                                <p className='text-[18px] font-semibold text-primary'>
                                    {finalStats.totalScore.toFixed(2)} / {finalStats.totalPossible}
                                </p>
                            </div>
                            <div className='rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4'>
                                <p className='text-[12px] text-[#64748b]'>Percentage</p>
                                <p className='text-[18px] font-semibold text-primary'>
                                    {finalStats.percentage.toFixed(2)}%
                                </p>
                            </div>
                            <div className='rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4'>
                                <p className='text-[12px] text-[#64748b]'>Correct</p>
                                <p className='text-[18px] font-semibold text-[#16a34a]'>
                                    {examResult.correctCount} / {allQuestions.length}
                                </p>
                            </div>
                            <div className='rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4'>
                                <p className='text-[12px] text-[#64748b]'>Skipped</p>
                                <p className='text-[18px] font-semibold text-[#b45309]'>
                                    {examResult.skippedCount}
                                </p>
                            </div>
                        </div>

                        {examResult.wrongQuestions.length > 0 ? (
                            <div className='mt-6 rounded-2xl border border-[#fee2e2] bg-[#fff7f7] p-4 text-left'>
                                <h3 className='text-[16px] font-semibold text-[#b91c1c]'>
                                    Wrong Questions ({examResult.wrongQuestions.length})
                                </h3>
                                <div className='mt-3 space-y-3'>
                                    {examResult.wrongQuestions.map((item) => (
                                        <article
                                            key={item.id}
                                            className='rounded-xl border border-[#fecaca] bg-white p-3'
                                        >
                                            <p className='text-[14px] font-semibold text-primary'>
                                                {`Q${item.index}. ${item.questionText}`}
                                            </p>
                                            <p className='mt-2 text-[13px] text-[#dc2626]'>
                                                Your Answer: {renderAnswerText(item.userAnswer)}
                                            </p>
                                            <p className='mt-1 text-[13px] text-[#16a34a]'>
                                                Correct Answer: {renderAnswerText(item.correctAnswer)}
                                            </p>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className='mt-6 rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] p-4'>
                                <p className='text-[14px] font-medium text-[#166534]'>
                                    Excellent! You answered all questions correctly.
                                </p>
                            </div>
                        )}

                        <div className='mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row'>
                            <button
                                type='button'
                                onClick={handleRetake}
                                className='rounded-xl bg-linear-to-r from-[#5f2df5] to-[#6438f8] px-8 py-3 text-[16px] font-semibold text-white cursor-pointer'
                            >
                                Retake
                            </button>
                            <button
                                type='button'
                                onClick={() => router.push('/')}
                                className='rounded-xl border border-[#e5e7eb] px-8 py-3 text-[16px] font-semibold text-primary cursor-pointer'
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        )
    }

    const selectedAnswer = answers[currentQuestion._id]

    return (
        <main className='bg-[#f8f8f8] px-4 pb-16 pt-8 md:px-8 md:pt-14'>
            <section className='mx-auto max-w-212.25 space-y-6'>
                <div className='rounded-2xl border border-[#e5e7eb] bg-white px-6 py-4'>
                    <div className='flex flex-col items-start justify-between gap-3 md:flex-row md:items-center'>
                        <p className='text-[20px] font-medium text-primary'>
                            {`Question (${questionIndex + 1}/${allQuestions.length})`}
                        </p>
                        <div className='rounded-xl bg-[#f3f4f6] px-10 py-3 text-[20px] font-semibold text-primary'>
                            {formatTime(remainingSeconds)}
                        </div>
                    </div>
                </div>

                <div className='rounded-2xl border border-[#e5e7eb] bg-white p-6'>
                    <div className='space-y-8'>
                        <div className='space-y-6'>
                            <h1 className='text-[20px] font-medium text-primary'>
                                {`Q${questionIndex + 1}. ${currentQuestion.questionText}`}
                            </h1>

                            {currentQuestion.questionType === 'radio' ? (
                                <div className='space-y-4'>
                                    {(currentQuestion.options || []).map((option) => (
                                        <label
                                            key={option}
                                            className='flex h-13 cursor-pointer items-center gap-3 rounded-lg border border-[#e5e7eb] px-4'
                                        >
                                            <input
                                                type='radio'
                                                name={currentQuestion._id}
                                                checked={selectedAnswer === option}
                                                onChange={() => handleSingleChoice(currentQuestion._id, option)}
                                                className='h-4 w-4 border-[#9ca3af] accent-[#633CFF]'
                                            />
                                            <span className='text-[16px] text-primary'>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            ) : null}

                            {currentQuestion.questionType === 'checkbox' ? (
                                <div className='space-y-4'>
                                    {(currentQuestion.options || []).map((option) => (
                                        <label
                                            key={option}
                                            className='flex h-13 cursor-pointer items-center gap-3 rounded-lg border border-[#e5e7eb] px-4'
                                        >
                                            <input
                                                type='checkbox'
                                                checked={Array.isArray(selectedAnswer) && selectedAnswer.includes(option)}
                                                onChange={() => handleMultiChoice(currentQuestion._id, option)}
                                                className='h-4 w-4 border-[#9ca3af] accent-[#633CFF]'
                                            />
                                            <span className='text-[16px] text-primary'>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            ) : null}

                            {currentQuestion.questionType === 'text' ? (
                                <TextEditorPlaceholder
                                    value={typeof selectedAnswer === 'string' ? selectedAnswer : ''}
                                    onChange={(value) => handleTextChoice(currentQuestion._id, value)}
                                />
                            ) : null}
                        </div>

                        <div className='flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center'>
                            <button
                                type='button'
                                onClick={handleSkip}
                                className='rounded-xl border border-[#e5e7eb] px-8 py-3 text-[16px] font-semibold text-primary cursor-pointer'
                            >
                                Skip this Question
                            </button>
                            <button
                                type='button'
                                onClick={handleNext}
                                disabled={isSubmittingExam}
                                className='rounded-xl bg-linear-to-r from-[#5f2df5] to-[#6438f8] px-8 py-3 text-[16px] font-semibold text-white cursor-pointer'
                            >
                                {isSubmittingExam
                                    ? 'Submitting...'
                                    : questionIndex === allQuestions.length - 1
                                    ? 'Finish Exam'
                                    : 'Save & Continue'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Page