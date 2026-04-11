import React from 'react'
import { CircleCheck, Trash2, Edit2 } from 'lucide-react'

const getTypeLabel = (type) => {
  if (type === 'radio') return 'Radio'
  if (type === 'checkbox') return 'Checkbox'
  if (type === 'text') return 'Text'
  return type
}

const QuestionsList = ({ questions, onEdit, onDelete }) => {
  return (
    <section className='rounded-[20px] border border-[#e5e7eb] bg-white p-6 md:p-8'>
      <h3 className='mb-6 text-[20px] font-semibold text-[#334155]'>Questions</h3>
      
      {questions.length === 0 ? (
        <div className='py-8 text-center'>
          <p className='text-[16px] text-[#94a3b8]'>No questions added yet</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {questions.map((question, index) => (
            <article key={question.id} className='rounded-[18px] border border-[#e5e7eb] bg-white p-6'>
              <div className='flex items-start justify-between gap-4 border-b border-[#e5e7eb] pb-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full border border-[#cfd8e3] bg-white text-[15px] font-semibold text-[#334155]'>
                    {index + 1}
                  </div>
                  <h4 className='text-[16px] font-semibold text-[#334155]'>Question {index + 1}</h4>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-[13px] font-medium text-[#64748b]'>
                    {getTypeLabel(question.type)}
                  </span>
                  <span className='rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-[13px] font-medium text-[#64748b]'>
                    {question.points} pt
                  </span>
                </div>
              </div>

              <p className='mt-5 mb-5 text-[18px] font-semibold leading-normal text-[#1f2937]'>
                {question.prompt}
              </p>

              {question.type !== 'text' ? (
                <div className='mb-6 space-y-4'>
                  {question.options.map((option) => (
                    <div
                      key={option.id}
                      className={`flex min-h-14 items-center justify-between rounded-lg px-4 py-3 text-[16px] transition-colors ${
                        option.correct ? 'bg-[#f3f4f6]' : 'bg-white'
                      }`}
                    >
                      <div className='flex items-center gap-2 text-[16px] text-[#334155]'>
                        <span className='font-normal'>{option.id}.</span>
                        <span>{option.text}</span>
                      </div>
                      {option.correct && (
                        <CircleCheck size={22} className='text-[#22c55e]' />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className='mb-6'>
                  <p className='text-[16px] leading-[1.75] text-[#475569]'>
                    {question.answerText}
                  </p>
                </div>
              )}

              <div className='flex items-center justify-between border-t border-[#e5e7eb] pt-4'>
                <button
                  type='button'
                  onClick={() => onEdit?.(question.id)}
                  className='text-[14px] font-medium text-[#633CFF] cursor-pointer hover:text-[#5028d9]'
                >
                  Edit
                </button>
                <button
                  type='button'
                  onClick={() => onDelete?.(question.id)}
                  className='text-[14px] font-medium text-[#ef4444] cursor-pointer hover:text-[#dc2626]'
                >
                  Remove From Exam
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default QuestionsList
