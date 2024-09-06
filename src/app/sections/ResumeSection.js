import React from 'react'
import { Inter, Open_Sans } from 'next/font/google'
import { BlackBtn } from '../components/BlackBtn'
import arrow_right from '/public/chevron right.png'
import stration_4 from '/public/Big Shoes Torso.png'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })
const openSans = Open_Sans({ subsets: ['latin'] })

export const ResumeSection = () => {
  return (
    <div className='container flex px-24 mb-48 '>
        <div className='w-4/6 relative'>
            <Image src={stration_4} layout='intrinsic' objectFit='contain' quality={100}/>
        </div>

        <div className='w-full'>
            <p className={`${inter.className} text-headingBlack text-5xl mb-7 pt-3 font-bold`}>Get Your Resume Reviewed by Top <span className='text-headingGrey'>Recruiters</span> </p>
            <p className={`${openSans.className} mb-7 leading-loose max-w-[30rem] text-textColor`}>Receive expert feedback from recruiters who've worked with leading brands to elevate your resume.</p>
            <BlackBtn text='Check Resume -$25' img={arrow_right} link=''/>
        </div>
    </div>
  )
}
