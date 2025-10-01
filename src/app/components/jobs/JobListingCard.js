'use client'

import React from 'react'
import Image from 'next/image'
import { Inter, Open_Sans } from 'next/font/google'
import arrow_right from '/public/chevron right.png'
import arrow_right_black from '/public/chevron right black.png'
import save_btn from '/public/job_save_btn.png'
// import job from '/public/work_blue.png'
// import location_icon from '/public/location_blue.png'
import { Button } from '../ui/Button'

const openSans = Open_Sans({ subsets: ['latin'] })
const inter = Inter({ subsets: ['latin'] })

export const JobListingCard = ({
  jobTitle,
  company,
  location,
  postedTime,
  jobType,
  contractType,
  description,
  imageSrc,
  applyLink,
  detailsLink,
}) => {
  return (
    <div className="flex w-full max-w-[48rem] flex-col rounded-sm border border-[#E5E7EB] bg-white p-6 shadow-sm">
      {/* Top section */}
      <div className="flex items-start justify-between">

        <div className='flex gap-4'>

          <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
            <Image
              src={imageSrc}
              alt="Company Logo"
              fill
              className="object-contain p-1"
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xl font-bold text-[#111827]">{jobTitle}</p>
            <div className="flex flex-wrap items-center gap-1 text-xs text-[#4F98FF]">
              <span>{company}</span>
              <span>•</span>
              <span>{location}</span>
              <span>•</span>
              <span>{postedTime}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Image src={save_btn} alt="save" width={16} height={16} className="cursor-pointer" />
        </div>

      </div>

      {/* Description */}
      <p className="text-sm text-[#4B5563] leading-relaxed pl-[4.5rem] mb-2 max-w-[40rem]">
        {description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 pl-[4.5rem] mb-5">
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
          {jobType}
        </span>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
          {contractType}
        </span>
      </div>


      {/* Buttons */}
      <div className="flex flex-col gap-2 sm:flex-row pl-[4.5rem]">
        <Button text="Apply Now" img={arrow_right} link="https://www.google.com/" variant="black" />
        {/* <a
          href={applyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-[#111]"
        >
          Apply Now
          <Image src={arrow_right_black} alt="arrow" width={16} height={16} />
        </a> */}

        <a
          href={detailsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="border-[#D1D5DB] bg-white text-[#374151] font-semibold border flex items-center justify-center gap-2 px-4 sm:px-8 py-2 sm:py-3 text-sm w-full sm:w-auto rounded-sm"
        >
          View Details

          <Image src={arrow_right_black} alt="arrow" width={24} height={24} />
        </a>
      </div>
    </div >
  )
}
