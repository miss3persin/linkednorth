import React from 'react'
import logo from '/public/linkednorth-logo.png'
import Image from 'next/image'
import { WhiteBtn } from '../components/WhiteBtn'
import { BlackBtn } from '../components/BlackBtn'
import { Open_Sans } from 'next/font/google'

const openSans = Open_Sans({ subsets: ['latin'] })

export const NavbarSection = () => {
  return (
    <nav className='relative w-screen'>
      <div className='fixed z-50 flex w-screen items-center justify-between bg-white px-32 py-8'>
        <div className='relative h-6 w-[150px]'>
          <Image
            src={logo}
            alt='LinkedNorth'
            layout="intrinsic"
            objectFit="contain"
            quality={100} 
          />
        </div>

        <div>
          <ul className={`${openSans.className} flex gap-10 text-[13px] text-textColor`}>
            <li>Home</li>
            <li>Job Listings</li>
            <li>Career Resources</li>
            <li>Contact Us</li>
          </ul>
        </div>

        <div className='flex items-center gap-3'>
          <WhiteBtn text='Post A Job' />
          <BlackBtn text='Login/SignUp' />  
        </div>
      </div>
    </nav>
  )
}
