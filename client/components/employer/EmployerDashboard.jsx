import React from 'react'
import { CircleGauge, FileText, Search, Users } from 'lucide-react'

const demoEmployerTests = [
    {
        id: 1,
        title: 'Psychometric Test for Management Trainee Officer',
        candidates: '10,000',
        questionSet: '3',
        examSlots: '3',
    },
    {
        id: 2,
        title: 'Psychometric Test for Management Trainee Officer',
        candidates: '10,000',
        questionSet: '3',
        examSlots: '3',
    },
    {
        id: 3,
        title: 'Psychometric Test for Management Trainee Officer',
        candidates: 'Not Set',
        questionSet: 'Not Set',
        examSlots: 'Not Set',
    },
    {
        id: 4,
        title: 'Psychometric Test for Management Trainee Officer',
        candidates: '10,000',
        questionSet: '3',
        examSlots: '3',
    },
]

const EmployerDashboard = () => {
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
                                className='w-full bg-transparent text-xs font-normal text-[#7c8493] placeholder:text-[#7C8493] focus:outline-none'
                            />
                            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(103,63,237,0.1)]'>
                                <Search size={16} className='text-[#673fed]' />
                            </div>
                        </div>

                        <button
                            type='button'
                              className='h-12 rounded-xl bg-linear-to-r from-[#5f2df5] to-[#6438f8] px-5 text-[16px] font-semibold text-white md:min-w-42.5'
                        >
                            Create Online Test
                        </button>
                    </div>
                </div>

                <div className='grid gap-4 md:grid-cols-2'>
                    {demoEmployerTests.map((test) => (
                        <article key={test.id} className='rounded-2xl border border-[#e5e7eb] bg-white p-6'>
                            <div className='flex flex-col gap-6'>
                                <div>
                                    <h3 className='mb-4 text-[20px] font-semibold leading-[1.4] text-primary'>
                                        {test.title}
                                    </h3>

                                    <div className='flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px]'>
                                        <div className='flex items-center gap-2 text-primary'>
                                            <Users size={18} className='text-[#94a3b8]' />
                                            <span className='font-normal text-[#64748b]'>Candidates:</span>
                                            <span className='font-medium'>{test.candidates}</span>
                                        </div>

                                        <div className='flex items-center gap-2 text-primary'>
                                            <FileText size={18} className='text-[#94a3b8]' />
                                            <span className='font-normal text-[#64748b]'>Question Set:</span>
                                            <span className='font-medium'>{test.questionSet}</span>
                                        </div>

                                        <div className='flex items-center gap-2 text-primary'>
                                            <CircleGauge size={18} className='text-[#94a3b8]' />
                                            <span className='font-normal text-[#64748b]'>Exam Slots:</span>
                                            <span className='font-medium'>{test.examSlots}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type='button'
                                      className='max-w-max rounded-xl border border-[#6633ff] px-6 py-2.5 text-[14px] font-semibold leading-[1.4] text-[#6633ff]'
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
                            className='h-6 w-6 rounded-md border border-[#e5e7eb] text-[#9ca3af]'
                        >
                            &lt;
                        </button>
                        <span className='min-w-4 text-center text-[#111827]'>1</span>
                        <button
                            type='button'
                            className='h-6 w-6 rounded-md border border-[#e5e7eb] text-[#111827]'
                        >
                            &gt;
                        </button>
                    </div>

                    <div className='flex items-center gap-2'>
                        <span>Online Test Per Page</span>
                        <button
                            type='button'
                            className='flex h-6 min-w-8 items-center justify-center rounded-md border border-[#e5e7eb] px-2 text-[#111827]'
                        >
                            8 ^
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default EmployerDashboard