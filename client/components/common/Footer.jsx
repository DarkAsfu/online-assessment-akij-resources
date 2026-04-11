import Image from 'next/image'
import React from 'react'
import logo from '@/public/logo_white.svg'
import { Mail, Phone } from 'lucide-react'
const Footer = () => {
  return (
    <div className='bg-[#130B2C]'>
      <div className='max-w-7xl mx-auto py-6'>
        <div className='flex justify-between items-center'>
            <div className='flex gap-2 items-center'>
                <h4 className='text-[20px] text-white'>Powered by</h4><Image src={logo} alt="Logo" width={100} height={50} />
            </div>
            <div className='flex gap-4 items-center'>
                <h4 className='text-[16px] text-white font-medium'>Helpline</h4>
                <div className='flex gap-2 items-center'>
                    <Phone size={18} color='white' />
                    <span className='text-white text-[16px]'>+88 011020202505</span>
                </div>
                <div className='flex gap-2 items-center'>
                    <Mail size={18} color='white' />
                    <span className='text-white text-[16px]'>support@akij.work</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
