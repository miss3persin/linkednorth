'use client'

import React from 'react'
import Image from 'next/image'
import { Inter, Open_Sans } from 'next/font/google'
import arrow_right_black from '/public/chevron right black.png'
import job from '/public/work_blue.png'
import location_icon from '/public/location_blue.png'

const openSans = Open_Sans({ subsets: ['latin'] })
const inter = Inter({ subsets: ['latin'] })

export const ApplicationCard = ({
  jobTitle,
  company,
  location,
  jobType,
  description,
  imageSrc,
  applyLink
}) => {
  return (
    <div className='flex h-[18rem] w-[22.1rem] flex-col justify-between gap-3 border p-6'>
      <div className='flex flex-col gap-3'>
        <div className={`${inter.className} flex w-full justify-between`}>
          <div className='flex flex-col justify-between'>
            <p className='text-lg font-semibold'>{jobTitle}</p>
            <p className='text-sm text-[#B5BDCA]'>{company}</p>
          </div>
          <div className='h-12 w-12 relative flex items-center'>
            <Image
              src={imageSrc}
              alt='job company'
              width={100}
              height={100}
              layout='intrinsic'
              objectFit='cover'
              quality={100}
            />
          </div>
        </div>

        <div className={`${inter.className} flex items-center gap-4`}>
          <p className='flex items-center gap-2 text-xs text-[#0A84FF]'>
            <Image src={location_icon} alt='location' /> {location}
          </p>
          <div className='h-6 w-[1px] bg-[#E1E1E1]'></div>
          <p className='flex items-center gap-2 text-xs text-[#0A84FF]'>
            <Image src={job} alt='job type' /> {jobType}
          </p>
        </div>

        <div>
          <p className='text-[0.9rem] text-[#979797]'>{description}</p>
        </div>
      </div>

      <button className='w-full'>
        <a
          href={applyLink}
          target='_blank'
          className={`${openSans.className} flex items-center justify-center gap-2 border border-btnBlack bg-white px-7 py-3 text-sm font-bold text-btnBlack`}
        >
          Apply Now <Image src={arrow_right_black} alt='arrow' />
        </a>
      </button>
    </div>
  )
}
