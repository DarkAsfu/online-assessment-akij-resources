"use client"

import Image from 'next/image'
import React from 'react'
import { ChevronDown, CircleUserRound } from 'lucide-react'
import { useSelector } from 'react-redux'
import logo from '@/public/logo.svg'

const Navbar = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth)

    return (
        <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6'>
            <div className='grid grid-cols-2 items-center md:grid-cols-3'>
                <Image
                    src={logo}
                    alt='Logo'
                    width={128}
                    height={40}
                    className='h-auto w-22 sm:w-27.5 md:w-32'
                    priority
                />
                <h1
                    className={`text-right text-primary text-lg font-semibold sm:text-[24px] md:text-center ${
                        isAuthenticated ? 'hidden md:block' : ''
                    }`}
                >
                    Akij Resource
                </h1>

                {isAuthenticated && user ? (
                    <div className='flex items-center justify-end gap-2'>
                        <div className='flex h-9 w-9 items-center justify-center rounded-full bg-[#e5e7eb] text-[#9ca3af] sm:h-10 sm:w-10'>
                            <CircleUserRound size={22} />
                        </div>
                        <div className='hidden text-left leading-tight sm:block'>
                            <p className='text-[18px] font-semibold text-primary'>{user.name}</p>
                            <p className='text-[14px] text-primary'>Ref. ID - {user.id}</p>
                        </div>
                        <ChevronDown size={20} className='text-primary' />
                    </div>
                ) : (
                    <div className='hidden md:block' />
                )}
            </div>
        </div>
    )
}

export default Navbar