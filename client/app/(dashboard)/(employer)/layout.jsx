"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

const EmployerLayout = ({ children }) => {
  const router = useRouter()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated || !user) return

    if (user.role !== 'employer') {
      router.replace('/')
    }
  }, [isAuthenticated, router, user])

  if (!isAuthenticated || !user) {
    return <div className='px-4 py-8 text-center text-primary'>Loading...</div>
  }

  if (user.role !== 'employer') {
    return null
  }

  return <>{children}</>
}

export default EmployerLayout
