'use client'

import { Open_Sans } from 'next/font/google'
import Image from 'next/image'
import React from 'react'
import logo from '/public/linkednorth-logo-white.png'

const openSans = Open_Sans({ subsets: ['latin'] })

export const FooterSection = () => {
  return (
    <div className={`${openSans.className} bg-[#262629] flex flex-col`}>

      <div className='container px-28 pt-24 pb-8 mb-7 flex justify-between border-b border-[#333333]'>

        <div className='text-[#868D9B] text-[0.92rem] font-normal'>
          <div className='relative h-6 w-[150px] mb-5'>
            <Image
              src={logo}
              alt='LinkedNorth'
              layout='intrinsic'
              objectFit='contain'
              quality={100}
            />
          </div>
          <p className='max-w-96 mb-7 leading-[2.3]'>
            Connect, share insights, and get support from a network of
            professionals on the same journey.
          </p>
          <p>© 2024 LinkedNorth business Corporation</p>
        </div>

        <div className='text-[#7A7A7A] text-sm flex flex-col gap-8 pt-7 '>
            <p>Home</p>
            <p>Job Listings</p>
            <p>Contact Us</p>
            <p>Career Resources</p>
        </div>

        <div className='text-[#7A7A7A] text-sm flex flex-col gap-8 pt-7'>
            <p>Twitter</p>
            <p>LinkedIn</p>
            <p>Instagram</p>
            <p>Tiktok</p>
        </div>

        <div className='text-[#7A7A7A] text-sm flex flex-col gap-8 pt-7 mr-44'>
            <p>Join Newsletter</p>
            <p>Join Community</p>
        </div>
      </div>

      <div className='text-right container px-28 mb-7'>
        <p className='text-[#868D9B] text-[0.92rem] font-light'>© 2024  LinkedNorth business Corporation</p>
      </div>
    </div>
  )
}
