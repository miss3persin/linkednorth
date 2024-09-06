import React from 'react'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import features from '/public/features_img.png'
import { BlackBtn } from '../components/BlackBtn'
import { WhiteBtn } from '../components/WhiteBtn'
import arrow_right from '/public/chevron right.png'
import discord_img from '/public/discord.png'
import startion_3 from '/public/Big Shoes Sitting on Rock.png'

const inter = Inter({ subsets: ['latin'] })

export const FeaturesSection = () => {
  return (
    <div className='container flex px-24 mb-48 items-center'>
        <div className='w-full'>
            <p className={`${inter.className} text-headingBlack text-5xl mb-10 font-bold max-w-96`}>What Makes Us Different</p>

            <div className='mb-10 w-[26rem] relative '>
            <Image src={features} layout='intrinsic' objectFit='contain' quality={100}/>
            </div>

            <div className='flex gap-2'>
                <BlackBtn text='Check Career Resources' img={arrow_right} link='https://www.google.com/' />
                <WhiteBtn text='Join Our Discord' img={discord_img} link='https://www.google.com/'/>
            </div>
        </div>

        <div className='w-full relative'>
            <Image src={startion_3} layout='intrinsic' objectFit='contain' quality={100}/>
            <div className='w-full h-24 bg-gradient-to-b from-transparent via-white/95 to-white absolute bottom-0'></div>
        </div>
    </div>
  )
}
