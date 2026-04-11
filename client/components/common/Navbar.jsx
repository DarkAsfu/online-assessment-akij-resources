import Image from 'next/image';
import React from 'react';
import logo from '@/public/logo.svg';

const Navbar = () => {
    return (
        <div className='max-w-7xl mx-auto py-6'>
            <div className='grid grid-cols-3 justify-between'>
                <Image src={logo} alt="Logo" className='' />
                <h1 className='text-center text-primary text-[24px] font-semibold'>Akij Resource</h1>
            </div>
        </div>
    );
};


export default Navbar;