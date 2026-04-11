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

    const handleOpenExam = (exam) => {
        router.push(`/create-exam?examId=${exam._id}`)
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
                                <article
                                    key={exam._id}
                                    role='button'
                                    tabIndex={0}
                                    onClick={() => handleOpenExam(exam)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault()
                                            handleOpenExam(exam)
                                        }
                                    }}
                                    className='cursor-pointer rounded-2xl border border-[#e5e7eb] bg-white p-6 transition-shadow hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)]'
                                >
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

                                        <div className='flex flex-wrap gap-3'>
                                            <button
                                                type='button'
                                                onClick={(event) => {
                                                    event.stopPropagation()
                                                    handleViewCandidates(exam)
                                                }}
                                                className='max-w-max rounded-xl border border-[#6633ff] px-6 py-2.5 text-[14px] font-semibold leading-[1.4] text-[#6633ff] cursor-pointer'
                                            >
                                                View Candidates
                                            </button>
                                        </div>
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
                    <div className='rounded-2xl border border-[#e5e7eb] bg-white p-6 md:p-8'>
                        <div className='flex min-h-65 flex-col items-center justify-center gap-5 text-center'>
                            <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120' fill='none' className='h-30 w-30'>
                                <g clipPath='url(#clip0_1_8526)'>
                                    <path d='M120 44.6686V112.53H28.7496C27.2212 112.53 25.9849 111.292 25.9849 109.766V35.3199C25.9849 33.7915 27.2212 32.5552 28.7496 32.5552H62.2771C63.0086 32.5552 63.7113 32.8449 64.2304 33.364L71.9615 41.0951C72.4806 41.6142 73.1833 41.9039 73.9171 41.9039H117.235C118.762 41.9042 120 43.1428 120 44.6686Z' fill='#756F6F' />
                                    <path d='M75.9528 55.3832C79.6749 55.3832 82.6923 52.3658 82.6923 48.6437C82.6923 44.9217 79.6749 41.9043 75.9528 41.9043C72.2307 41.9043 69.2134 44.9217 69.2134 48.6437C69.2134 52.3658 72.2307 55.3832 75.9528 55.3832Z' fill='#5B5555' />
                                    <path d='M51.2137 64.5521C52.4306 65.7666 51.5711 67.8478 49.8496 67.8478H28.5684C27.6967 67.8478 26.8347 67.8042 25.9849 67.7222V35.3199C25.9849 33.7915 27.2212 32.5552 28.7496 32.5552H52.776C53.8963 35.4549 54.5121 38.6084 54.5121 41.9042C54.5121 49.0681 51.6074 55.5532 46.9136 60.2494L51.2137 64.5521Z' fill='#5B5555' />
                                    <path d='M120 44.6685V112.53H110.82V44.6685C110.82 43.1425 109.584 41.9038 108.055 41.9038H117.235C118.761 41.904 120 43.1427 120 44.6685Z' fill='#5B5555' />
                                    <path d='M91.8046 77.863L120 112.531H27.2985C26.4665 112.531 25.679 112.156 25.154 111.511L0.624974 81.3512C-0.844088 79.5449 0.441225 76.8428 2.76951 76.8428H89.6598C90.4921 76.8428 91.2798 77.2175 91.8046 77.863Z' fill='#64B9FC' />
                                    <path d='M120 112.53H108.111L79.9175 77.8632C79.3911 77.2184 78.6041 76.8418 77.7734 76.8418H89.66C90.493 76.8418 91.28 77.2184 91.8041 77.8632L120 112.53Z' fill='#31A7FB' />
                                    <path d='M99.006 104.399H74.6153C73.8613 104.399 73.1507 104.047 72.6939 103.447L66.4431 95.2337C65.8382 94.4389 66.4052 93.2954 67.4038 93.2954H91.7945C92.5485 93.2954 93.2591 93.6477 93.7159 94.2477L99.9667 102.461C100.572 103.255 100.005 104.399 99.006 104.399Z' fill='#F8F3F1' />
                                    <path d='M99.0064 104.398H91.1593C92.1589 104.398 92.7264 103.256 92.1203 102.46L85.8692 94.2481C85.4129 93.6469 84.703 93.2944 83.9497 93.2944H91.7945C92.5501 93.2944 93.26 93.6469 93.7164 94.2481L99.9674 102.46C100.571 103.257 100.006 104.398 99.0064 104.398Z' fill='#EFE2DD' />
                                    <path d='M60 106.209H48.9206C47.9206 106.209 47.1099 105.399 47.1099 104.399C47.1099 103.399 47.9206 102.588 48.9206 102.588H60C61.0001 102.588 61.8108 103.399 61.8108 104.399C61.8108 105.399 61.0001 106.209 60 106.209Z' fill='#F8F3F1' />
                                    <path d='M55.9569 100.203H51.2541C50.2541 100.203 49.4434 99.3924 49.4434 98.3923C49.4434 97.3922 50.2541 96.5815 51.2541 96.5815H55.9569C56.957 96.5815 57.7677 97.3922 57.7677 98.3923C57.7679 99.3924 56.9572 100.203 55.9569 100.203Z' fill='#F8F3F1' />
                                    <path d='M54.5119 33.4124C54.5119 19.0841 42.8965 7.46875 28.5684 7.46875C14.2535 7.46875 2.62451 19.0977 2.62451 33.4127C2.62475 47.7409 14.2399 59.3561 28.5682 59.3561H49.8494C51.57 59.3561 52.4318 57.2758 51.2151 56.0591L46.9132 51.7572C51.6082 47.0627 54.5119 40.5766 54.5119 33.4124Z' fill='#31A7FB' />
                                    <path d='M51.2141 56.0602C52.431 57.2771 51.5715 59.356 49.85 59.356H41.0999C42.819 59.356 43.681 57.2771 42.4639 56.0602L39.7963 53.3911C38.9089 52.5033 38.8527 51.0863 39.6617 50.1265C43.4675 45.6124 45.7621 39.7793 45.7621 33.4123C45.7621 20.577 36.4398 9.9169 24.1958 7.83799C25.3806 7.63479 26.5923 7.51385 27.8253 7.47893C42.3343 7.07018 54.267 18.4575 54.5085 32.9703C54.6306 40.3088 51.7037 46.9671 46.9138 51.7573L51.2141 56.0602Z' fill='#1C96F9' />
                                    <path d='M33.6898 33.4127L38.5158 28.5867C39.9303 27.1722 39.9303 24.8791 38.5158 23.4649C37.1016 22.0504 34.8082 22.0504 33.394 23.4649L28.568 28.2909L23.7422 23.4646C22.328 22.0502 20.0346 22.0502 18.6204 23.4646C17.206 24.8789 17.206 27.172 18.6204 28.5864L23.4464 33.4125L18.6204 38.2385C17.206 39.6529 17.206 41.9461 18.6204 43.3603C19.3275 44.0676 20.2545 44.4211 21.1814 44.4211C22.1084 44.4211 23.0351 44.0674 23.7424 43.3603L28.5685 38.5343L33.3945 43.3603C34.1018 44.0676 35.0283 44.4211 35.9555 44.4211C36.8822 44.4211 37.8092 44.0674 38.5165 43.3603C39.931 41.9461 39.931 39.6529 38.5165 38.2385L33.6898 33.4127Z' fill='#F8F3F1' />
                                    <path d='M75.9528 49.6781C79.6749 49.6781 82.6923 46.6608 82.6923 42.9387C82.6923 39.2166 79.6749 36.1992 75.9528 36.1992C72.2307 36.1992 69.2134 39.2166 69.2134 42.9387C69.2134 46.6608 72.2307 49.6781 75.9528 49.6781Z' fill='#BCEA73' />
                                    <path d='M82.692 42.9382C82.692 46.6617 79.6737 49.68 75.9533 49.68C74.7059 49.68 73.5357 49.3411 72.5347 48.7467C75.1803 48.1369 77.1514 45.7685 77.1514 42.9382C77.1514 40.111 75.1833 37.7396 72.5377 37.1297C73.5387 36.5384 74.7059 36.1997 75.9533 36.1997C79.674 36.1995 82.692 39.2178 82.692 42.9382Z' fill='#99D53B' />
                                    <path d='M99.5557 34.8581C102.493 34.8581 104.874 32.4769 104.874 29.5396C104.874 26.6023 102.493 24.2212 99.5557 24.2212C96.6184 24.2212 94.2373 26.6023 94.2373 29.5396C94.2373 32.4769 96.6184 34.8581 99.5557 34.8581Z' fill='#BCEA73' />
                                    <path d='M104.874 29.5392C104.874 32.4775 102.492 34.8592 99.5558 34.8592C98.5714 34.8592 97.648 34.5918 96.8579 34.1228C98.9457 33.6417 100.501 31.7725 100.501 29.5392C100.501 27.3079 98.9481 25.4367 96.8602 24.9553C97.6501 24.4886 98.5712 24.2212 99.5556 24.2212C102.492 24.2212 104.874 26.6031 104.874 29.5392Z' fill='#99D53B' />
                                    <path d='M87.4032 19.8188L88.3829 18.8391C89.0903 18.1317 89.0903 16.9854 88.3829 16.2781C87.6758 15.571 86.5292 15.571 85.8219 16.2781L84.8422 17.2578L83.8625 16.2781C83.1554 15.5707 82.0088 15.5707 81.3015 16.2781C80.5942 16.9852 80.5942 18.1317 81.3015 18.8391L82.2812 19.8188L81.3015 20.7985C80.5942 21.5058 80.5942 22.6521 81.3015 23.3595C81.6552 23.7131 82.1185 23.8899 82.5819 23.8899C83.0453 23.8899 83.5089 23.7129 83.8623 23.3595L84.842 22.3798L85.8217 23.3595C86.1753 23.7131 86.6387 23.8899 87.1021 23.8899C87.5654 23.8899 88.029 23.7129 88.3824 23.3595C89.0898 22.6524 89.0898 21.5058 88.3824 20.7985L87.4032 19.8188Z' fill='#64B9FC' />
                                    <path d='M13.5587 60.9293C12.8516 60.2221 11.7051 60.2221 10.9977 60.9293L9.29193 62.635L7.58615 60.9293C6.87904 60.2221 5.73248 60.2221 5.02514 60.9293C4.31779 61.6364 4.31779 62.7829 5.02514 63.4903L6.73092 65.1961L5.02514 66.9018C4.31779 67.6089 4.31779 68.7555 5.02514 69.4629C5.37881 69.8165 5.84217 69.9932 6.30553 69.9932C6.76889 69.9932 7.23248 69.8163 7.58592 69.4629L9.2917 67.7571L10.9975 69.4629C11.3512 69.8165 11.8145 69.9932 12.2779 69.9932C12.7412 69.9932 13.2048 69.8163 13.5583 69.4629C14.2656 68.7557 14.2656 67.6092 13.5583 66.9018L11.8525 65.1961L13.5583 63.4903C14.2658 62.7829 14.2658 61.6364 13.5587 60.9293Z' fill='#A8E7EF' />
                                </g>
                                <defs>
                                    <clipPath id='clip0_1_8526'>
                                        <rect width='120' height='120' fill='white' />
                                    </clipPath>
                                </defs>
                            </svg>
                            <div className='space-y-3'>
                                <p className='text-[20px] font-semibold leading-[1.4] text-[#334155]'>
                                    No Online Test Available
                                </p>
                                <p className='max-w-150 text-[14px] leading-[1.4] text-[#64748b]'>
                                    Currently, there are no online tests available. Please check back later for updates.
                                </p>
                            </div>
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