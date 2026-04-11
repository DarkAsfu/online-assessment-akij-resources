import React, { useMemo, useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import RichTextEditor from '@/components/common/RichTextEditor'

const sanitizeEditorText = (value = '') =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const AddQuestionModal = ({ open, onClose, onSave, onSaveAndAddMore }) => {
  const [type, setType] = useState('radio')
  const [points, setPoints] = useState('1')
  const [prompt, setPrompt] = useState('')
  const [numberOfOptions, setNumberOfOptions] = useState(3)
  const [options, setOptions] = useState({ A: '', B: '', C: '' })
  const [correctAnswers, setCorrectAnswers] = useState([])
  const [answerText, setAnswerText] = useState('')

  const isOptionBased = useMemo(() => type === 'radio' || type === 'checkbox', [type])
  const optionIds = useMemo(() => Array.from({ length: numberOfOptions }, (_, i) => String.fromCharCode(65 + i)), [numberOfOptions])

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

  const updateOption = (id, value) => {
    setOptions((prev) => ({ ...prev, [id]: value }))
  }

  const resetForm = () => {
    setType('radio')
    setPoints('1')
    setPrompt('')
    setNumberOfOptions(3)
    setOptions({ A: '', B: '', C: '' })
    setCorrectAnswers([])
    setAnswerText('')
  }

  const buildQuestionPayload = () => {
    const promptText = sanitizeEditorText(prompt)
    if (!promptText) return

    const question = {
      id: Date.now(),
      type,
      points: Number(points) || 1,
      prompt: promptText,
      options: [],
      answerText: '',
    }

    if (isOptionBased) {
      const optionsList = optionIds.map((id) => ({
        id,
        text: sanitizeEditorText(options[id] || ''),
        correct: correctAnswers.includes(id),
      }))

      if (optionsList.some((option) => !option.text)) return
      if (correctAnswers.length === 0) return

      question.options = optionsList
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
    if (onSaveAndAddMore) {
      onSaveAndAddMore(question)
    } else {
      onSave(question)
    }
    resetForm()
  }

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto bg-black/40 px-4 py-6'>
      <div className='mx-auto w-full max-w-4xl rounded-2xl bg-white p-6 md:p-8'>
        {/* Header */}
        <div className='mb-6 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#334155] bg-white text-[16px] font-semibold text-[#334155]'>
              1
            </div>
            <h3 className='text-[24px] font-semibold text-[#334155]'>Question 1</h3>
          </div>
          <button type='button' onClick={onClose} className='cursor-pointer text-[#64748b]'>
            <X size={24} />
          </button>
        </div>

        {/* Score and Type */}
        <div className='mb-6 flex items-center justify-between border-b border-[#e5e7eb] pb-4'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <span className='text-[14px] font-medium text-[#64748b]'>Score:</span>
              <input
                type='number'
                min='1'
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className='w-16 rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5 text-center text-[14px] text-[#334155] focus:outline-none'
              />
            </div>
          </div>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value)
              setCorrectAnswers([])
            }}
            className='rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5 text-[14px] font-medium text-[#334155] cursor-pointer focus:outline-none'
          >
            <option value='radio'>Radio</option>
            <option value='checkbox'>Checkbox</option>
            <option value='text'>Text</option>
          </select>
        </div>

        {/* Question Prompt with Toolbar */}
        <div className='mb-6'>
          <RichTextEditor
            value={prompt}
            onChange={(nextValue) => setPrompt(nextValue)}
            placeholder=' '
            minHeight={96}
          />
        </div>

        {/* Options or Answer */}
        {isOptionBased ? (
          <div className='ml-6 mb-6 space-y-4'>
            {optionIds.map((optionId) => (
              <div key={optionId} className='rounded-lg border border-[#e5e7eb] bg-white p-4'>
                <div className='mb-3 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    {/* Option Badge */}
                    <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#e5e7eb] text-[16px] font-semibold text-[#334155]'>
                      {optionId}
                    </div>

                    <input
                      type={type === 'radio' ? 'radio' : 'checkbox'}
                      checked={correctAnswers.includes(optionId)}
                      onChange={() => toggleCorrect(optionId)}
                      className='h-5 w-5 cursor-pointer'
                    />
                  </div>

                  {/* Delete Button */}
                  <button
                    type='button'
                    onClick={() => {
                      const newOptions = { ...options }
                      delete newOptions[optionId]
                      setOptions(newOptions)
                      setNumberOfOptions(Math.max(1, numberOfOptions - 1))
                      if (correctAnswers.includes(optionId)) {
                        setCorrectAnswers((prev) => prev.filter((id) => id !== optionId))
                      }
                    }}
                    className='cursor-pointer text-[#94a3b8] hover:text-[#ef4444]'
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className='ml-4'>
                  <RichTextEditor
                    value={options[optionId] || ''}
                    onChange={(nextValue) => updateOption(optionId, nextValue)}
                    placeholder=' '
                    minHeight={78}
                  />
                </div>
              </div>
            ))}

            {/* Add Another Option Button */}
            <button
              type='button'
              onClick={() => {
                const nextId = String.fromCharCode(65 + numberOfOptions)
                setNumberOfOptions(numberOfOptions + 1)
                setOptions((prev) => ({ ...prev, [nextId]: '' }))
              }}
              className='flex items-center gap-2 text-[16px] font-medium text-[#633CFF] cursor-pointer'
            >
              <span className='text-[18px]'>+</span> Another option
            </button>
          </div>
        ) : (
          <div className='mb-6'>
            <label className='mb-3 block text-[16px] font-medium text-[#334155]'>Answer</label>
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              className='w-full min-h-24 rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 text-[16px] text-[#334155] placeholder:text-[#94a3b8] focus:outline-none'
              placeholder='Write sample answer'
            />
          </div>
        )}

        {/* Buttons */}
        <div className='flex items-center justify-end gap-3'>
          <button
            type='button'
            onClick={handleSave}
            className='h-11 rounded-lg border-2 border-[#633CFF] px-6 text-[16px] font-semibold text-[#633CFF] cursor-pointer hover:bg-[#633CFF]/10'
          >
            Save
          </button>
          <button
            type='button'
            onClick={handleSaveAndAddMore}
            className='h-11 rounded-lg bg-[#633CFF] px-6 text-[16px] font-semibold text-white cursor-pointer hover:bg-[#5028d9]'
          >
            Save & Add More
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddQuestionModal
