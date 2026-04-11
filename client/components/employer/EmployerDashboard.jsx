'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { CircleGauge, FileText, Search, Users } from 'lucide-react'
import examService from '@/services/examService'
import ViewCandidatesModal from './ViewCandidatesModal'

const EmployerDashboard = () => {
    const router = useRouter()
    const [exams, setExams] = useState([])
    const [filteredExams, setFilteredExams] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(8)
    const [selectedExam, setSelectedExam] = useState(null)
    const [showCandidatesModal, setShowCandidatesModal] = useState(false)

    // Fetch exams on component mount
    useEffect(() => {
        fetchExams()
    }, [])

    // Filter exams based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredExams(exams)
        } else {
            const filtered = exams.filter((exam) =>
                exam.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredExams(filtered)
            setCurrentPage(1) // Reset to first page on search
        }
    }, [searchTerm, exams])

    const fetchExams = async () => {
        setIsLoading(true)
        try {
            const response = await examService.getEmployerExams()
            const examsData = response?.data || response?.exams || []
            setExams(Array.isArray(examsData) ? examsData : [])
            setFilteredExams(Array.isArray(examsData) ? examsData : [])
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to fetch exams'
            toast.error(message)
            setExams([])
            setFilteredExams([])
        } finally {
            setIsLoading(false)
        }
    }

    const totalPages = Math.ceil(filteredExams.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedExams = filteredExams.slice(startIndex, startIndex + itemsPerPage)

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const handleCreateTest = () => {
        router.push('/create-exam')
    }

    const handleViewCandidates = (exam) => {
        setSelectedExam(exam)
        setShowCandidatesModal(true)
    }

    if (isLoading) {
        return (
            <main className='bg-[#f8f8f8] px-4 pb-10 pt-8 md:px-8 md:pb-14 md:pt-14'>
                <div className='mx-auto max-w-7xl'>
                    <div className='flex items-center justify-center py-20'>
                        <div className='text-center'>
                            <div className='mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#633CFF] mx-auto' />
                            <p className='text-[16px] text-[#64748b]'>Loading exams...</p>
                        </div>
                    </div>
                </div>
            </main>
        )
    }
    return (
        <main className='bg-[#f8f8f8] px-4 pb-10 pt-8 md:px-8 md:pb-14 md:pt-14'>
            <div className='mx-auto max-w-7xl'>
                <div className='mb-4 flex flex-col gap-3 md:mb-5 md:flex-row md:items-center md:justify-between'>
                    <h2 className='text-[24px] font-semibold leading-[1.3] text-primary'>
                        Online Tests
                    </h2>

                    <div className='flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center'>
                        <div className='flex h-12 w-full items-center justify-between rounded-lg border border-[#a086f7] bg-white px-3 shadow-[2px_2px_6px_0px_rgba(73,123,241,0.24)] md:w-155.25'>
                            <input
                                type='text'
                                placeholder='Search by exam title'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-full bg-transparent text-xs font-normal text-[#7c8493] placeholder:text-[#7C8493] focus:outline-none'
                            />
                            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(103,63,237,0.1)]'>
                                <Search size={16} className='text-[#673fed]' />
                            </div>
                        </div>

                        <button
                            type='button'
                            onClick={handleCreateTest}
                            className='h-12 rounded-xl bg-linear-to-r from-[#5f2df5] to-[#6438f8] px-5 text-[16px] font-semibold text-white md:min-w-42.5 cursor-pointer'
                        >
                            Create Online Test
                        </button>
                    </div>
                </div>

                {paginatedExams.length > 0 ? (
                    <>
                        <div className='grid gap-4 md:grid-cols-2'>
                            {paginatedExams.map((exam) => (
                                <article key={exam._id} className='rounded-2xl border border-[#e5e7eb] bg-white p-6'>
                                    <div className='flex flex-col gap-6'>
                                        <div>
                                            <h3 className='mb-4 text-[20px] font-semibold leading-[1.4] text-primary'>
                                                {exam.title}
                                            </h3>

                                            <div className='flex flex-wrap justify-between items-center gap-x-7 gap-y-2 text-[14px]'>
                                                <div className='flex items-center gap-2 text-primary'>
                                                    <Users size={18} className='text-[#94a3b8]' />
                                                    <span className='font-normal text-[#64748b]'>Candidates:</span>
                                                    <span className='font-medium'>{exam.totalCandidates || 'Not Set'}</span>
                                                </div>

                                                <div className='flex items-center gap-2 text-primary'>
                                                    <FileText size={18} className='text-[#94a3b8]' />
                                                    <span className='font-normal text-[#64748b]'>Question Set:</span>
                                                    <span className='font-medium'>{exam.totalSlots || 'Not Set'}</span>
                                                </div>

                                                <div className='flex items-center gap-2 text-primary'>
                                                    <CircleGauge size={18} className='text-[#94a3b8]' />
                                                    <span className='font-normal text-[#64748b]'>Exam Slots:</span>
                                                    <span className='font-medium'>
                                                        {exam.availableSlots ?? exam.totalSlots ?? 'Not Set'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type='button'
                                            onClick={() => handleViewCandidates(exam)}
                                            className='max-w-max rounded-xl border border-[#6633ff] px-6 py-2.5 text-[14px] font-semibold leading-[1.4] text-[#6633ff] cursor-pointer'
                                        >
                                            View Candidates
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className='mt-3 flex items-center justify-between text-[12px] text-[#666666]'>
                            <div className='flex items-center gap-3'>
                                <button
                                    type='button'
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    className='h-6 w-6 rounded-md border border-[#e5e7eb] text-[#9ca3af] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                                >
                                    &lt;
                                </button>
                                <span className='min-w-4 text-center text-[#111827]'>{currentPage}</span>
                                <button
                                    type='button'
                                    onClick={handleNextPage}
                                    disabled={currentPage >= totalPages}
                                    className='h-6 w-6 rounded-md border border-[#e5e7eb] text-[#111827] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                                >
                                    &gt;
                                </button>
                            </div>

                            <div className='flex items-center gap-2'>
                                <span>Online Test Per Page</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value))
                                        setCurrentPage(1)
                                    }}
                                    className='flex h-6 min-w-8 items-center justify-center rounded-md border border-[#e5e7eb] px-2 text-[#111827] cursor-pointer'
                                >
                                    <option value={4}>4</option>
                                    <option value={8}>8</option>
                                    <option value={12}>12</option>
                                    <option value={16}>16</option>
                                </select>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className='rounded-2xl border border-[#e5e7eb] bg-white p-12'>
                        <div className='text-center'>
                            <p className='mb-4 text-[16px] text-[#64748b]'>No exams found</p>
                            <button
                                type='button'
                                onClick={handleCreateTest}
                                className='inline-block rounded-xl bg-linear-to-r from-[#5f2df5] to-[#6438f8] px-6 py-3 text-[16px] font-semibold text-white cursor-pointer'
                            >
                                Create Your First Exam
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <ViewCandidatesModal
                open={showCandidatesModal}
                onClose={() => setShowCandidatesModal(false)}
                examId={selectedExam?._id}
                examTitle={selectedExam?.title}
            />
        </main>
    )
}

export default EmployerDashboard