'use client'

import React, { useState, useRef } from 'react'
import { Open_Sans } from 'next/font/google'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import job from '/public/work.png'
import location from '/public/location.png'

const openSans = Open_Sans({ subsets: ['latin'] })

export const SearchBar = () => {
  const [jobTitle, setJobTitle] = useState('')
  const [country, setCountry] = useState('')
  const [filteredJobs, setFilteredJobs] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [isJobFocused, setIsJobFocused] = useState(false)
  const [isCountryFocused, setIsCountryFocused] = useState(false)

  const jobDropdownRef = useRef(null)
  const countryDropdownRef = useRef(null)
  const router = useRouter()

  const jobTitles = ['Software Engineer', 'Product Manager', 'Data Scientist']
  const countries = ['United States', 'Canada', 'United Kingdom', 'Remote']

  const handleJobTitleChange = (e) => {
    const value = e.target.value
    setJobTitle(value)
    setFilteredJobs(
      jobTitles.filter((job) =>
        job.toLowerCase().includes(value.toLowerCase())
      )
    )
  }

  const handleCountryChange = (e) => {
    const value = e.target.value
    setCountry(value)
    setFilteredCountries(
      countries.filter((c) =>
        c.toLowerCase().includes(value.toLowerCase())
      )
    )
  }

  const handleSearch = () => {
    // Validation: both fields cannot be empty
    if (!jobTitle.trim() && !country.trim()) {
      alert('Please enter a job title or country to search.')
      return
    }

    // Optional: validate minimum characters (e.g., at least 2)
    if (jobTitle && jobTitle.trim().length < 2) {
      alert('Please enter at least 2 characters for the job title.')
      return
    }

    if (country && country.trim().length < 2) {
      alert('Please enter at least 2 characters for the country.')
      return
    }

    // Navigate to /jobs with query params
    router.push(`/jobs?title=${encodeURIComponent(jobTitle)}&country=${encodeURIComponent(country)}`)
  }

  return (
    <div className={`${openSans.className} flex items-center justify-center py-4 w-[35rem]`}>
      <div className="relative w-full flex flex-col sm:flex-row sm:gap-0 gap-2">
        {/* Job Title Input */}
        <Image src={job} alt="job icon" className="absolute sm:top-[1.79rem] sm:left-4 top-[1.1rem] left-9" />
        <input
          type="text"
          aria-label="Job Title or Keyword"
          placeholder="Job Title or Keyword"
          value={jobTitle}
          onChange={handleJobTitleChange}
          onFocus={() => setIsJobFocused(true)}
          onBlur={(e) => {
            if (!jobDropdownRef.current?.contains(e.relatedTarget)) {
              setIsJobFocused(false)
            }
          }}
          className="w-full text-[13px] py-3 pr-1 pl-16 sm:pr-3 sm:py-0 sm:p-3 sm:pl-10 placeholder-[#979EA9] border sm:border-r-0 border-[#989FAB] focus:outline-none"
        />
        {isJobFocused && filteredJobs.length > 0 && (
          <div
            ref={jobDropdownRef}
            className="absolute top-full left-0 w-[12.9rem] bg-white border border-t-0 mt-0 z-10"
            onMouseDown={(e) => e.preventDefault()}
          >
            {filteredJobs.map((job, index) => (
              <div
                key={index}
                onClick={() => {
                  setJobTitle(job)
                  setIsJobFocused(false)
                }}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {job}
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="h-8 w-[1px] bg-[#E1E1E1] m-auto absolute top-[1.1rem] left-[12.85rem] sm:flex hidden"></div>

        {/* Country Input */}
        <Image src={location} alt="location icon" className="absolute sm:top-[1.75rem] sm:right-[19.8rem] top-[4.4rem] right-[10.7rem]" />
        <input
          type="text"
          aria-label="Country or timezone"
          placeholder="Country or timezone"
          value={country}
          onChange={handleCountryChange}
          onFocus={() => setIsCountryFocused(true)}
          onBlur={(e) => {
            if (!countryDropdownRef.current?.contains(e.relatedTarget)) {
              setIsCountryFocused(false)
            }
          }}
          className="w-full text-[13px] placeholder-[#979EA9] py-3 pr-1 pl-16 sm:py-0 sm:pr-3 sm:p-3 sm:pl-10 border sm:border-l-0 border-[#989FAB] focus:outline-none"
        />
        {isCountryFocused && filteredCountries.length > 0 && (
          <div
            ref={countryDropdownRef}
            className="absolute top-full left-[12.85rem] w-[13.6rem] bg-white border border-t-0 mt-0 z-10"
            onMouseDown={(e) => e.preventDefault()}
          >
            {filteredCountries.map((c, index) => (
              <div
                key={index}
                onClick={() => {
                  setCountry(c)
                  setIsCountryFocused(false)
                }}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {c}
              </div>
            ))}
          </div>
        )}

        {/* Search Button */}
        <button
          onClick={handleSearch}
          aria-label="Search jobs"
          className={`${openSans.className} border flex items-center justify-center gap-2 border-[#181818] bg-[#181818] px-12 py-6 text-[13px] text-white`}
        >
          Search
        </button>
      </div>
    </div>
  )
}
