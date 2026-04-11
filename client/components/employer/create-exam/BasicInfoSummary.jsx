import React from 'react'
import { Pencil } from 'lucide-react'

const SummaryItem = ({ label, value }) => (
  <div>
    <p className='mb-1 text-[14px] font-normal text-[#64748b]'>{label}</p>
    <p className='text-[16px] font-medium leading-[1.3] text-primary'>{value}</p>
  </div>
)

const BasicInfoSummary = ({ data, onEdit }) => {
  return (
    <section className='rounded-2xl border border-[#eceff4] bg-white p-5 md:p-6'>
      <div className='mb-5 flex items-center justify-between'>
        <h2 className='text-[20px] font-semibold leading-[1.3] text-primary'>
          Basic Information
        </h2>
        <button
          type='button'
          onClick={onEdit}
          className='inline-flex items-center gap-1 text-[14px] font-medium text-[#633CFF]'
        >
          <Pencil size={18} /> Edit
        </button>
      </div>

      <div className='mb-4'>
        <p className='mb-1 text-[14px] font-normal text-[#64748b]'>Online Test Title</p>
        <p className='text-[16px] font-medium leading-[1.3] text-primary'>{data.title}</p>
      </div>

      <div className='grid gap-4 md:grid-cols-4'>
        <SummaryItem label='Total Candidates' value={data.totalCandidates} />
        <SummaryItem label='Total Slots' value={data.totalSlots} />
        <SummaryItem label='Total Question Set' value={data.totalQuestionSet} />
        <SummaryItem label='Duration Per Slots (Minutes)' value={data.durationPerSlot} />
      </div>

      <div className='mt-4 grid gap-4 md:grid-cols-2'>
        <SummaryItem label='Question Type' value={data.questionType} />
        <SummaryItem 
          label='Negative Marking' 
          value={data.negativeMarking === 'yes' ? `Yes (${data.negativeMarkingValue} per wrong)` : 'No'} 
        />
      </div>
    </section>
  )
}

export default BasicInfoSummary
