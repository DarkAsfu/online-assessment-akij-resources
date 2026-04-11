import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import examService from '@/services/examService'

const ViewCandidatesModal = ({ open, onClose, examId, examTitle }) => {
  const [candidates, setCandidates] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open && examId) {
      fetchCandidates()
    }
  }, [open, examId])

  const fetchCandidates = async () => {
    setIsLoading(true)
    try {
      const response = await examService.getExamCandidates(examId)
      const candidatesData = response?.data || response?.candidates || []
      setCandidates(Array.isArray(candidatesData) ? candidatesData : [])
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to fetch candidates'
      toast.error(message)
      setCandidates([])
    } finally {
      setIsLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4'>
      <div className='w-full max-w-2xl rounded-2xl bg-white p-5 md:p-6 max-h-[80vh] overflow-y-auto'>
        <div className='mb-4 flex items-center justify-between sticky top-0 bg-white'>
          <div>
            <h3 className='text-[24px] font-semibold text-primary'>View Candidates</h3>
            <p className='text-[14px] text-[#64748b] mt-1'>{examTitle}</p>
          </div>
          <button type='button' onClick={onClose} className='text-[#64748b] cursor-pointer'>
            <X size={22} />
          </button>
        </div>

        {isLoading ? (
          <div className='flex items-center justify-center py-10'>
            <div className='text-center'>
              <div className='mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#633CFF] mx-auto' />
              <p className='text-[16px] text-[#64748b]'>Loading candidates...</p>
            </div>
          </div>
        ) : candidates.length > 0 ? (
          <div className='space-y-3'>
            <div className='mb-4 flex items-center justify-between text-[14px] text-[#64748b]'>
              <span>Total Candidates: <strong className='text-primary'>{candidates.length}</strong></span>
            </div>
            
            <div className='space-y-2 max-h-96 overflow-y-auto'>
              {candidates.map((candidate, index) => (
                <div
                  key={candidate._id || index}
                  className='flex items-center justify-between rounded-lg border border-[#e5e7eb] bg-[#f8f8f8] p-3 hover:bg-[#f0f0f0] transition'
                >
                  <div className='flex-1'>
                    <p className='text-[14px] font-medium text-primary'>
                      {candidate.name || candidate.email || 'Unknown Candidate'}
                    </p>
                    <p className='text-[12px] text-[#64748b]'>
                      {candidate.email || 'No email'}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-[12px] px-2 py-1 rounded-full bg-[#e8e8f0] text-[#633CFF]'>
                      {candidate.status || 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='py-10 text-center'>
            <p className='text-[16px] text-[#64748b]'>No candidates found for this exam</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewCandidatesModal
