import React from 'react'
import { BlackBtn } from './components/BlackBtn'
import { WhiteBtn } from './components/WhiteBtn'
import { SearchBar } from './components/SearchBar'
import { Companies } from './components/Companies'
import { ApplicationCard } from './components/ApplicationCard'
import { NavbarSection } from './sections/NavbarSection'
import { HeroSection } from './sections/HeroSection'
import { FeaturesSection } from './sections/FeaturesSection'
import { ResumeSection } from './sections/ResumeSection'
import { JobsSection } from './sections/JobsSection'
import { FeedbackSection } from './sections/FeedbackSection'
import { ConnectSection } from './sections/ConnectSection'
import { FooterSection } from './sections/FooterSection'

const page = () => {
  return (
    <section className=''>
      {/* <div className='container flex h-screen items-center justify-center'> */}
        {/* <SearchBar/> */}
        <NavbarSection/>
        <HeroSection/>
        <FeaturesSection/>
        <ResumeSection/>
        <JobsSection/>
        <FeedbackSection/>
        <ConnectSection/>
        <FooterSection/>



        {/* <ApplicationCard
          jobTitle='Frontend Developer'
          company='Google'
          location='United Kingdom'
          jobType='On-site'
          description="We're looking for a skilled frontend developer to join our team in London."
          imageSrc='/apple.png'
          applyLink='https://google.com/careers'
        /> */}

      {/* </div> */}
    </section>
  )
}

export default page
