'use client'

import React, { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { Search, Briefcase, MapPin } from 'lucide-react'
import { Loader } from '@/app/components/ui/Loader'
import jobIcon from '/public/work.png'
import locationIcon from '/public/location.png'

const COUNTRIES = [
  { name: "United States", flag: "🇺🇸" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Mexico", flag: "🇲🇽" },
  { name: "Brazil", flag: "🇧🇷" },
  { name: "Argentina", flag: "🇦🇷" },
  { name: "Colombia", flag: "🇨🇴" },
  { name: "Chile", flag: "🇨🇱" },
  { name: "Peru", flag: "🇵🇪" },
  { name: "Venezuela", flag: "🇻🇪" },
  { name: "Ecuador", flag: "🇪🇨" },
  { name: "Bolivia", flag: "🇧🇴" },
  { name: "Paraguay", flag: "🇵🇾" },
  { name: "Uruguay", flag: "🇺🇾" },
  { name: "Cuba", flag: "🇨🇺" },
  { name: "Dominican Republic", flag: "🇩🇴" },
  { name: "Guatemala", flag: "🇬🇹" },
  { name: "Honduras", flag: "🇭🇳" },
  { name: "El Salvador", flag: "🇸🇻" },
  { name: "Costa Rica", flag: "🇨🇷" },
  { name: "Panama", flag: "🇵🇦" },
  { name: "Jamaica", flag: "🇯🇲" },
  { name: "Trinidad and Tobago", flag: "🇹🇹" },
  { name: "Haiti", flag: "🇭🇹" },
  { name: "Nicaragua", flag: "🇳🇮" },
  { name: "Belize", flag: "🇧🇿" },
  { name: "Guyana", flag: "🇬🇾" },
  { name: "Suriname", flag: "🇸🇷" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "France", flag: "🇫🇷" },
  { name: "Spain", flag: "🇪🇸" },
  { name: "Italy", flag: "🇮🇹" },
  { name: "Netherlands", flag: "🇳🇱" },
  { name: "Sweden", flag: "🇸🇪" },
  { name: "Norway", flag: "🇳🇴" },
  { name: "Denmark", flag: "🇩🇰" },
  { name: "Finland", flag: "🇫🇮" },
  { name: "Switzerland", flag: "🇨🇭" },
  { name: "Austria", flag: "🇦🇹" },
  { name: "Belgium", flag: "🇧🇪" },
  { name: "Ireland", flag: "🇮🇪" },
  { name: "Poland", flag: "🇵🇱" },
  { name: "Portugal", flag: "🇵🇹" },
  { name: "Czech Republic", flag: "🇨🇿" },
  { name: "Romania", flag: "🇷🇴" },
  { name: "Hungary", flag: "🇭🇺" },
  { name: "Greece", flag: "🇬🇷" },
  { name: "Ukraine", flag: "🇺🇦" },
  { name: "Russia", flag: "🇷🇺" },
  { name: "Turkey", flag: "🇹🇷" },
  { name: "Bulgaria", flag: "🇧🇬" },
  { name: "Serbia", flag: "🇷🇸" },
  { name: "Croatia", flag: "🇭🇷" },
  { name: "Slovakia", flag: "🇸🇰" },
  { name: "Slovenia", flag: "🇸🇮" },
  { name: "Estonia", flag: "🇪🇪" },
  { name: "Latvia", flag: "🇱🇻" },
  { name: "Lithuania", flag: "🇱🇹" },
  { name: "Luxembourg", flag: "🇱🇺" },
  { name: "Malta", flag: "🇲🇹" },
  { name: "Iceland", flag: "🇮🇸" },
  { name: "Montenegro", flag: "🇲🇪" },
  { name: "Albania", flag: "🇦🇱" },
  { name: "North Macedonia", flag: "🇲🇰" },
  { name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { name: "Moldova", flag: "🇲🇩" },
  { name: "Belarus", flag: "🇧🇾" },
  { name: "Cyprus", flag: "🇨🇾" },
  { name: "Nigeria", flag: "🇳🇬" },
  { name: "South Africa", flag: "🇿🇦" },
  { name: "Kenya", flag: "🇰🇪" },
  { name: "Ghana", flag: "🇬🇭" },
  { name: "Egypt", flag: "🇪🇬" },
  { name: "Ethiopia", flag: "🇪🇹" },
  { name: "Tanzania", flag: "🇹🇿" },
  { name: "Uganda", flag: "🇺🇬" },
  { name: "Rwanda", flag: "🇷🇼" },
  { name: "Senegal", flag: "🇸🇳" },
  { name: "Ivory Coast", flag: "🇨🇮" },
  { name: "Cameroon", flag: "🇨🇲" },
  { name: "Morocco", flag: "🇲🇦" },
  { name: "Tunisia", flag: "🇹🇳" },
  { name: "Algeria", flag: "🇩🇿" },
  { name: "Sudan", flag: "🇸🇩" },
  { name: "Zimbabwe", flag: "🇿🇼" },
  { name: "Zambia", flag: "🇿🇲" },
  { name: "Mozambique", flag: "🇲🇿" },
  { name: "Angola", flag: "🇦🇴" },
  { name: "Namibia", flag: "🇳🇦" },
  { name: "Botswana", flag: "🇧🇼" },
  { name: "Malawi", flag: "🇲🇼" },
  { name: "Libya", flag: "🇱🇾" },
  { name: "Mali", flag: "🇲🇱" },
  { name: "Niger", flag: "🇳🇪" },
  { name: "Chad", flag: "🇹🇩" },
  { name: "Mauritius", flag: "🇲🇺" },
  { name: "Seychelles", flag: "🇸🇨" },
  { name: "Bhutan", flag: "🇧🇹" },
  { name: "Brunei", flag: "🇧🇳" },
  { name: "East Timor", flag: "🇹🇱" },
  { name: "Kyrgyzstan", flag: "🇰🇬" },
  { name: "Laos", flag: "🇱🇦" },
  { name: "Maldives", flag: "🇲🇻" },
  { name: "North Korea", flag: "🇰🇵" },
  { name: "Tajikistan", flag: "🇹🇯" },
  { name: "Turkmenistan", flag: "🇹🇲" },
  { name: "Antigua and Barbuda", flag: "🇦🇬" },
  { name: "Bahamas", flag: "🇧🇸" },
  { name: "Barbados", flag: "🇧🇧" },
  { name: "Dominica", flag: "🇩🇲" },
  { name: "Grenada", flag: "🇬🇩" },
  { name: "Saint Kitts and Nevis", flag: "🇰🇳" },
  { name: "Saint Lucia", flag: "🇱🇨" },
  { name: "Saint Vincent and the Grenadines", flag: "🇻🇨" },
  { name: "Andorra", flag: "🇦🇩" },
  { name: "Kosovo", flag: "🇽🇰" },
  { name: "Liechtenstein", flag: "🇱🇮" },
  { name: "Monaco", flag: "🇲🇨" },
  { name: "San Marino", flag: "🇸🇲" },
  { name: "Vatican City", flag: "🇻🇦" },
]

const POPULAR_ROLES = [
  { label: "Software Engineer", icon: "💻" },
  { label: "Product Manager", icon: "📋" },
  { label: "Data Scientist", icon: "📊" },
  { label: "UX Designer", icon: "🎨" },
  { label: "Marketing Manager", icon: "📣" },
  { label: "Frontend Developer", icon: "🖥️" },
]

function highlightMatch(text, query) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-bold text-black">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  )
}

export const SearchBar = () => {
  const [jobTitle, setJobTitle] = useState('')
  const [country, setCountry] = useState('')
  const [filteredJobs, setFilteredJobs] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [isJobFocused, setIsJobFocused] = useState(false)
  const [isCountryFocused, setIsCountryFocused] = useState(false)
  const [loadingJobs, setLoadingJobs] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const jobDropdownRef = useRef(null)
  const countryDropdownRef = useRef(null)
  const debounceTimer = useRef(null)
  const router = useRouter()
  const pathname = usePathname()

  const fetchJobSuggestions = async (query) => {
    if (!query.trim()) {
      setFilteredJobs([])
      return
    }

    setLoadingJobs(true)
    setIsAnimating(true)
    try {
      const params = new URLSearchParams()
      params.append('search', query)
      params.append('limit', '50')

      const res = await fetch(`/api/jobs?${params.toString()}`)
      if (!res.ok) throw new Error('Failed')

      const data = await res.json()
      const titles = [
        ...new Set((data.jobs || []).map((j) => j.jobTitle).filter(Boolean)),
      ].slice(0, 7)
      setFilteredJobs(titles)
    } catch {
      setFilteredJobs([])
    } finally {
      setIsAnimating(false)
      setLoadingJobs(false)
    }
  }

  const debouncedFetchJobs = useCallback((value) => {
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => fetchJobSuggestions(value), 350)
  }, [])

  const fetchLocationSuggestions = (query) => {
    if (!query.trim()) {
      setFilteredCountries(COUNTRIES.slice(0, 6))
      return
    }

    const matches = COUNTRIES.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8)
    setFilteredCountries(matches)
  }

  const handleJobTitleChange = (e) => {
    const value = e.target.value
    setJobTitle(value)
    debouncedFetchJobs(value)
  }

  const handleCountryChange = (e) => {
    const value = e.target.value
    setCountry(value)
    fetchLocationSuggestions(value)
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (jobTitle.trim()) params.append('search', jobTitle.trim())
    if (country.trim()) params.append('geo', country.trim())
    const query = params.toString() ? `?${params.toString()}` : ''

    setIsJobFocused(false)
    setIsCountryFocused(false)

    if (pathname === '/') {
      router.push(`/jobs${query}`)
      return
    }

    router.push(`${pathname}${query}`)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="flex items-center justify-center py-4 sm:w-[35rem]">
      <div className="relative w-full flex flex-col sm:flex-row sm:gap-0 gap-2">

        <Image src={jobIcon} alt="job icon" className="absolute sm:top-[1.79rem] sm:left-4 top-[1.1rem] left-9" />
        <input
          type="text"
          placeholder="Job Title or Keyword"
          value={jobTitle}
          onChange={handleJobTitleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsJobFocused(true)
            if (!jobTitle.trim()) setFilteredJobs([])
          }}
          onBlur={(e) => {
            if (!jobDropdownRef.current?.contains(e.relatedTarget)) {
              setTimeout(() => setIsJobFocused(false), 100)
            }
          }}
          className="w-full text-[13px] py-3 pr-1 pl-16 sm:pr-3 sm:p-3 sm:pl-10 placeholder-[#979EA9] border sm:border-r-0 border-[#989FAB] focus:outline-none"
        />

        {isJobFocused && (
          <div
            ref={jobDropdownRef}
            className="absolute top-[calc(100%+4px)] sm:top-full left-0 w-full sm:w-[55%] bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="px-3 py-2 border-b border-gray-50">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {loadingJobs ? 'Searching...' : jobTitle ? 'Suggestions' : 'Popular Roles'}
              </p>
            </div>

            {loadingJobs && (
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-400">
                <Loader size="xs" showMessage={false} inline className="text-gray-400" />
                Finding jobs...
              </div>
            )}

            {!loadingJobs && jobTitle && filteredJobs.map((job, i) => (
              <button
                key={i}
                onClick={() => { setJobTitle(job); setIsJobFocused(false) }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left transition-colors group"
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-white flex items-center justify-center transition-colors">
                  <Briefcase size={13} className="text-gray-500" />
                </span>
                <span className="text-sm text-gray-700 truncate">
                  {highlightMatch(job, jobTitle)}
                </span>
              </button>
            ))}

            {!loadingJobs && !jobTitle && POPULAR_ROLES.map((role, i) => (
              <button
                key={i}
                onClick={() => { setJobTitle(role.label); setIsJobFocused(false) }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left transition-colors group"
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-sm">
                  {role.icon}
                </span>
                <span className="text-sm text-gray-600">{role.label}</span>
              </button>
            ))}

            {!loadingJobs && jobTitle && filteredJobs.length === 0 && (
              <div className="flex flex-col items-center py-5 gap-1">
                <Search size={18} className="text-gray-300" />
                <p className="text-sm text-gray-400">No matching roles found</p>
                <p className="text-xs text-gray-300">Try a different keyword</p>
              </div>
            )}
          </div>
        )}

        <div className="h-8 w-[1px] bg-[#E1E1E1] m-auto absolute top-[1.1rem] left-[12.85rem] sm:flex hidden" />

        <Image src={locationIcon} alt="location icon" className="absolute sm:top-[1.75rem] sm:right-[19.8rem] top-[4.4rem] right-[10.7rem]" />
        <input
          type="text"
          placeholder="Country or timezone"
          value={country}
          onChange={handleCountryChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsCountryFocused(true)
            fetchLocationSuggestions(country)
          }}
          onBlur={(e) => {
            if (!countryDropdownRef.current?.contains(e.relatedTarget)) {
              setTimeout(() => setIsCountryFocused(false), 100)
            }
          }}
          className="w-full text-[13px] placeholder-[#979EA9] py-3 pr-1 pl-16 sm:pr-3 sm:p-3 sm:pl-10 border sm:border-l-0 border-[#989FAB] focus:outline-none"
        />

        {isCountryFocused && (
          <div
            ref={countryDropdownRef}
            className="absolute top-[calc(100%+4px)] sm:top-full right-0 w-full sm:w-[45%] bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="px-3 py-2 border-b border-gray-50 flex items-center justify-between">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {country ? 'Locations' : 'Popular Countries'}
              </p>
              {country && (
                <button
                  onClick={() => { setCountry(''); fetchLocationSuggestions('') }}
                  className="text-[10px] text-gray-400 hover:text-black transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {filteredCountries.map((c, i) => {
              const flag = typeof c === 'object' ? c.flag : ''
              const name = typeof c === 'object' ? c.name : c
              return (
                <button
                  key={i}
                  onClick={() => { setCountry(name); setIsCountryFocused(false) }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left transition-colors group"
                >
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-base">
                    {flag || <MapPin size={13} className="text-gray-400" />}
                  </span>
                  <span className="text-sm text-gray-700">
                    {highlightMatch(name, country)}
                  </span>
                </button>
              )
            })}

            {!country && (
              <button
                onClick={() => { setCountry('Remote'); setIsCountryFocused(false) }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 text-left transition-colors border-t border-gray-50"
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-base">🌍</span>
                <span className="text-sm text-gray-700 font-medium">Remote (Worldwide)</span>
              </button>
            )}

            {country && filteredCountries.length === 0 && (
              <div className="flex flex-col items-center py-5 gap-1">
                <MapPin size={18} className="text-gray-300" />
                <p className="text-sm text-gray-400">No matching locations</p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleSearch}
          className="border flex items-center justify-center gap-2 border-[#181818] bg-[#181818] px-12 py-6 text-[13px] text-white skip-squared"
        >
          Search
        </button>
      </div>
    </div>
  )
}
