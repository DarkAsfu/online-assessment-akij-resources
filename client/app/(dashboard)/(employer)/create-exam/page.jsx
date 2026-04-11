"use client"

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import AddQuestionModal from '@/components/employer/create-exam/AddQuestionModal'
import BasicInfoForm from '@/components/employer/create-exam/BasicInfoForm'
import BasicInfoSummary from '@/components/employer/create-exam/BasicInfoSummary'
import CreateExamActions from '@/components/employer/create-exam/CreateExamActions'
import CreateExamHeader from '@/components/employer/create-exam/CreateExamHeader'
import QuestionsList from '@/components/employer/create-exam/QuestionsList'
import examService from '@/services/examService'
import questionSetService from '@/services/questionSetService'

const mapStoredQuestionToForm = (question, index = 0) => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F']

    if (question.questionType === 'text') {
        return {
            id: question._id || `${Date.now()}-${index}`,
            type: 'text',
            points: question.points || 1,
            prompt: question.questionText || '',
            options: [],
            answerText: question.textAnswer || '',
        }
    }

    return {
        id: question._id || `${Date.now()}-${index}`,
        type: question.questionType,
        points: question.points || 1,
        prompt: question.questionText || '',
        options: (question.options || []).map((option, optionIndex) => ({
            id: letters[optionIndex] || String.fromCharCode(65 + optionIndex),
            text: option,
            correct: (question.correctAnswers || []).includes(option),
        })),
        answerText: '',
    }
}

