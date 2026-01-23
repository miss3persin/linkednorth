export default function ProfessionalTemplate({ resumeData }) {
  const {
    personal,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    awards,
    interests,
  } = resumeData

  const normalizedSkills = {
    technical: Array.isArray(skills?.technical)
      ? skills.technical
      : [],
    soft: Array.isArray(skills?.soft)
      ? skills.soft
      : [],
  }

  const normalizedInterests = Array.isArray(interests)
    ? interests
    : typeof interests === 'string'
      ? interests.split(',').map(i => i.trim()).filter(Boolean)
      : []



  return (
    <div className="bg-white text-gray-900 text-[13px] leading-relaxed p-10 max-w-[800px] mx-auto font-sans">

      {/* ================= HEADER ================= */}
      <header className="border-b border-gray-300 pb-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {personal.fullName}
        </h1>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-gray-600 text-sm">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.github && <span>{personal.github}</span>}
          {personal.website && <span>{personal.website}</span>}
        </div>
      </header>

      {/* ================= SUMMARY ================= */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-700 mb-2">
            Professional Summary
          </h2>
          <p className="text-gray-800">{summary}</p>
        </section>
      )}

      {/* ================= EXPERIENCE ================= */}
      {experience?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-700 mb-3">
            Experience
          </h2>

          {experience.map((job, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-sm">
                    {job.role}
                  </h3>
                  <p className="text-gray-600">
                    {job.company}
                    {job.location && ` • ${job.location}`}
                  </p>
                </div>

                <p className="text-xs text-gray-500 whitespace-nowrap">
                  {job.startDate} – {job.endDate || 'Present'}
                </p>
              </div>

              {job.description && (
                <p className="mt-1 text-gray-800">
                  {job.description}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ================= EDUCATION ================= */}
      {education?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-700 mb-3">
            Education
          </h2>

          {education.map((edu, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-sm">
                    {edu.degree}
                    {edu.field && `, ${edu.field}`}
                  </h3>
                  <p className="text-gray-600">{edu.school}</p>
                </div>

                <p className="text-xs text-gray-500 whitespace-nowrap">
                  {edu.startDate} – {edu.endDate}
                </p>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ================= SKILLS ================= */}
      {(normalizedSkills.technical.length > 0 ||
        normalizedSkills.soft.length > 0) && (
          <section className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-700 mb-3">
              Skills
            </h2>

            {normalizedSkills.technical.length > 0 && (
              <p className="mb-1">
                <span className="font-semibold">Technical:</span>{' '}
                {normalizedSkills.technical.join(', ')}
              </p>
            )}

            {normalizedSkills.soft.length > 0 && (
              <p>
                <span className="font-semibold">Soft:</span>{' '}
                {normalizedSkills.soft.join(', ')}
              </p>
            )}
          </section>
        )}


      {/* ================= PROJECTS ================= */}
      {projects?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-700 mb-3">
            Projects
          </h2>

          {projects.map((project, i) => (
            <div key={i} className="mb-3">
              <h3 className="font-semibold text-sm">
                {project.name}
                {project.link && (
                  <span className="text-gray-500 font-normal">
                    {' '}• {project.link}
                  </span>
                )}
              </h3>
              <p className="text-gray-800">{project.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* ================= CERTIFICATIONS ================= */}
      {certifications?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-700 mb-3">
            Certifications
          </h2>

          {certifications.map((cert, i) => (
            <p key={i}>
              {cert.name} — {cert.issuer} ({cert.year})
            </p>
          ))}
        </section>
      )}

      {/* ================= LANGUAGES ================= */}
      {languages?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-700 mb-3">
            Languages
          </h2>

          <p>
            {languages.map(l => `${l.name} (${l.proficiency})`).join(', ')}
          </p>
        </section>
      )}

      {/* ================= AWARDS ================= */}
      {awards?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-700 mb-3">
            Awards
          </h2>

          {awards.map((award, i) => (
            <p key={i}>
              {award.title} — {award.issuer} ({award.year})
            </p>
          ))}
        </section>
      )}

      {/* ================= INTERESTS ================= */}
      {normalizedInterests.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-700 mb-3">
            Interests
          </h2>
          <p>{normalizedInterests.join(', ')}</p>
        </section>
      )}

    </div>
  )
}
