import React from 'react'
import { Eye } from 'lucide-react'

const page = () => {
  return (
    <main className='bg-[#f3f4f6] px-3 md:px-4'>
      <div className='mx-auto w-full max-w-[507px]'>
        <h1 className='pt-12 mb-5 text-center text-[20px] font-semibold text-primary md:pt-24 md:mb-6 md:text-[24px]'>
          Sign In
        </h1>

        <div className='pb-16 md:pb-[161px]'>
          <div className='rounded-2xl border border-[#d9dde3] bg-white px-4 pt-6 pb-6 md:px-8 md:pt-8 md:pb-10'>
            <form className='space-y-5'>
              <div>
                <label
                  htmlFor='emailOrId'
                  className='block text-[14px] font-medium text-primary leading-[21px] mb-[11px]'
                >
                  Email/ User ID
                </label>
                <input
                  id='emailOrId'
                  type='text'
                  placeholder='Enter your email/User ID'
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
                    type='password'
                    placeholder='Enter your password'
                    className='w-full rounded-lg border border-[#cfd6de] p-3 text-[14px] text-[#334155] placeholder:text-[#9aa7b7] focus:border-[#cfd6de] focus:outline-none'
                  />
                  <button
                    type='button'
                    aria-label='Show password'
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-[#9aa7b7]'
                  >
                    <Eye size={20} />
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
                className='mt-2 py-3 w-full rounded-xl bg-gradient-to-r from-[#5f2df5] to-[#6438f8] text-[16px] font-semibold text-white'
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default page
