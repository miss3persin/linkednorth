'use client'

import { useMemo, useState } from 'react'

const textHasValue = (value) => {
  if (!value && value !== 0) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.some((item) => textHasValue(item))
  return Boolean(value)
}

const experiencesHaveContent = (experience) =>
  Array.isArray(experience) &&
  experience.some(
    (job) =>
      job?.role?.trim() ||
      job?.company?.trim() ||
      job?.description?.trim()
  )

const educationsHaveContent = (education) =>
  Array.isArray(education) &&
  education.some(
    (school) =>
      school?.school?.trim() ||
      school?.degree?.trim() ||
      school?.field?.trim()
  )

const projectsHaveContent = (projects) =>
  Array.isArray(projects) &&
  projects.some((project) => project?.name?.trim() || project?.description?.trim())

const certificationsHaveContent = (certifications) =>
  Array.isArray(certifications) &&
  certifications.some((cert) => cert?.name?.trim() || cert?.issuer?.trim())

const languagesHaveContent = (languages) =>
  Array.isArray(languages) &&
  languages.some((lang) => lang?.name?.trim())

const awardsHaveContent = (awards) =>
  Array.isArray(awards) &&
  awards.some((award) => award?.title?.trim() || award?.issuer?.trim())

const sectionConfig = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'How recruiters can reach you',
    validator: (resumeData) =>
      Boolean(resumeData.personal?.fullName?.trim() || resumeData.personal?.email?.trim()),
  },
  {
    id: 'summary',
    title: 'Professional Summary',
    description: 'High level focus and strengths',
    validator: (resumeData) => Boolean(resumeData.summary?.trim()),
  },
  {
    id: 'experience',
    title: 'Work Experience',
    description: 'Roles and measurable impact',
    validator: (resumeData) => experiencesHaveContent(resumeData.experience),
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Degrees and institutions',
    validator: (resumeData) => educationsHaveContent(resumeData.education),
  },
  {
    id: 'skills',
    title: 'Skills',
    description: 'Technical + interpersonal strengths',
    validator: (resumeData) =>
      textHasValue(resumeData.skills?.technical) || textHasValue(resumeData.skills?.soft),
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Side projects, open-source, MVPs',
    validator: (resumeData) => projectsHaveContent(resumeData.projects),
  },
  {
    id: 'certifications',
    title: 'Certifications',
    description: 'Certs, badges, and micro-credentials',
    validator: (resumeData) => certificationsHaveContent(resumeData.certifications),
  },
  {
    id: 'languages',
    title: 'Languages',
    description: 'Languages you speak and proficiency',
    validator: (resumeData) => languagesHaveContent(resumeData.languages),
  },
  {
    id: 'awards',
    title: 'Awards & Honors',
    description: 'Recognition and accolades',
    validator: (resumeData) => awardsHaveContent(resumeData.awards),
  },
  {
    id: 'interests',
    title: 'Interests',
    description: 'Things that make you you',
    validator: (resumeData) => textHasValue(resumeData.interests),
  },
]

