import React from 'react'

const CreateExamActions = ({
  cancelLabel = 'Cancel',
  primaryLabel = 'Save & Continue',
  onPrimary,
  isPrimaryLoading = false,
}) => {
  return (
    <div className='rounded-2xl border border-[#eceff4] bg-white p-5 md:p-6 max-w-226.5 mx-auto'>
      <div className='flex items-center justify-between'>
        <button
          type='button'
          className='h-12 min-w-45 rounded-xl border border-[#d8dee8] px-6 text-[16px] font-semibold text-primary cursor-pointer'
        >
          {cancelLabel}
        </button>

        <button
          type='button'
          onClick={onPrimary}
          disabled={isPrimaryLoading}
          className='h-12 min-w-55 rounded-xl bg-linear-to-r from-[#5f2df5] to-[#6438f8] px-6 text-[16px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer'
        >
          {isPrimaryLoading ? 'Saving...' : primaryLabel}
        </button>
      </div>
    </div>
  )
}

export default CreateExamActions
