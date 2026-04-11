"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { CircleX, Clock3, FileText, Search } from 'lucide-react'
import examService from '@/services/examService'

const CandidateDashboard = () => {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [exams, setExams] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(8)

    useEffect(() => {
        const fetchCandidateExams = async () => {
            try {
                setIsLoading(true)
                const response = await examService.getCandidateExams()
                setExams(Array.isArray(response?.data) ? response.data : [])
            } catch (error) {
                const message = error?.response?.data?.message || 'Failed to load exams'
                toast.error(message)
                setExams([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchCandidateExams()
    }, [])

    const filteredExams = useMemo(() => {
        const normalized = searchTerm.trim().toLowerCase()
        if (!normalized) return exams
        return exams.filter((exam) => exam.title?.toLowerCase().includes(normalized))
    }, [exams, searchTerm])

    const totalPages = Math.max(1, Math.ceil(filteredExams.length / itemsPerPage))
    const paginatedExams = filteredExams.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const getTotalQuestions = (exam) => {
        return (exam.questionSets || []).reduce(
            (sum, set) => sum + (set.totalQuestions || set.questions?.length || 0),
            0
        )
    }

    const handleStart = (examId) => {
        router.push(`/exam/${examId}`)
    }

    return (
        <main className='bg-[#f8f8f8] px-4 pb-10 pt-8 md:px-8 md:pb-14 md:pt-14'>
            <div className='mx-auto max-w-7xl'>
                <div className='mb-4 flex flex-col gap-4 md:mb-5 md:flex-row md:items-center md:justify-between'>
                    <h2 className='text-[24px] font-semibold leading-[1.3] text-primary'>
                        Online Tests
                    </h2>

                    <div className='flex h-12 w-full items-center justify-between rounded-lg border border-[#a086f7] bg-white px-3 shadow-[2px_2px_6px_0px_rgba(73,123,241,0.24)] md:max-w-155.25'>
                        <input
                            type='text'
                            placeholder='Search by exam title'
                            value={searchTerm}
                            onChange={(event) => {
                                setSearchTerm(event.target.value)
                                setCurrentPage(1)
                            }}
                            className='w-full bg-transparent text-xs font-normal text-[#7c8493] placeholder:text-[#7c8493] focus:outline-none'
                        />
                        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(103,63,237,0.1)]'>
                            <Search size={16} className='text-[#673fed]' />
                        </div>
                    </div>
                </div>

                <div className='grid gap-4 md:grid-cols-2'>
                    {isLoading ? (
                        <article className='col-span-full rounded-2xl border border-[#e5e7eb] bg-white p-10 text-center'>
                            <p className='text-[16px] text-[#64748b]'>Loading online tests...</p>
                        </article>
                    ) : paginatedExams.length === 0 ? (
                        <article className='col-span-full rounded-2xl border border-[#e5e7eb] bg-white p-10 text-center'>
                            <p className='text-[16px] text-[#64748b]'>No online tests found.</p>
                        </article>
                    ) : (
                        paginatedExams.map((test) => (
                        <article
                            key={test._id}
                            className='rounded-2xl border border-[#e5e7eb] bg-white p-6'
                        >
                            <div className='flex flex-col gap-6'>
                                <div>
                                    <h3 className='mb-4 text-[20px] font-semibold leading-[1.4] text-primary'>
                                        {test.title}
                                    </h3>

                                    <div className='flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px]'>
                                        <div className='flex items-center gap-2 text-primary'>
                                            <Clock3 size={18} className='text-[#94a3b8]' />
                                            <span className='font-normal'>Duration:</span>
                                            <span className='font-medium'>{test.duration} min</span>
                                        </div>

                                        <div className='flex items-center gap-2 text-primary'>
                                            <FileText size={18} className='text-[#94a3b8]' />
                                            <span className='font-normal text-[#64748b]'>Question:</span>
                                            <span className='font-medium'>{getTotalQuestions(test)}</span>
                                        </div>

                                        <div className='flex items-center gap-2 text-primary'>
                                            <CircleX size={18} className='text-[#94a3b8]' />
                                            <span className='font-normal'>Negative Marking:</span>
                                            <span className='font-medium'>
                                                {test.negativeMarking
                                                    ? `-${test.negativeMarkingValue}/wrong`
                                                    : 'No'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type='button'
                                    onClick={() => handleStart(test._id)}
                                    disabled={!test.canTakeNow}
                                    className='w-35 rounded-xl border border-[#6633ff] px-6 py-2.5 text-[14px] font-semibold leading-[1.4] text-[#6633ff] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50'
                                >
                                    {test.canTakeNow ? 'Start' : 'Unavailable'}
                                </button>
                            </div>
                        </article>
                    ))
                    )}
                </div>

                <div className='mt-3 flex items-center justify-between text-[12px] text-[#666666]'>
                    <div className='flex items-center gap-3'>
                        <button
                            type='button'
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className='h-6 w-6 rounded-md border border-[#e5e7eb] text-[#9ca3af]'
                        >
                            &lt;
                        </button>
                        <span className='min-w-4 text-center text-[#111827]'>{currentPage}</span>
                        <button
                            type='button'
                            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className='h-6 w-6 rounded-md border border-[#e5e7eb] text-[#111827]'
                        >
                            &gt;
                        </button>
                    </div>

                    <div className='flex items-center gap-2'>
                        <span>Online Test Per Page</span>
                        <select
                            value={itemsPerPage}
                            onChange={(event) => {
                                setItemsPerPage(Number(event.target.value))
                                setCurrentPage(1)
                            }}
                            className='flex h-6 min-w-8 items-center justify-center rounded-md border border-[#e5e7eb] px-2 text-[#111827]'
                        >
                            <option value={4}>4</option>
                            <option value={8}>8</option>
                            <option value={12}>12</option>
                        </select>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default CandidateDashboard