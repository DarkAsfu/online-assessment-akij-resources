import React from 'react'
import { ChevronDown, Clock3 } from 'lucide-react'

const labelClass = 'mb-2 block text-[16px] font-medium text-primary'
const inputClass =
  'h-14 w-full rounded-xl border border-[#d8dee8] bg-white px-4 text-[14px] text-[#334155] placeholder:text-[#94a3b8] focus:outline-none'

const datetimeStyle = `
  input::-webkit-calendar-picker-indicator {
    display: none;
  }
  input[type="datetime-local"]::-webkit-calendar-picker-indicator {
    display: none !important;
  }
`

const BasicInfoForm = ({ formData, onChange }) => {
  const handleInputChange = (event) => {
    const { name, value } = event.target
    onChange(name, value)
  }

  return (
    <>
      <style>{datetimeStyle}</style>
      <section className='rounded-2xl border border-[#eceff4] bg-white p-5 md:p-6 max-w-226.5 mx-auto'>
      <h2 className='mb-5 text-[20px] font-semibold leading-[1.3] text-primary'>
        Basic Information
      </h2>

      <div className='space-y-4 '>
        <div>
          <label className={labelClass}>Online Test Title *</label>
          <input
            name='title'
            className={inputClass}
            placeholder='Enter online test title'
            value={formData.title}
            onChange={handleInputChange}
          />
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <div>
            <label className={labelClass}>Total Candidates *</label>
            <input
              name='totalCandidates'
              type='number'
              min='1'
              className={inputClass}
              placeholder='Enter total candidates'
              value={formData.totalCandidates}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className={labelClass}>Total Slots *</label>
            <div className='relative'>
              <select
                name='totalSlots'
                className={`${inputClass} appearance-none`}
                value={formData.totalSlots}
                onChange={handleInputChange}
              >
                <option value=''>Select total slots</option>
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='3'>3</option>
                <option value='4'>4</option>
                <option value='5'>5</option>
              </select>
              <ChevronDown className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8]' size={20} />
            </div>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <div>
            <label className={labelClass}>Total Question Set *</label>
            <div className='relative'>
              <select
                name='totalQuestionSet'
                className={`${inputClass} appearance-none`}
                value={formData.totalQuestionSet}
                onChange={handleInputChange}
              >
                <option value=''>Select total question set</option>
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='3'>3</option>
                <option value='4'>4</option>
              </select>
              <ChevronDown className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8]' size={20} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Question Type *</label>
            <div className='relative'>
              <select
                name='questionType'
                className={`${inputClass} appearance-none`}
                value={formData.questionType}
                onChange={handleInputChange}
              >
                <option value=''>Select question type</option>
                <option value='mixed'>Mixed</option>
                <option value='radio'>MCQ (Single)</option>
                <option value='checkbox'>Checkbox (Multiple)</option>
                <option value='text'>Text</option>
              </select>
              <ChevronDown className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8]' size={20} />
            </div>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-3'>
          <div>
            <label className={labelClass}>Start Time *</label>
            <div className='relative'>
              <input
                name='startTime'
                type='datetime-local'
                className={inputClass}
                placeholder='Enter start time'
                value={formData.startTime}
                onChange={handleInputChange}
              />
              <Clock3 className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8]' size={20} />
            </div>
          </div>
          <div>
            <label className={labelClass}>End Time *</label>
            <div className='relative'>
              <input
                name='endTime'
                type='datetime-local'
                className={inputClass}
                placeholder='Enter end time'
                value={formData.endTime}
                onChange={handleInputChange}
              />
              <Clock3 className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8]' size={20} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Duration (minutes)</label>
            <input
              name='durationPerSlot'
              type='number'
              min='1'
              className={inputClass}
              placeholder='Duration Time'
              value={formData.durationPerSlot}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <div>
            <label className={labelClass}>Negative Marking</label>
            <div className='relative'>
              <select
                name='negativeMarking'
                className={`${inputClass} appearance-none`}
                value={formData.negativeMarking || 'no'}
                onChange={handleInputChange}
              >
                <option value='no'>No</option>
                <option value='yes'>Yes</option>
              </select>
              <ChevronDown className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8]' size={20} />
            </div>
          </div>
          {formData.negativeMarking === 'yes' && (
            <div>
              <label className={labelClass}>Negative Marking Value</label>
              <input
                name='negativeMarkingValue'
                type='number'
                min='0'
                step='0.5'
                className={inputClass}
                placeholder='e.g., 0.5'
                value={formData.negativeMarkingValue || ''}
                onChange={handleInputChange}
              />
            </div>
          )}
        </div>
      </div>
    </section>
    </>
  )
}

export default BasicInfoForm
