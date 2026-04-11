import React from 'react'
import { CircleCheck, XCircle } from 'lucide-react'

const getTypeLabel = (type) => {
  if (type === 'radio') return 'MCQ'
  if (type === 'checkbox') return 'Checkbox'
  if (type === 'text') return 'Text'
  return type
}

const QuestionsList = ({ questions }) => {
  return (
    <section className='rounded-2xl border border-[#eceff4] bg-white p-5 md:p-6'>
      {questions.map((question, index) => (
        <article key={question.id} className='border-b border-[#eceff4] py-5 last:border-b-0'>
          <div className='mb-3 flex items-center justify-between'>
            <h3 className='text-[16px] font-semibold text-primary'>Question {index + 1}</h3>
            <div className='flex items-center gap-2'>
              <span className='rounded-full border border-[#d8dee8] px-3 py-0.5 text-[14px] text-[#94a3b8]'>
                {getTypeLabel(question.type)}
              </span>
              <span className='rounded-full border border-[#d8dee8] px-3 py-0.5 text-[14px] text-[#94a3b8]'>
                {question.points} pt
              </span>
            </div>
          </div>

          <p className='mb-4 text-[16px] font-semibold text-[#2E2E2F]'>{question.prompt}</p>

          {question.type !== 'text' ? (
            <div className='space-y-3'>
              {question.options.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center justify-between rounded-md px-3 py-2 text-[18px] ${
                    option.correct ? 'bg-[#f4f6f9]' : ''
                  }`}
                >
                  <span>
                    {option.id}. {option.text}
                  </span>
                  {option.correct && <CircleCheck size={18} className='text-[#22c55e]' />}
                </div>
              ))}
            </div>
          ) : (
            <p className='text-[14px] leading-normal text-[#64748b]'>{question.answerText}</p>
          )}

          <div className='mt-4 flex items-center justify-between text-[14px] font-medium'>
            <button type='button' className='text-[#633CFF]'>
              Edit
            </button>
            <button type='button' className='inline-flex items-center gap-1 text-[#ef4444]'>
              <XCircle size={16} /> Remove From Exam
            </button>
          </div>
        </article>
      ))}
    </section>
  )
}

export default QuestionsList
