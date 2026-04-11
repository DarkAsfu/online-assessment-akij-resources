import Image from 'next/image';
import React from 'react';
import logo from '@/public/logo.svg';

const Navbar = () => {
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
                <h1 className='text-right text-primary text-lg font-semibold sm:text-[24px] md:text-center'>
                    Akij Resource
                </h1>
                <div className='hidden md:block' />
            </div>
        </div>
    )
};


export default Navbar;