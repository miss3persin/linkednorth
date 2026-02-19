'use client'

import { Inter } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import logo from '/public/linkednorth-logo.png'
import overlay from '/public/Overlay.png'

const inter = Inter({ subsets: ['latin'] })

export default function ComingSoon() {
    return (
        <div className={`min-h-[95vh] flex flex-col items-center justify-center relative overflow-hidden bg-white ${inter.className}`}>
            <div className="absolute right-0 bottom-0 h-full pointer-events-none opacity-30 select-none">
                <Image
                    src={overlay}
                    alt=""
                    className="w-auto h-full object-contain"
                    priority
                />
            </div>

            <div className="relative z-10 text-center px-6">
                <div className="mb-8 flex justify-center">
                    <Image src={logo} alt="LinkedNorth" width={180} height={48} className="object-contain" />
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-black mb-4 tracking-tight">
                    COMING <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-black">SOON</span>
                </h1>

                <div className="w-24 h-1 bg-black mx-auto mb-8 rounded-full"></div>

                <p className="text-gray-500 text-lg md:text-xl max-w-lg mx-auto mb-10 font-light leading-relaxed">
                    We&apos;re currently building something extraordinary for the North.
                    Stay tuned as we prepare to launch this feature.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/jobs"
                        className="px-8 py-3 bg-black text-white rounded-sm font-semibold hover:bg-gray-800 transition shadow-lg hover:shadow-xl active:scale-95"
                    >
                        Explore Jobs
                    </Link>
                    <Link
                        href="/"
                        className="px-8 py-3 bg-white text-black border border-black rounded-sm font-semibold hover:bg-gray-50 transition active:scale-95"
                    >
                        Back Home
                    </Link>
                </div>
            </div>
            <div className="absolute top-20 left-10 w-4 h-4 rounded-full bg-blue-100 opacity-50 animate-pulse"></div>
            <div className="absolute bottom-40 left-20 w-8 h-8 rounded-full bg-purple-50 opacity-40 animate-bounce" style={{ animationDuration: '3s' }}></div>
            <div className="absolute top-40 right-20 w-6 h-6 rounded-full bg-gray-100 opacity-60"></div>
        </div>
    )
}
