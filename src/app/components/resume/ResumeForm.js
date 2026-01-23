'use client'

export default function ResumeForm({ resumeData, setResumeData }) {
  // ---------- PERSONAL ----------
  const updatePersonal = (field, value) => {
    setResumeData({
      ...resumeData,
      personal: {
        ...resumeData.personal,
        [field]: value,
      },
    })
  }

  // ---------- SUMMARY ----------
  const updateSummary = (value) => {
    setResumeData({
      ...resumeData,
      summary: value,
    })
  }

  // ---------- EXPERIENCE ----------
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
          company: "",
          role: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    })
  }

  // ---------- EDUCATION ----------
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
          school: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
        },
      ],
    })
  }

  // ---------- PROJECTS ----------
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
        { name: "", description: "", link: "" },
      ],
    })
  }

  // ---------- SKILLS ----------
  const updateSkills = (field, value) => {
    setResumeData({
      ...resumeData,
      skills: {
        ...resumeData.skills,
        [field]: value,
      },
    })
  }

  return (
    <div className="mt-6 max-w-xl flex flex-col gap-6">

      {/* PERSONAL INFO */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          Personal Information
        </h2>

        {[
          ["Full Name", "fullName"],
          ["Email", "email"],
          ["Phone", "phone"],
          ["Location", "location"],
          ["Website / Portfolio", "website"],
          ["LinkedIn", "linkedin"],
          ["GitHub", "github"],
        ].map(([label, field]) => (
          <input
            key={field}
            className="border rounded px-3 py-2 text-sm w-full mb-2"
            placeholder={label}
            value={resumeData.personal[field]}
            onChange={(e) => updatePersonal(field, e.target.value)}
          />
        ))}
      </section>

      {/* SUMMARY */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          Professional Summary
        </h2>
        <textarea
          className="border rounded px-3 py-2 text-sm w-full"
          rows={4}
          placeholder="Concise overview of your experience, strengths, and goals"
          value={resumeData.summary}
          onChange={(e) => updateSummary(e.target.value)}
        />
      </section>

      {/* EXPERIENCE */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          Work Experience
        </h2>

        {resumeData.experience.map((job, index) => (
          <div key={index} className="border rounded p-3 mb-3 flex flex-col gap-2">
            <input
              placeholder="Job Title"
              className="border rounded px-3 py-2 text-sm"
              value={job.role}
              onChange={(e) =>
                updateExperience(index, "role", e.target.value)
              }
            />
            <input
              placeholder="Company"
              className="border rounded px-3 py-2 text-sm"
              value={job.company}
              onChange={(e) =>
                updateExperience(index, "company", e.target.value)
              }
            />
            <input
              placeholder="Location"
              className="border rounded px-3 py-2 text-sm"
              value={job.location}
              onChange={(e) =>
                updateExperience(index, "location", e.target.value)
              }
            />
            <div className="flex gap-2">
              <input
                placeholder="Start Date"
                className="border rounded px-3 py-2 text-sm w-full"
                value={job.startDate}
                onChange={(e) =>
                  updateExperience(index, "startDate", e.target.value)
                }
              />
              <input
                placeholder="End Date"
                className="border rounded px-3 py-2 text-sm w-full"
                value={job.endDate}
                onChange={(e) =>
                  updateExperience(index, "endDate", e.target.value)
                }
              />
            </div>
            <textarea
              placeholder="Key responsibilities and achievements"
              className="border rounded px-3 py-2 text-sm"
              rows={3}
              value={job.description}
              onChange={(e) =>
                updateExperience(index, "description", e.target.value)
              }
            />
          </div>
        ))}

        <button
          onClick={addExperience}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add Experience
        </button>
      </section>

      {/* EDUCATION */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          Education
        </h2>

        {resumeData.education.map((edu, index) => (
          <div key={index} className="border rounded p-3 mb-3 flex flex-col gap-2">
            <input
              placeholder="Institution"
              className="border rounded px-3 py-2 text-sm"
              value={edu.school}
              onChange={(e) =>
                updateEducation(index, "school", e.target.value)
              }
            />
            <input
              placeholder="Degree"
              className="border rounded px-3 py-2 text-sm"
              value={edu.degree}
              onChange={(e) =>
                updateEducation(index, "degree", e.target.value)
              }
            />
            <input
              placeholder="Field of Study"
              className="border rounded px-3 py-2 text-sm"
              value={edu.field}
              onChange={(e) =>
                updateEducation(index, "field", e.target.value)
              }
            />
            <div className="flex gap-2">
              <input
                placeholder="Start Date"
                className="border rounded px-3 py-2 text-sm w-full"
                value={edu.startDate}
                onChange={(e) =>
                  updateEducation(index, "startDate", e.target.value)
                }
              />
              <input
                placeholder="End Date"
                className="border rounded px-3 py-2 text-sm w-full"
                value={edu.endDate}
                onChange={(e) =>
                  updateEducation(index, "endDate", e.target.value)
                }
              />
            </div>
          </div>
        ))}

        <button
          onClick={addEducation}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add Education
        </button>
      </section>

      {/* SKILLS */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Skills</h2>
        <textarea
          className="border rounded px-3 py-2 text-sm w-full mb-2"
          rows={2}
          placeholder="Technical Skills (e.g. JavaScript, React, SQL)"
          value={resumeData.skills.technical}
          onChange={(e) => updateSkills("technical", e.target.value)}
        />
        <textarea
          className="border rounded px-3 py-2 text-sm w-full"
          rows={2}
          placeholder="Soft Skills (e.g. Communication, Leadership)"
          value={resumeData.skills.soft}
          onChange={(e) => updateSkills("soft", e.target.value)}
        />
      </section>

      {/* PROJECTS */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Projects</h2>

        {resumeData.projects.map((project, index) => (
          <div key={index} className="border rounded p-3 mb-3 flex flex-col gap-2">
            <input
              placeholder="Project Name"
              className="border rounded px-3 py-2 text-sm"
              value={project.name}
              onChange={(e) =>
                updateProject(index, "name", e.target.value)
              }
            />
            <input
              placeholder="Project Link (optional)"
              className="border rounded px-3 py-2 text-sm"
              value={project.link}
              onChange={(e) =>
                updateProject(index, "link", e.target.value)
              }
            />
            <textarea
              placeholder="What the project does and your role"
              className="border rounded px-3 py-2 text-sm"
              rows={3}
              value={project.description}
              onChange={(e) =>
                updateProject(index, "description", e.target.value)
              }
            />
          </div>
        ))}

        <button
          onClick={addProject}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add Project
        </button>
      </section>

      {/* ADDITIONAL */}
      <section>
        {/* CERTIFICATIONS */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Certifications
          </h3>

          {resumeData.certifications.map((cert, index) => (
            <div key={index} className="border rounded p-3 mb-3 flex flex-col gap-2">
              <input
                placeholder="Certification Name"
                className="border rounded px-3 py-2 text-sm"
                value={cert.name}
                onChange={(e) => {
                  const updated = [...resumeData.certifications]
                  updated[index].name = e.target.value
                  setResumeData({ ...resumeData, certifications: updated })
                }}
              />
              <input
                placeholder="Issuer"
                className="border rounded px-3 py-2 text-sm"
                value={cert.issuer}
                onChange={(e) => {
                  const updated = [...resumeData.certifications]
                  updated[index].issuer = e.target.value
                  setResumeData({ ...resumeData, certifications: updated })
                }}
              />
              <input
                placeholder="Year"
                className="border rounded px-3 py-2 text-sm"
                value={cert.year}
                onChange={(e) => {
                  const updated = [...resumeData.certifications]
                  updated[index].year = e.target.value
                  setResumeData({ ...resumeData, certifications: updated })
                }}
              />
            </div>
          ))}

          <button
            onClick={() =>
              setResumeData({
                ...resumeData,
                certifications: [
                  ...resumeData.certifications,
                  { name: '', issuer: '', year: '' },
                ],
              })
            }
            className="text-sm text-blue-600 hover:underline mb-7"
          >
            + Add Certification
          </button>
        </section>

        {/* LANGUAGES */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Languages
          </h3>

          {resumeData.languages.map((lang, index) => (
            <div
              key={index}
              className="border rounded p-3 mb-3 flex flex-col gap-2"
            >
              <input
                placeholder="Language (e.g. English)"
                className="border rounded px-3 py-2 text-sm"
                value={lang.name}
                onChange={(e) => {
                  const updated = [...resumeData.languages]
                  updated[index].name = e.target.value
                  setResumeData({ ...resumeData, languages: updated })
                }}
              />

              <input
                placeholder="Proficiency (e.g. Native, Fluent, Intermediate)"
                className="border rounded px-3 py-2 text-sm"
                value={lang.proficiency}
                onChange={(e) => {
                  const updated = [...resumeData.languages]
                  updated[index].proficiency = e.target.value
                  setResumeData({ ...resumeData, languages: updated })
                }}
              />
            </div>
          ))}

          <button
            onClick={() =>
              setResumeData({
                ...resumeData,
                languages: [
                  ...resumeData.languages,
                  { name: '', proficiency: '' },
                ],
              })
            }
            className="text-sm text-blue-600 hover:underline mb-7"
          >
            + Add Language
          </button>
        </section>

        {/* AWARDS */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Awards
          </h3>

          {resumeData.awards.map((award, index) => (
            <div
              key={index}
              className="border rounded p-3 mb-3 flex flex-col gap-2"
            >
              <input
                placeholder="Award Title"
                className="border rounded px-3 py-2 text-sm"
                value={award.title}
                onChange={(e) => {
                  const updated = [...resumeData.awards]
                  updated[index].title = e.target.value
                  setResumeData({ ...resumeData, awards: updated })
                }}
              />

              <input
                placeholder="Issuer / Organization"
                className="border rounded px-3 py-2 text-sm"
                value={award.issuer}
                onChange={(e) => {
                  const updated = [...resumeData.awards]
                  updated[index].issuer = e.target.value
                  setResumeData({ ...resumeData, awards: updated })
                }}
              />

              <input
                placeholder="Year"
                className="border rounded px-3 py-2 text-sm"
                value={award.year}
                onChange={(e) => {
                  const updated = [...resumeData.awards]
                  updated[index].year = e.target.value
                  setResumeData({ ...resumeData, awards: updated })
                }}
              />
            </div>
          ))}

          <button
            onClick={() =>
              setResumeData({
                ...resumeData,
                awards: [
                  ...resumeData.awards,
                  { title: '', issuer: '', year: '' },
                ],
              })
            }
            className="text-sm text-blue-600 hover:underline mb-7"
          >
            + Add Award
          </button>
        </section>

        {/* INTERESTS */}
        <section>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Interests
          </h3>

        <textarea
          className="border rounded px-3 py-2 text-sm w-full"
          rows={2}
          placeholder="Interests"
          value={resumeData.interests}
          onChange={(e) =>
            setResumeData({ ...resumeData, interests: e.target.value })
          }
        />
        </section>
      </section>

    </div>
  )
}
