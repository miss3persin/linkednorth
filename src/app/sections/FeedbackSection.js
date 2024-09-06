import React from 'react'
import { Inter, Open_Sans } from 'next/font/google'
import { BlackBtn } from '../components/BlackBtn'
import arrow_right from '/public/chevron right.png'
import feedback_img from '/public/feedback_img.png'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })
const openSans = Open_Sans({ subsets: ['latin'] })

export const FeedbackSection = () => {
  return (
    <div className='container flex px-24 mb-48 items-center'>

    <div className='w-full'>
        <p className={`${inter.className} text-headingBlack text-5xl mb-5 pt-3 font-bold max-w-[32rem]`}>Real Feedback from Job Seekers <span className='text-headingGrey'>Like You</span> </p>
        <p className={`${openSans.className} mb-5 leading-loose max-w-[30rem] text-textColor`}>Discover genuine reviews and experiences from our community of job seekers. Discover genuine reviews and experiences from our community of job seekers.</p>
        <BlackBtn text='Check More Job Listings' img={arrow_right} link=''/>
    </div>

    <div className='w-5/6 relative'>
        <Image src={feedback_img} layout='intrinsic' objectFit='contain' quality={100}/>
    </div>
</div>
  )
}
