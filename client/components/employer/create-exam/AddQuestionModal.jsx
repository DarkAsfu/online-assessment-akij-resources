import React, { useMemo, useState } from 'react'
import { X } from 'lucide-react'

const baseInputClass =
  'w-full rounded-lg border border-[#d8dee8] bg-white px-4 py-2.5 text-[16px] text-primary placeholder:text-[#94a3b8] focus:outline-none'

const AddQuestionModal = ({ open, onClose, onSave }) => {
  const [type, setType] = useState('radio')
  const [points, setPoints] = useState('1')
  const [prompt, setPrompt] = useState('')
  const [optionA, setOptionA] = useState('')
  const [optionB, setOptionB] = useState('')
  const [optionC, setOptionC] = useState('')
  const [optionD, setOptionD] = useState('')
  const [correctAnswers, setCorrectAnswers] = useState([])
  const [answerText, setAnswerText] = useState('')

  const isOptionBased = useMemo(() => type === 'radio' || type === 'checkbox', [type])

  if (!open) return null

  const toggleCorrect = (id) => {
    if (type === 'radio') {
      setCorrectAnswers([id])
      return
    }

    setCorrectAnswers((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const resetForm = () => {
    setType('radio')
    setPoints('1')
    setPrompt('')
    setOptionA('')
    setOptionB('')
    setOptionC('')
    setOptionD('')
    setCorrectAnswers([])
    setAnswerText('')
  }

  const buildQuestionPayload = () => {
    if (!prompt.trim()) return

    const question = {
      id: Date.now(),
      type,
      points: Number(points) || 1,
      prompt,
      options: [],
      answerText: '',
    }

    if (isOptionBased) {
      const options = [
        { id: 'A', text: optionA.trim() },
        { id: 'B', text: optionB.trim() },
        { id: 'C', text: optionC.trim() },
        { id: 'D', text: optionD.trim() },
      ].map((option) => ({
        ...option,
        correct: correctAnswers.includes(option.id),
      }))

      if (options.some((option) => !option.text)) return
      if (correctAnswers.length === 0) return

      question.options = options
    } else {
      if (!answerText.trim()) return
      question.answerText = answerText.trim()
    }

    return question
  }

  const handleSave = () => {
    const question = buildQuestionPayload()
    if (!question) return
    onSave(question)
    resetForm()
    onClose()
  }

  const handleSaveAndAddMore = () => {
    const question = buildQuestionPayload()
    if (!question) return
    onSave(question)
    resetForm()
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4'>
      <div className='w-full max-w-3xl rounded-2xl bg-white p-5 md:p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-[24px] font-semibold text-primary'>Add Question</h3>
          <button type='button' onClick={onClose} className='text-[#64748b] cursor-pointer'>
            <X size={22} />
          </button>
        </div>

        <div className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <div>
              <label className='mb-2 block text-[16px] font-medium text-primary'>Question Type</label>
              <select
                value={type}
                onChange={(event) => {
                  setType(event.target.value)
                  setCorrectAnswers([])
                }}
                className={baseInputClass}
              >
                <option value='radio'>MCQ</option>
                <option value='checkbox'>Checkbox</option>
                <option value='text'>Text</option>
              </select>
            </div>

            <div>
              <label className='mb-2 block text-[16px] font-medium text-primary'>Points</label>
              <input
                type='number'
                min='1'
                value={points}
                onChange={(event) => setPoints(event.target.value)}
                className={baseInputClass}
              />
            </div>
          </div>

          <div>
            <label className='mb-2 block text-[16px] font-medium text-primary'>Question</label>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              className={`${baseInputClass} min-h-24`}
              placeholder='Write question'
            />
          </div>

          {isOptionBased ? (
            <div className='grid gap-3'>
              {[
                { id: 'A', value: optionA, setValue: setOptionA },
                { id: 'B', value: optionB, setValue: setOptionB },
                { id: 'C', value: optionC, setValue: setOptionC },
                { id: 'D', value: optionD, setValue: setOptionD },
              ].map((item) => (
                <div key={item.id} className='flex items-center gap-2'>
                  <input
                    type={type === 'radio' ? 'radio' : 'checkbox'}
                    checked={correctAnswers.includes(item.id)}
                    onChange={() => toggleCorrect(item.id)}
                  />
                  <input
                    value={item.value}
                    onChange={(event) => item.setValue(event.target.value)}
                    className={baseInputClass}
                    placeholder={`Option ${item.id}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div>
              <label className='mb-2 block text-[16px] font-medium text-primary'>Answer</label>
              <textarea
                value={answerText}
                onChange={(event) => setAnswerText(event.target.value)}
                className={`${baseInputClass} min-h-24`}
                placeholder='Write sample answer'
              />
            </div>
          )}
        </div>

        <div className='mt-5 flex items-center justify-end gap-3'>
          <button
            type='button'
            onClick={handleSave}
            className='h-11 rounded-lg bg-linear-to-r from-[#5f2df5] to-[#6438f8] px-5 text-[16px] font-semibold text-white cursor-pointer'
          >
            Save
          </button>
          <button
            type='button'
            onClick={handleSaveAndAddMore}
            className='h-11 rounded-lg border border-[#633CFF] px-5 text-[16px] font-semibold text-[#633CFF] cursor-pointer'
          >
            Save and Add More
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddQuestionModal
