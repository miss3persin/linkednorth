import React from 'react'
import { Inter, Open_Sans } from 'next/font/google'
import { SearchBar } from '../components/SearchBar'
import { Companies } from '../components/Companies'
import stration_1 from '/public/Yuppies Bust.png'
import stration_2 from '/public/Yuppies Sitting On Chair.png'
import Image from 'next/image'

const openSans = Open_Sans({ subsets: ['latin'] })
const inter = Inter({ subsets: ['latin'] })

export const HeroSection = () => {
  return (
    <div className='container relative px-16 pt-48 mb-48 flex flex-col items-center'>


      <div className='absolute bottom-0 flex items-center justify-between w-full px-10'>
        <Image src={stration_2} layout='intrinsic' quality={100} className='mt-20'/>
        <Image src={stration_1} layout='intrinsic' quality={100} className='mb-52'/>
      </div>


      <div>
        <p
          className={`${inter.className} mb-5 px-16 text-center text-[4.1rem] font-extrabold leading-tight text-headingBlack`}
        >
          Find Your Next Role, Verified and{' '}
          <span className='text-headingGrey'>Secured.</span>
        </p>
        <p
          className={`${openSans.className} mb-5 px-[22rem] text-center leading-loose text-textColor`}
        >
          Job search platform worldwide. We connect freelancers and startups in
          an easy way and good collaboration
        </p>
      </div>

      <div className='mb-36 flex items-center justify-center'>
        <SearchBar />
      </div>

      <div className=''>
        <p className='mb-7 text-center text-sm text-textColor'>
          Trusted by 500+ Companies
        </p>
        <Companies />
      </div>
    </div>
  )
}
