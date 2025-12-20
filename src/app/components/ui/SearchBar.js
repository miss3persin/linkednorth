'use client'

import React, { useState, useRef } from 'react'
import { Open_Sans } from 'next/font/google'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import jobIcon from '/public/work.png'
import locationIcon from '/public/location.png'

// const openSans = Open_Sans({ subsets: ['latin'] })

export const SearchBar = () => {
  const [jobTitle, setJobTitle] = useState('')
  const [country, setCountry] = useState('')
  const [filteredJobs, setFilteredJobs] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [isJobFocused, setIsJobFocused] = useState(false)
  const [isCountryFocused, setIsCountryFocused] = useState(false)
  const [loadingJobs, setLoadingJobs] = useState(false)
  const [loadingCountries, setLoadingCountries] = useState(false)

  const jobDropdownRef = useRef(null)
  const countryDropdownRef = useRef(null)
  const router = useRouter()

  // --- Debounce helper ---
  function debounce(fn, delay) {
    let timer
    return (...args) => {
      clearTimeout(timer)
      timer = setTimeout(() => fn(...args), delay)
    }
  }

  // --- Fetch job title suggestions ---
// --- Fetch job title suggestions ---
const fetchJobSuggestions = async (query) => {
  if (!query.trim()) return setFilteredJobs([])
  setLoadingJobs(true)
  try {
    const res = await fetch(`/api/jobs?jobTitle=${encodeURIComponent(query)}`)
    if (!res.ok) throw new Error('Failed to fetch job suggestions')
    const { jobs } = await res.json()
    if (!jobs) return setFilteredJobs([])

    const titles = [
      ...new Set(jobs.map((job) => job.jobTitle).filter(Boolean).slice(0, 8)),
    ]
    setFilteredJobs(titles)
  } catch (err) {
    console.error('Error fetching job suggestions:', err)
    setFilteredJobs([])
  } finally {
    setLoadingJobs(false)
  }
}

  const debouncedFetchJobs = debounce(fetchJobSuggestions, 400)

  // --- Fetch country suggestions ---
// --- Fetch location suggestions (static dataset) ---
const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Netherlands",
  "India",
  "Nigeria",
  "South Africa",
  "Spain",
  "Italy",
  "Brazil",
  "Singapore",
  "Japan",
  "Poland",
  "Sweden",
  "Norway",
  "Ireland",
  "Switzerland",
  "Mexico",
  "New Zealand",
  "Philippines",
  "Kenya",
  "Ghana",
];

const fetchLocationSuggestions = async (query) => {
  if (!query.trim()) {
    setFilteredCountries([]);
    return;
  }

  setLoadingCountries(true);

  try {
    const matches = COUNTRIES.filter((c) =>
      c.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);

    setFilteredCountries(matches);
  } catch (err) {
    console.error("Error filtering locations:", err);
    setFilteredCountries([]);
  } finally {
    setLoadingCountries(false);
  }
};

const debouncedFetchCountries = debounce(fetchLocationSuggestions, 300);

  // --- Input handlers ---
  const handleJobTitleChange = (e) => {
    const value = e.target.value
    setJobTitle(value)
    debouncedFetchJobs(value)
  }

  const handleCountryChange = (e) => {
    const value = e.target.value
    setCountry(value)
    debouncedFetchCountries(value)
  }

  // --- Handle search ---
  const handleSearch = () => {
    if (!jobTitle.trim() && !country.trim()) {
      alert('Please enter a job title or location.')
      return
    }

    router.push(
      `/jobs?jobTitle=${encodeURIComponent(jobTitle)}&country=${encodeURIComponent(country)}`
    )
  }

  return (
    <div className="flex items-center justify-center py-4 sm:w-[35rem]">
      <div className="relative w-full flex flex-col sm:flex-row sm:gap-0 gap-2">

        {/* --- Job Input --- */}
        <Image
          src={jobIcon}
          alt="job icon"
          className="absolute sm:top-[1.79rem] sm:left-4 top-[1.1rem] left-9"
        />
        <input
          type="text"
          placeholder="Job Title or Keyword"
          value={jobTitle}
          onChange={handleJobTitleChange}
          onFocus={() => setIsJobFocused(true)}
          onBlur={(e) => {
            if (!jobDropdownRef.current?.contains(e.relatedTarget)) {
              setIsJobFocused(false)
            }
          }}
          className="w-full text-[13px] py-3 pr-1 pl-16 sm:pr-3 sm:p-3 sm:pl-10 placeholder-[#979EA9] border sm:border-r-0 border-[#989FAB] focus:outline-none"
        />

        {isJobFocused && (
          <div
            ref={jobDropdownRef}
            className="absolute top-full left-0 w-[12.9rem] bg-white border border-t-0 mt-0 z-10"
            onMouseDown={(e) => e.preventDefault()}
          >
            {loadingJobs && <div className="p-2 text-gray-500 text-sm">Loading...</div>}
            {!loadingJobs &&
              filteredJobs.map((job, index) => (
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
            {!loadingJobs && filteredJobs.length === 0 && jobTitle && (
              <div className="p-2 text-gray-500 text-sm">No results</div>
            )}
          </div>
        )}

        {/* --- Divider --- */}
        <div className="h-8 w-[1px] bg-[#E1E1E1] m-auto absolute top-[1.1rem] left-[12.85rem] sm:flex hidden"></div>

        {/* --- Location Input --- */}
        <Image
          src={locationIcon}
          alt="location icon"
          className="absolute sm:top-[1.75rem] sm:right-[19.8rem] top-[4.4rem] right-[10.7rem]"
        />
        <input
          type="text"
          placeholder="Country or timezone"
          value={country}
          onChange={handleCountryChange}
          onFocus={() => setIsCountryFocused(true)}
          onBlur={(e) => {
            if (!countryDropdownRef.current?.contains(e.relatedTarget)) {
              setIsCountryFocused(false)
            }
          }}
          className="w-full text-[13px] placeholder-[#979EA9] py-3 pr-1 pl-16 sm:pr-3 sm:p-3 sm:pl-10 border sm:border-l-0 border-[#989FAB] focus:outline-none"
        />

        {isCountryFocused && (
          <div
            ref={countryDropdownRef}
            className="absolute top-full left-[12.85rem] w-[13.6rem] bg-white border border-t-0 mt-0 z-10"
            onMouseDown={(e) => e.preventDefault()}
          >
            {loadingCountries && <div className="p-2 text-gray-500 text-sm">Loading...</div>}
            {!loadingCountries &&
              filteredCountries.map((c, index) => (
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
            {!loadingCountries && filteredCountries.length === 0 && country && (
              <div className="p-2 text-gray-500 text-sm">No results</div>
            )}
          </div>
        )}

        {/* --- Search Button --- */}
        <button
          onClick={handleSearch}
          className="border flex items-center justify-center gap-2 border-[#181818] bg-[#181818] px-12 py-6 text-[13px] text-white"
        >
          Search
        </button>
      </div>
    </div>
  )
}
