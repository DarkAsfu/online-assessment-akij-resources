"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import authService from '@/services/authService'
import { logout, setLoading, setUser } from '@/store/slices/authSlice'

const DashboardLayout = ({ children }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    let isMounted = true

    const verifyAuth = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        router.replace('/login')
        if (isMounted) setIsCheckingAuth(false)
        return
      }

      if (isAuthenticated && user) {
        if (isMounted) setIsCheckingAuth(false)
        return
      }

      try {
        dispatch(setLoading(true))
        const response = await authService.getMe()

        dispatch(
          setUser({
            user: response?.data,
            token,
          })
        )
      } catch (error) {
        dispatch(logout())
        router.replace('/login')
      } finally {
        dispatch(setLoading(false))
        if (isMounted) setIsCheckingAuth(false)
      }
    }

    verifyAuth()

    return () => {
      isMounted = false
    }
  }, [dispatch, isAuthenticated, router, user])

  if (isCheckingAuth) {
    return <div className='px-4 py-8 text-center text-primary'>Loading...</div>
  }

  return <>{children}</>
}

export default DashboardLayout
