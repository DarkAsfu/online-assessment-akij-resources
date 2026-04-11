"use client"

import Image from 'next/image'
import React, { useRef, useState, useEffect } from 'react'
import { ChevronDown, CircleUserRound, LogOut } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import logo from '@/public/logo.svg'
import { logout } from '@/store/slices/authSlice'
import authService from '@/services/authService'

const Navbar = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const router = useRouter()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    const handleLogout = async () => {
        try {
            await authService.logout()
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            dispatch(logout())
            setIsDropdownOpen(false)
            router.push('/login')
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isDropdownOpen])

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
                    <div className='relative flex items-center justify-end' ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className='flex items-center justify-end gap-2 rounded-lg px-2 py-1 hover:bg-[#f3f4f6] transition-colors cursor-pointer'
                        >
                            <div className='flex h-9 w-9 items-center justify-center rounded-full bg-[#e5e7eb] text-[#9ca3af] sm:h-10 sm:w-10'>
                                <CircleUserRound size={22} />
                            </div>
                            <div className='hidden text-left leading-tight sm:block'>
                                <p className='text-[18px] font-semibold text-primary'>{user.name}</p>
                                <p className='text-[14px] text-primary'>Ref. ID - {user.id}</p>
                            </div>
                            <ChevronDown 
                                size={20} 
                                className={`text-primary transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {isDropdownOpen && (
                            <div className='absolute right-0 top-full mt-2 w-48 rounded-lg border border-[#e5e7eb] bg-white shadow-lg z-50'>
                                <div className='px-4 py-3 border-b border-[#e5e7eb]'>
                                    <p className='text-[14px] font-medium text-[#64748b]'>Account</p>
                                    <p className='text-[16px] font-semibold text-primary truncate'>{user.name}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className='w-full flex items-center gap-2 px-4 py-3 text-[14px] font-medium text-[#ef4444] hover:bg-[#fef2f2] transition-colors'
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className='hidden md:block' />
                )}
            </div>
        </div>
    )
}

export default Navbar