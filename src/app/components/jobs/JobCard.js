'use client'

import React from 'react'
import Image from 'next/image'
import { Inter, Open_Sans } from 'next/font/google'
import arrow_right_black from '/public/chevron right black.png'
import job from '/public/work_blue.png'
import location_icon from '/public/location_blue.png'
import { stripHtml } from '../../lib/cleanDescription'

import logo from '/public/linkednorth-logo.png'

const openSans = Open_Sans({ subsets: ['latin'] })
const inter = Inter({ subsets: ['latin'] })

export const JobCard = ({
  jobTitle,
  company,
  location,
  jobType,
  description,
  imageSrc,
  applyLink,
}) => {
  return (
    <div className="flex h-auto w-full max-w-[22.1rem] flex-col justify-between gap-3 border p-4 sm:p-6 rounded-lg bg-white hover:border-black transition-colors">
      <div className="flex flex-col gap-3">
        <div className={`${inter.className} flex w-full justify-between`}>
          <div className="flex flex-col max-w-[80%]">
            <p className="text-base sm:text-lg font-semibold line-clamp-2 leading-tight">{jobTitle}</p>
            <p className="text-xs sm:text-sm text-[#B5BDCA]">{company}</p>
          </div>
          <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center">
            <Image
              src={imageSrc || logo}
              alt="job company"
              width={100}
              height={100}
              quality={100}
              style={{ objectFit: 'cover' }}
              referrerPolicy="no-referrer"
              unoptimized={true}
              onError={(e) => {
                e.target.src = logo.src || logo
              }}
            />
          </div>
        </div>

        <div className={`${inter.className} flex flex-wrap items-center gap-4`}>
          <p className="flex items-center gap-2 text-xs text-[#0A84FF]">
            <Image src={location_icon} alt="location" /> {location}
          </p>
          <div className="hidden sm:block h-6 w-[1px] bg-[#E1E1E1]"></div>
          <p className="flex items-center gap-2 text-xs text-[#0A84FF]">
            <Image src={job} alt="job type" /> {jobType}
          </p>
        </div>

        <div>
          <p className="text-sm sm:text-[0.9rem] text-[#979797] line-clamp-2 leading-relaxed">
            {stripHtml(description)}
          </p>
        </div>
      </div>

      <a
        href={applyLink}
        target="_blank"
        className={`${openSans.className} flex w-full items-center justify-center gap-2 border border-[#181818] bg-white px-5 py-2 sm:px-7 sm:py-3 text-xs sm:text-sm font-bold text-[#181818] rounded-md hover:bg-gray-50 transition`}
      >
        Apply Now <Image src={arrow_right_black} alt="arrow" />
      </a>
    </div>
  )
}
