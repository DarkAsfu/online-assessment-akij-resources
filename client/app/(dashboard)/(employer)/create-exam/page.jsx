"use client"

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import AddQuestionModal from '@/components/employer/create-exam/AddQuestionModal'
import BasicInfoForm from '@/components/employer/create-exam/BasicInfoForm'
import BasicInfoSummary from '@/components/employer/create-exam/BasicInfoSummary'
import CreateExamActions from '@/components/employer/create-exam/CreateExamActions'
import CreateExamHeader from '@/components/employer/create-exam/CreateExamHeader'
import QuestionsList from '@/components/employer/create-exam/QuestionsList'
import examService from '@/services/examService'
import questionSetService from '@/services/questionSetService'

const Page = () => {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [basicInfoCompleted, setBasicInfoCompleted] = useState(false)
    const [showBasicInfoForm, setShowBasicInfoForm] = useState(true)
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false)
    const [draftQuestions, setDraftQuestions] = useState([])
    const [examId, setExamId] = useState(null)
    const [questionSetId, setQuestionSetId] = useState(null)
    const [isSavingBasicInfo, setIsSavingBasicInfo] = useState(false)
    const [isSavingQuestions, setIsSavingQuestions] = useState(false)
    const [isSubmittingExam, setIsSubmittingExam] = useState(false)
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
                setBasicInfoCompleted(true)
                setShowBasicInfoForm(false)
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

    const handleAddQuestion = (question) => {
        if (!examId) {
            toast.error('Save basic info first')
            return
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

        let request

        if (questionSetId) {
            // Add question to existing question set
            request = questionSetService.addQuestionToSet(questionSetId, mappedQuestion)
        } else {
            // Create new question set with first question
            questionSetPayload.questions = [mappedQuestion]
            request = questionSetService.createQuestionSet(questionSetPayload)
        }

        request
            .then((response) => {
                if (!questionSetId) {
                    const newQuestionSetId = response?.data?.questionSet?._id || response?.data?._id || null
                    setQuestionSetId(newQuestionSetId)
                    
                    // Auto-publish exam after first question is added
                    setIsSubmittingExam(true)
                    return examService.publishExam(examId).then(() => {
                        setDraftQuestions((prev) => [...prev, question])
                        toast.success('Question added and exam published successfully!')
                        setTimeout(() => {
                            router.push('/')
                        }, 1500)
                    })
                }
                
                setDraftQuestions((prev) => [...prev, question])
                toast.success('Question added')
            })
            .catch((error) => {
                const message = error?.response?.data?.message || 'Failed to add question'
                toast.error(message)
            })
            .finally(() => {
                setIsSavingQuestions(false)
                setIsSubmittingExam(false)
            })
    }


    const handleSubmitExam = () => {
        // This function is no longer needed as exams are auto-published
    }

    return (
        <main className='bg-[#f8f8f8] px-4 pb-10 pt-8 md:px-8 md:pb-14 md:pt-14'>
            <div className='mx-auto max-w-7xl space-y-4'>
                <CreateExamHeader step={step} basicInfoCompleted={basicInfoCompleted} />

                {step === 1 ? (
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
                ) : (
                    <>
                        {draftQuestions.length > 0 ? (
                            <QuestionsList questions={draftQuestions} />
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
                )}
            </div>

            <AddQuestionModal
                open={isQuestionModalOpen}
                onClose={() => setIsQuestionModalOpen(false)}
                onSave={handleAddQuestion}
            />
        </main>
    )
}

export default Page