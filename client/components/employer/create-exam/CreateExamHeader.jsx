import React from 'react'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

const StepDot = ({ done, active, number }) => {
  if (done) {
    return (
      <span className='flex h-5 w-5 items-center justify-center rounded-full bg-[#633CFF] text-white'>
        <Check size={12} />
      </span>
    )
  }

  return (
    <span
      className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${
        active ? 'bg-[#633CFF] text-white' : 'bg-[#c8ced8] text-white'
      }`}
    >
      {number}
    </span>
  )
}

const CreateExamHeader = ({ step, basicInfoCompleted }) => {
  const router = useRouter()
  const questionsActive = step === 2

  return (
    <section className='rounded-2xl border border-[#e6e9ef] bg-white p-5 md:p-6'>
      <div className='mb-5 flex items-center justify-between'>
        <h1 className='text-[20px] font-semibold leading-[1.3] text-primary'>
          Manage Online Test
        </h1>
        <button
          type='button'
          onClick={() => router.push('/')}
          className='h-11 rounded-xl border border-[#d8dee8] px-6 text-[14px] font-semibold text-primary cursor-pointer'
        >
          Back to Dashboard
        </button>
      </div>

      <div className='flex items-center gap-3 text-[14px] font-medium text-[#64748b]'>
        <div className='flex items-center gap-2'>
          <StepDot done={basicInfoCompleted} active={step === 1} number={1} />
          <span className={step === 1 ? 'text-[#633CFF]' : ''}>Basic Info</span>
        </div>

        <span className='h-px w-14 bg-[#8792a2]' />

        <div className='flex items-center gap-2'>
          <StepDot done={step === 2 && basicInfoCompleted} active={questionsActive} number={2} />
          <span className={questionsActive ? 'text-[#633CFF]' : ''}>Questions Sets</span>
        </div>
      </div>
    </section>
  )
}

export default CreateExamHeader
