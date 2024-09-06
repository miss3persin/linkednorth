import React from 'react'
import { Inter, Open_Sans } from 'next/font/google'
import { BlackBtn } from '../components/BlackBtn'
import arrow_right from '/public/chevron right.png'
import stration_5 from '/public/Yuppies Remote Team.png'
import discord_img from '/public/discord_white.png'
import { WhiteBtn } from '../components/WhiteBtn'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })
const openSans = Open_Sans({ subsets: ['latin'] })

export const ConnectSection = () => {
  return (
    <div className='container flex px-24 mb-48'>
    <div className='w-full relative'>
        <Image src={stration_5} layout='intrinsic' objectFit='contain' quality={100}/>
    </div>

    <div className='w-full'>
        <p className={`${inter.className} text-headingBlack text-5xl mb-5 pt-14 font-bold`}>Connect with likeminded people </p>
        <p className={`${openSans.className} mb-5 leading-loose max-w-[30rem] text-textColor`}>Connect, share insights, and get support from a network of professionals on the same journey.</p>
        <div className='flex gap-2'>
                <BlackBtn text='Join Our Discord' img={discord_img} link='https://www.google.com/' />
                <WhiteBtn text='Join Our Newsletter' link='https://www.google.com/'/>
            </div>
    </div>
</div>
  )
}