export default function ResumeForm({ resumeData, setResumeData }) {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0)

  // --------- PERSONAL ----------
  const updatePersonal = (field, value) => {
    setResumeData({
      ...resumeData,
      personal: {
        ...resumeData.personal,
        [field]: value,
      },
    })
  }

  // --------- SUMMARY ----------
  const updateSummary = (value) => {
    setResumeData({
      ...resumeData,
      summary: value,
    })
  }

  // --------- EXPERIENCE ----------
  const updateExperience = (index, field, value) => {
    const updated = [...resumeData.experience]
    updated[index][field] = value
    setResumeData({ ...resumeData, experience: updated })
  }

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        {
          company: '',
          role: '',
          location: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    })
  }

  // --------- EDUCATION ----------
  const updateEducation = (index, field, value) => {
    const updated = [...resumeData.education]
    updated[index][field] = value
    setResumeData({ ...resumeData, education: updated })
  }

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        {
          school: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
        },
      ],
    })
  }

  // --------- PROJECTS ----------
  const updateProject = (index, field, value) => {
    const updated = [...resumeData.projects]
    updated[index][field] = value
    setResumeData({ ...resumeData, projects: updated })
  }

  const addProject = () => {
    setResumeData({
      ...resumeData,
      projects: [
        ...resumeData.projects,
        { name: '', description: '', link: '', technologies: [] },
      ],
    })
  }

  // --------- SKILLS ----------
  const updateSkills = (field, value) => {
    setResumeData({
      ...resumeData,
      skills: {
        ...resumeData.skills,
        [field]: value,
      },
    })
  }

  // --------- CERTIFICATIONS ----------
  const addCertification = () => {
    setResumeData({
      ...resumeData,
      certifications: [
        ...resumeData.certifications,
        { name: '', issuer: '', year: '' },
      ],
    })
  }

  const addLanguage = () => {
    setResumeData({
      ...resumeData,
      languages: [
        ...resumeData.languages,
        { name: '', proficiency: '' },
      ],
    })
  }

  const addAward = () => {
    setResumeData({
      ...resumeData,
      awards: [
        ...resumeData.awards,
        { title: '', issuer: '', year: '' },
      ],
    })
  }

  const sectionStatus = useMemo(
    () =>
      sectionConfig.map((section) => ({
        ...section,
        isComplete: section.validator(resumeData),
      })),
    [resumeData]
  )

  const completedSections = sectionStatus.filter((section) => section.isComplete).length
  const progress = Math.round((completedSections / sectionConfig.length) * 100)
  const activeSection = sectionConfig[activeSectionIndex] ?? sectionConfig[0]
  const canGoBack = activeSectionIndex > 0
  const canGoNext = activeSectionIndex < sectionConfig.length - 1
  const allSectionsComplete = completedSections === sectionConfig.length

  const renderSectionContent = () => {
    switch (activeSection.id) {
      case 'personal':
        return (
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-gray-700">Personal Information</h2>
            {[
              ['Full Name', 'fullName'],
              ['Email', 'email'],
              ['Phone', 'phone'],
              ['Location', 'location'],
              ['Website / Portfolio', 'website'],
              ['LinkedIn', 'linkedin'],
              ['GitHub', 'github'],
            ].map(([label, field]) => (
              <input
                key={field}
                className="border rounded px-3 py-2 text-sm w-full"
                placeholder={label}
                value={resumeData.personal[field]}
                onChange={(event) => updatePersonal(field, event.target.value)}
              />
            ))}
          </section>
        )

      case 'summary':
        return (
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-gray-700">Professional Summary</h2>
            <textarea
              className="border rounded px-3 py-2 text-sm w-full"
              rows={4}
              placeholder="Overview of your experience, strengths, and goals"
              value={resumeData.summary}
              onChange={(event) => updateSummary(event.target.value)}
            />
          </section>
        )

      case 'experience':
        return (
          <section className="flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-700">Work Experience</h2>
              <p className="text-xs text-gray-500">
                Add roles in reverse chronological order (you can add more later).
              </p>
            </div>
            {resumeData.experience.map((job, index) => (
              <div
                key={index}
                className="border rounded-xl p-4 flex flex-col gap-2 bg-white shadow-sm"
              >
                <input
                  className="border rounded px-3 py-2 text-sm"
                  placeholder="Job Title"
                  value={job.role}
                  onChange={(event) => updateExperience(index, 'role', event.target.value)}
                />
                <input
                  className="border rounded px-3 py-2 text-sm"
                  placeholder="Company"
                  value={job.company}
                  onChange={(event) => updateExperience(index, 'company', event.target.value)}
                />
                <input
                  className="border rounded px-3 py-2 text-sm"
                  placeholder="Location"
                  value={job.location}
                  onChange={(event) => updateExperience(index, 'location', event.target.value)}
                />
                <div className="flex gap-2">
                  <input
                    className="border rounded px-3 py-2 text-sm flex-1"
                    placeholder="Start Date"
                    value={job.startDate}
                    onChange={(event) => updateExperience(index, 'startDate', event.target.value)}
                  />
                  <input
                    className="border rounded px-3 py-2 text-sm flex-1"
                    placeholder="End Date"
                    value={job.endDate}
                    onChange={(event) => updateExperience(index, 'endDate', event.target.value)}
                  />
                </div>
                <textarea
                  className="border rounded px-3 py-2 text-sm"
                  placeholder="Key responsibilities and achievements"
                  rows={3}
                  value={job.description}
                  onChange={(event) => updateExperience(index, 'description', event.target.value)}
                />
              </div>
            ))}
            <button
              onClick={addExperience}
              className="self-start text-sm font-semibold text-sky-600 hover:text-sky-500"
            >
              + Add another role
            </button>
          </section>
        )

      case 'education':
        return (
          <section className="flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-700">Education</h2>
              <p className="text-xs text-gray-500">
                Include degrees, bootcamps, certifications, or self-directed learning.
              </p>
            </div>
            {resumeData.education.map((edu, index) => (
              <div
                key={index}
                className="border rounded-xl p-4 flex flex-col gap-2 bg-white shadow-sm"
              >
                <input
                  className="border rounded px-3 py-2 text-sm"
                  placeholder="Institution"
                  value={edu.school}
                  onChange={(event) => updateEducation(index, 'school', event.target.value)}
                />
                <input
                  className="border rounded px-3 py-2 text-sm"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(event) => updateEducation(index, 'degree', event.target.value)}
                />
                <input
                  className="border rounded px-3 py-2 text-sm"
                  placeholder="Field of Study"
                  value={edu.field}
                  onChange={(event) => updateEducation(index, 'field', event.target.value)}
                />
                <div className="flex gap-2">
                  <input
                    className="border rounded px-3 py-2 text-sm flex-1"
                    placeholder="Start Date"
                    value={edu.startDate}
                    onChange={(event) => updateEducation(index, 'startDate', event.target.value)}
                  />
                  <input
                    className="border rounded px-3 py-2 text-sm flex-1"
                    placeholder="End Date"
                    value={edu.endDate}
                    onChange={(event) => updateEducation(index, 'endDate', event.target.value)}
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addEducation}
              className="self-start text-sm font-semibold text-sky-600 hover:text-sky-500"
            >
              + Add another degree
            </button>
          </section>
        )

      case 'skills':
        return (
          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-gray-700">Skills</h2>
            <p className="text-xs text-gray-500">
              Separate items with commas or line breaks and our template renderer
              will normalize them for display.
            </p>
            <textarea
              rows={2}
              className="border rounded px-3 py-2 text-sm"
              placeholder="Technical skills (e.g. JavaScript, React, SQL)"
              value={resumeData.skills?.technical ?? ''}
              onChange={(event) => updateSkills('technical', event.target.value)}
            />
            <textarea
              rows={2}
              className="border rounded px-3 py-2 text-sm"
              placeholder="Soft skills (e.g. Leadership, Communication)"
              value={resumeData.skills?.soft ?? ''}
              onChange={(event) => updateSkills('soft', event.target.value)}
            />
          </section>
        )

      case 'projects':
        return (
          <section className="flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-700">Projects</h2>
              <p className="text-xs text-gray-500">
                Highlight things you shipped, open-source contributions, or quick
                experiments.
              </p>
            </div>
            {resumeData.projects.map((project, index) => (
              <div
                key={index}
                className="border rounded-xl p-4 flex flex-col gap-2 bg-white shadow-sm"
              >
                <input
                  className="border rounded px-3 py-2 text-sm"
                  placeholder="Project Name"
                  value={project.name}
                  onChange={(event) => updateProject(index, 'name', event.target.value)}
                />
                <input
                  className="border rounded px-3 py-2 text-sm"
                  placeholder="Link (optional)"
                  value={project.link}
                  onChange={(event) => updateProject(index, 'link', event.target.value)}
                />
                <textarea
                  rows={3}
                  className="border rounded px-3 py-2 text-sm"
                  placeholder="What it does and your role"
                  value={project.description}
                  onChange={(event) =>
                    updateProject(index, 'description', event.target.value)
                  }
                />
              </div>
            ))}
            <button
              onClick={addProject}
              className="self-start text-sm font-semibold text-sky-600 hover:text-sky-500"
            >
              + Add another project
            </button>
          </section>
        )

      case 'certifications':
        return (
          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-gray-700">Certifications</h2>
            {resumeData.certifications.map((cert, index) => (
              <div
                key={index}
                className="border rounded-xl p-4 flex flex-col gap-2 bg-white shadow-sm"
              >
                <input
                  className="border rounded px-3 py-2 text-sm"
                  placeholder="Certification Name"
                  value={cert.name}
                  onChange={(event) => {
                    const updated = [...resumeData.certifications]
                    updated[index].name = event.target.value
                    setResumeData({ ...resumeData, certifications: updated })
                  }}
                />
                <input
                  className="border rounded px-3 py-2 text-sm"
                  placeholder="Issuer"
                  value={cert.issuer}
                  onChange={(event) => {
                    const updated = [...resumeData.certifications]
                    updated[index].issuer = event.target.value
                    setResumeData({ ...resumeData, certifications: updated })
                  }}
                />
                <input
                  className="border rounded px-3 py-2 text-sm"
                  placeholder="Year"
                  value={cert.year}
                  onChange={(event) => {
                    const updated = [...resumeData.certifications]
                    updated[index].year = event.target.value
                    setResumeData({ ...resumeData, certifications: updated })
                  }}
                />
              </div>
            ))}
            <button
              onClick={addCertification}
              className="self-start text-sm font-semibold text-sky-600 hover:text-sky-500"
            >
              + Add another certification
            </button>
          </section>
        )

      case 'languages':
        return (
          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-gray-700">Languages</h2>
            {resumeData.languages.map((lang, index) => (
              <div
                key={index}
                className="border rounded-xl p-4 flex flex-col gap-2 bg-white shadow-sm"
              >
                <input
                  className="border rounded px-3 py-2 text-sm"
                  placeholder="Language (e.g. English)"
                  value={lang.name}
                  onChange={(event) => {
                    const updated = [...resumeData.languages]
                    updated[index].name = event.target.value
                    setResumeData({ ...resumeData, languages: updated })
                  }}
                />
                <input
                  className="border rounded px-3 py-2 text-sm"
                  placeholder="Proficiency (e.g. Fluent)"
                  value={lang.proficiency}
                  onChange={(event) => {
                    const updated = [...resumeData.languages]
                    updated[index].proficiency = event.target.value
                    setResumeData({ ...resumeData, languages: updated })
                  }}
                />
              </div>
            ))}
            <button
              onClick={addLanguage}
              className="self-start text-sm font-semibold text-sky-600 hover:text-sky-500"
            >
              + Add another language
            </button>
          </section>
        )

      case 'awards':
        return (
          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-gray-700">Awards & Honors</h2>
            {resumeData.awards.map((award, index) => (
              <div
                key={index}
                className="border rounded-xl p-4 flex flex-col gap-2 bg-white shadow-sm"
              >
                <input
                  className="border rounded px-3 py-2 text-sm"
                  placeholder="Award Title"
                  value={award.title}
                  onChange={(event) => {
                    const updated = [...resumeData.awards]
                    updated[index].title = event.target.value
                    setResumeData({ ...resumeData, awards: updated })
                  }}
                />
                <input
                  className="border rounded px-3 py-2 text-sm"
                  placeholder="Issuer / Organization"
                  value={award.issuer}
                  onChange={(event) => {
                    const updated = [...resumeData.awards]
                    updated[index].issuer = event.target.value
                    setResumeData({ ...resumeData, awards: updated })
                  }}
                />
                <input
                  className="border rounded px-3 py-2 text-sm"
                  placeholder="Year"
                  value={award.year}
                  onChange={(event) => {
                    const updated = [...resumeData.awards]
                    updated[index].year = event.target.value
                    setResumeData({ ...resumeData, awards: updated })
                  }}
                />
              </div>
            ))}
            <button
              onClick={addAward}
              className="self-start text-sm font-semibold text-sky-600 hover:text-sky-500"
            >
              + Add another award
            </button>
          </section>
        )

      case 'interests':
        return (
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-gray-700">Interests</h2>
            <textarea
              rows={3}
              className="border rounded px-3 py-2 text-sm"
              placeholder="Fun facts, hobbies, or interests that showcase your personality"
              value={resumeData.interests ?? ''}
              onChange={(event) =>
                setResumeData({ ...resumeData, interests: event.target.value })
              }
            />
          </section>
        )

      default:
        return null
    }
  }

  return (
    <div className="mt-6 w-full flex flex-col gap-6 px-2 sm:px-0">
      <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 shadow-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
            <span>{progress}% complete</span>
            <span>
              Section {activeSectionIndex + 1} of {sectionConfig.length}
            </span>
          </div>
          <div className="relative h-2 w-full rounded-full bg-gray-200">
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {sectionStatus.map((section, index) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSectionIndex(index)}
              className={[
                'flex flex-col rounded-xl border px-2 py-1.5 text-left text-[11px] transition',
                activeSection.id === section.id
                  ? 'border-slate-900 bg-white shadow'
                  : 'border-transparent bg-gray-100 hover:bg-gray-200',
              ].join(' ')}
            >
              <span className="text-[9px] uppercase tracking-[0.2em] text-gray-500">
                Step {index + 1}
              </span>
              <span className="text-sm font-semibold text-gray-800">{section.title}</span>
              <span className="text-[11px] text-gray-500">
                {section.isComplete ? 'Complete' : section.description}
              </span>
            </button>
          ))}
        </div>
      </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
            {renderSectionContent()}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => setActiveSectionIndex((prev) => Math.max(0, prev - 1))}
            disabled={!canGoBack}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() =>
              setActiveSectionIndex((prev) =>
                Math.min(sectionConfig.length - 1, prev + 1)
              )
            }
            className="w-full rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            {canGoNext
              ? 'Next section'
              : allSectionsComplete
                ? 'You are done'
                : "You haven't completed all the forms"}
          </button>
        </div>
          <div className="mt-4">
            <div className="flex flex-col gap-1 text-[10px] font-semibold uppercase text-gray-500 sm:flex-row sm:justify-between sm:items-center">
              <span>{progress}% complete</span>
              <span>{completedSections} / {sectionConfig.length} done</span>
            </div>
          <div className="mt-2 relative h-1.5 w-full rounded-full bg-gray-200">
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