const Page = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const examIdParam = searchParams.get('examId')
    const [step, setStep] = useState(1)
    const [basicInfoCompleted, setBasicInfoCompleted] = useState(false)
    const [showBasicInfoForm, setShowBasicInfoForm] = useState(true)
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false)
    const [draftQuestions, setDraftQuestions] = useState([])
    const [examId, setExamId] = useState(examIdParam || null)
    const [examStatus, setExamStatus] = useState('draft')
    const [questionSetId, setQuestionSetId] = useState(null)
    const [isSavingBasicInfo, setIsSavingBasicInfo] = useState(false)
    const [isSavingQuestions, setIsSavingQuestions] = useState(false)
    const [isSubmittingExam, setIsSubmittingExam] = useState(false)
    const [isLoadingExam, setIsLoadingExam] = useState(Boolean(examIdParam))
    const [basicInfo, setBasicInfo] = useState({
        title: '',
        totalCandidates: '',
        totalSlots: '',
        totalQuestionSet: '',
        durationPerSlot: '',
        questionType: '',
        startTime: '',
        endTime: '',
    })

    useEffect(() => {
        const loadExistingExam = async () => {
            if (!examIdParam) {
                setIsLoadingExam(false)
                return
            }

            try {
                setIsLoadingExam(true)
                const response = await examService.getExamById(examIdParam)
                const exam = response?.data

                if (!exam) return

                setExamId(exam._id)
                setExamStatus(exam.status || 'draft')
                setBasicInfoCompleted(true)
                setShowBasicInfoForm(false)
                setStep(2)
                setBasicInfo({
                    title: exam.title || '',
                    totalCandidates: exam.totalCandidates || '',
                    totalSlots: exam.totalSlots || '',
                    totalQuestionSet: exam.questionSets?.length || '',
                    durationPerSlot: exam.duration || '',
                    questionType: exam.questionType || '',
                    startTime: exam.startTime ? new Date(exam.startTime).toISOString().slice(0, 16) : '',
                    endTime: exam.endTime ? new Date(exam.endTime).toISOString().slice(0, 16) : '',
                })

                const questionSets = Array.isArray(exam.questionSets) ? exam.questionSets : []
                if (questionSets.length > 0) {
                    setQuestionSetId(questionSets[0]._id || null)
                    const existingQuestions = questionSets.flatMap((set) =>
                        (set.questions || []).map((question, index) => mapStoredQuestionToForm(question, index))
                    )
                    setDraftQuestions(existingQuestions)
                }
            } catch (error) {
                const message = error?.response?.data?.message || 'Failed to load exam'
                toast.error(message)
            } finally {
                setIsLoadingExam(false)
            }
        }

        loadExistingExam()
    }, [examIdParam])

    const handleBasicInfoChange = (name, value) => {
        setBasicInfo((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSaveBasicInfo = () => {
        const requiredFields = [
            basicInfo.title,
            basicInfo.totalCandidates,
            basicInfo.totalSlots,
            basicInfo.questionType,
            basicInfo.startTime,
            basicInfo.endTime,
            basicInfo.durationPerSlot,
        ]

        if (requiredFields.some((field) => !field)) {
            toast.error('Please fill all required fields')
            return
        }

        const examPayload = {
            title: basicInfo.title,
            totalCandidates: Number(basicInfo.totalCandidates),
            totalSlots: Number(basicInfo.totalSlots),
            questionType: basicInfo.questionType,
            startTime: new Date(basicInfo.startTime).toISOString(),
            endTime: new Date(basicInfo.endTime).toISOString(),
            duration: Number(basicInfo.durationPerSlot),
            negativeMarking: false,
            negativeMarkingValue: 0,
        }

        setIsSavingBasicInfo(true)

        const request = examId
            ? examService.updateExam(examId, examPayload)
            : examService.createExam(examPayload)

        request
            .then((response) => {
                const createdOrUpdatedExamId = response?.data?._id || examId
                setExamId(createdOrUpdatedExamId)
                setExamStatus(response?.data?.status || 'draft')
                setBasicInfoCompleted(true)
                setShowBasicInfoForm(false)
                setStep(2)
                toast.success('Basic info saved')
            })
            .catch((error) => {
                const message = error?.response?.data?.message || 'Failed to save basic info'
                toast.error(message)
            })
            .finally(() => setIsSavingBasicInfo(false))
    }

    const handleContinueToQuestions = () => {
        setStep(2)
    }

    const saveQuestionToServer = async (question) => {
        if (!examId) {
            toast.error('Save basic info first')
            return false
        }

        const mappedQuestion =
            question.type === 'text'
                ? {
                      questionText: question.prompt,
                      questionType: 'text',
                      textAnswer: question.answerText,
                      points: question.points,
                  }
                : {
                      questionText: question.prompt,
                      questionType: question.type,
                      options: question.options.map((option) => option.text),
                      correctAnswers: question.options
                          .filter((option) => option.correct)
                          .map((option) => option.text),
                      points: question.points,
                  }

        const questionSetPayload = {
            title: `${basicInfo.title || 'Online Test'} Question Set`,
            examId,
            questions: questionSetId ? undefined : [mappedQuestion],
        }

        setIsSavingQuestions(true)
        try {
            let response

            if (questionSetId) {
                response = await questionSetService.addQuestionToSet(questionSetId, mappedQuestion)
            } else {
                questionSetPayload.questions = [mappedQuestion]
                response = await questionSetService.createQuestionSet(questionSetPayload)
            }

            if (!questionSetId) {
                const newQuestionSetId = response?.data?.questionSet?._id || response?.data?._id || null
                setQuestionSetId(newQuestionSetId)

                if (examStatus !== 'published') {
                    await examService.publishExam(examId)
                    setExamStatus('published')
                }
            }

            setDraftQuestions((prev) => [...prev, question])
            toast.success(questionSetId ? 'Question added' : 'Question added')
            return true
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to add question'
            toast.error(message)
            return false
        } finally {
            setIsSavingQuestions(false)
            setIsSubmittingExam(false)
        }
    }

    const handleAddQuestion = async (question) => {
        const saved = await saveQuestionToServer(question)
        if (saved) {
            setIsQuestionModalOpen(false)
        }
    }

    const handleDeleteQuestion = (questionId) => {
        setDraftQuestions((prev) => prev.filter((q) => q.id !== questionId))
        toast.success('Question removed')
    }

    const handleSubmitExam = () => {
        // This function is no longer needed as exams are auto-published
    }

    return (
        <main className='bg-[#f8f8f8] px-4 pb-10 pt-8 md:px-8 md:pb-14 md:pt-14'>
            <div className='mx-auto max-w-7xl space-y-4'>
                <CreateExamHeader step={step} basicInfoCompleted={basicInfoCompleted} />

                {isLoadingExam ? (
                    <section className='rounded-2xl border border-[#eceff4] bg-white p-10 text-center'>
                        <p className='text-[16px] text-[#64748b]'>Loading exam...</p>
                    </section>
                ) : null}

                {!isLoadingExam && step === 1 ? (
                    <>
                        {showBasicInfoForm ? (
                            <BasicInfoForm formData={basicInfo} onChange={handleBasicInfoChange} />
                        ) : (
                            <BasicInfoSummary
                                data={basicInfo}
                                onEdit={() => setShowBasicInfoForm(true)}
                            />
                        )}

                        <CreateExamActions
                            primaryLabel='Save & Continue'
                            onPrimary={showBasicInfoForm ? handleSaveBasicInfo : handleContinueToQuestions}
                            isPrimaryLoading={isSavingBasicInfo}
                        />
                    </>
                ) : !isLoadingExam ? (
                    <>
                        {draftQuestions.length > 0 ? (
                            <QuestionsList questions={draftQuestions} onDelete={handleDeleteQuestion} />
                        ) : (
                            <section className='rounded-2xl border border-[#eceff4] bg-white p-5 md:p-6 max-w-226.5 mx-auto'>
                                <button
                                    type='button'
                                    onClick={() => setIsQuestionModalOpen(true)}
                                    className='h-12 w-full rounded-xl bg-linear-to-r from-[#5f2df5] to-[#6438f8] text-[16px] font-semibold text-white cursor-pointer'
                                >
                                    Add Question
                                </button>
                            </section>
                        )}

                        {draftQuestions.length > 0 ? (
                            <section className='rounded-2xl border border-[#eceff4] bg-white p-5 md:p-6'>
                                <div className='mx-auto max-w-226.5'>
                                    <button
                                        type='button'
                                        onClick={() => setIsQuestionModalOpen(true)}
                                        className='h-12 w-full rounded-xl bg-linear-to-r from-[#5f2df5] to-[#6438f8] text-[16px] font-semibold text-white cursor-pointer'
                                    >
                                        Add Question
                                    </button>
                                </div>
                            </section>
                        ) : null}
                    </>
                ) : null}
            </div>

            <AddQuestionModal
                open={isQuestionModalOpen}
                onClose={() => setIsQuestionModalOpen(false)}
                onSave={handleAddQuestion}
                onSaveAndAddMore={saveQuestionToServer}
            />
        </main>
    )
}

export default Page