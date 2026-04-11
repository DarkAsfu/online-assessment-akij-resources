"use client"

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import authService from '@/services/authService'
import { setLoading, setUser } from '@/store/slices/authSlice'

const Page = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.email || !formData.password) {
      toast.error('Please enter email and password')
      return
    }

    try {
      setIsSubmitting(true)
      dispatch(setLoading(true))

      const response = await authService.login(formData.email, formData.password)

      if (response?.token) {
        localStorage.setItem('token', response.token)
      }

      dispatch(
        setUser({
          user: response.user,
          token: response.token,
        })
      )

      toast.success('Login successful')
      router.push('/')
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      dispatch(setLoading(false))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className='bg-[#f3f4f6] px-3 md:px-4'>
      <div className='mx-auto w-full max-w-[507px]'>
        <h1 className='pt-12 mb-5 text-center text-[20px] font-semibold text-primary md:pt-24 md:mb-6 md:text-[24px]'>
          Sign In
        </h1>

        <div className='pb-16 md:pb-[161px]'>
          <div className='rounded-2xl border border-[#d9dde3] bg-white px-4 pt-6 pb-6 md:px-8 md:pt-8 md:pb-10'>
            <form className='space-y-5' onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor='emailOrId'
                  className='block text-[14px] font-medium text-primary leading-[21px] mb-[11px]'
                >
                  Email/ User ID
                </label>
                <input
                  id='emailOrId'
                  name='email'
                  type='text'
                  placeholder='Enter your email/User ID'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full rounded-lg border border-[#cfd6de] p-3 text-[14px] text-[#334155] placeholder:text-[#9aa7b7] focus:border-[#cfd6de] focus:outline-none'
                />
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='block text-[14px] font-medium text-primary leading-[21px] mb-[11px]'
                >
                  Password
                </label>
                <div className='relative'>
                  <input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    value={formData.password}
                    onChange={handleChange}
                    className='w-full rounded-lg border border-[#cfd6de] p-3 text-[14px] text-[#334155] placeholder:text-[#9aa7b7] focus:border-[#cfd6de] focus:outline-none'
                  />
                  <button
                    type='button'
                    aria-label='Show password'
                    onClick={() => setShowPassword((prev) => !prev)}
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-[#9aa7b7]'
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className='mt-2 flex justify-end'>
                  <button
                    type='button'
                    className='text-[14px] font-medium text-primary hover:underline'
                  >
                    Forget Password?
                  </button>
                </div>
              </div>

              <button
                type='submit'
                disabled={isSubmitting}
                className='mt-2 py-3 w-full rounded-xl bg-gradient-to-r from-[#5f2df5] to-[#6438f8] text-[16px] font-semibold text-white disabled:opacity-70 disabled:cursor-not-allowed'
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Page
