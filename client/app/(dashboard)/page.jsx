"use client"

import CandidateDashboard from '@/components/candidate/CandidateDashboard'
import EmployerDashboard from '@/components/employer/EmployerDashboard'
import React from 'react'
import { useSelector } from 'react-redux'

const Page = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  if (!isAuthenticated || !user) {
    return (
      <div className='px-4 py-8 text-center text-primary'>
        Welcome to Online assessment system please login to access your dashboard.
      </div>
    )
  }

  return user.role === 'employer' ? <EmployerDashboard /> : <CandidateDashboard />
}

export default Page