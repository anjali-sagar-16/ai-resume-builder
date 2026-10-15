import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, ExternalLink, FileDown, Plus, Trash2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import ProfessionalSummaryForm from '../components/professionalSummaryForm'
import ExperienceForm from '../components/experienceForm'
import api from '../config/api'

const ResumeBuilder = () => {
  const { resumeId } = useParams()
  const navigate = useNavigate()
  const token = useSelector((state) => state.auth.token)

  const [resumeData, setResumeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [removeBg, setRemoveBg] = useState(false)
  const [saveState, setSaveState] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [skillInput, setSkillInput] = useState('')

  useEffect(() => {
    api.get(`/api/resumes/get/${resumeId}`, { headers: { Authorization: token } })
      .then(({ data }) => {
        setLoadError(false)
        setResumeData({
          ...data.resume,
          project: data.resume.project || data.resume.projects || [],
          personal_info: { ...data.resume.personal_info }
        })
      })
      .catch(() => {
        setResumeData(null)
        setLoadError(true)
      })
      .finally(() => setLoading(false))
  }, [resumeId, token])

  const updateResumeData = (nextData) => {
    setResumeData((previousData) => {
      const updatedData = typeof nextData === 'function'
        ? nextData(previousData)
        : nextData
      return updatedData
    })
  }

  const saveResume = async () => {
    if (!resumeData) return
    const resumeDataCopy = structuredClone(resumeData)
    const image = resumeDataCopy.personal_info?.image
    if (image instanceof File) delete resumeDataCopy.personal_info.image

    const formData = new FormData()
    formData.append('resumeId', resumeId)
    formData.append('resumeData', JSON.stringify(resumeDataCopy))
    formData.append('removeBackground', removeBg ? 'yes' : 'no')
    if (image instanceof File) formData.append('image', image)

    await toast.promise(
      api.put('/api/resumes/update', formData, { headers: { Authorization: token } }),
      {
        loading: 'Saving resume...',
        success: 'Resume saved',
        error: (error) => error.response?.data?.message || 'Could not save resume'
      }
    ).then(({ data }) => {
      if (data.resume) setResumeData(data.resume)
      setSaveState('Saved')
      window.setTimeout(() => setSaveState(''), 2200)
    })
  }

  const updateVisibility = async (isPublic) => {
    updateResumeData({ ...resumeData, public: isPublic })
    try {
      await api.put('/api/resumes/update', {
        resumeId,
        resumeData: JSON.stringify({ public: isPublic })
      }, { headers: { Authorization: token } })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update visibility')
    }
  }

  const enhanceSummary = async () => {
    setAiLoading(true)
    try {
      const { data } = await api.post('/api/ai/enhance-pro-sum', {
        userContent: resumeData.professional_summary
      }, { headers: { Authorization: token } })
      updateResumeData({ ...resumeData, professional_summary: data.enhancedContent })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not enhance summary')
    } finally {
      setAiLoading(false)
    }
  }

  const enhanceExperience = async (index) => {
    const experience = resumeData.experience[index]
    setAiLoading(true)
    try {
      const { data } = await api.post('/api/ai/enhance-job-desc', {
        userContent: `Job title: ${experience.position}\nCompany: ${experience.company}\nDraft description: ${experience.description}`
      }, { headers: { Authorization: token } })
      updateExperience(index, 'description', data.enhancedContent)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not enhance experience')
    } finally {
      setAiLoading(false)
    }
  }

  const addExperience = () => {

    const newExperience = {
      company: '',
      position: '',
      start_date: '',
      end_date: '',
      description: '',
      is_current: false
    }

    updateResumeData({
      ...resumeData,
      experience: [
        ...(resumeData.experience || []),
        newExperience
      ]
    })
  }

  const updateExperience = (index, field, value) => {

    const updatedExperience = [...resumeData.experience]

    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value
    }

    updateResumeData({
      ...resumeData,
      experience: updatedExperience
    })
  }

  const removeExperience = (index) => {

    updateResumeData({
      ...resumeData,
      experience: resumeData.experience.filter(
        (_, i) => i !== index
      )
    })
  }

  const addEducation = () => {

    const newEducation = {
      institution: '',
      degree: '',
      field: '',
      graduation_date: '',
      gpa: ''
    }

    updateResumeData({
      ...resumeData,
      education: [
        ...(resumeData.education || []),
        newEducation
      ]
    })
  }

  const updateEducation = (index, field, value) => {

    const updatedEducation = [...resumeData.education]

    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    }

    updateResumeData({
      ...resumeData,
      education: updatedEducation
    })
  }

  const removeEducation = (index) => {

    updateResumeData({
      ...resumeData,
      education: resumeData.education.filter(
        (_, i) => i !== index
      )
    })
  }

  const addProject = () => {

    const newProject = {
      name: '',
      type: '',
      description: ''
    }

    updateResumeData({
      ...resumeData,
      project: [
        ...(resumeData.project || []),
        newProject
      ]
    })
  }

  const updateProject = (index, field, value) => {

    const updatedProjects = [...resumeData.project]

    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value
    }

    updateResumeData({
      ...resumeData,
      project: updatedProjects
    })
  }

  const removeProject = (index) => {

    updateResumeData({
      ...resumeData,
      project: resumeData.project.filter(
        (_, i) => i !== index
      )
    })
  }

  const addSkill = () => {
    if (addSkillValue(skillInput)) setSkillInput('')
  }

  const removeSkill = (index) => {

    updateResumeData({
      ...resumeData,
      skills: resumeData.skills.filter(
        (_, i) => i !== index
      )
    })
  }

  const addSkillValue = (value) => {
    const skill = value.trim()
    const skills = resumeData.skills || []
    if (!skill || skills.some((item) => item.toLowerCase() === skill.toLowerCase())) {
      return false
    }
    updateResumeData({ ...resumeData, skills: [...skills, skill] })
    return true
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-500">Loading resume...</div>
      </div>
    )
  }

  if (!resumeData || loadError) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">

        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">

          <h2 className="text-lg font-semibold text-gray-800">
            Resume Not Found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            The resume you are looking for does not exist.
          </p>

        </div>

      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-8">

      <div className="mx-auto mb-6 flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/app')}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-2">
          {saveState && <span className="inline-flex items-center gap-1 text-xs text-green-600"><Check className="size-4" />{saveState}</span>}
          <button type="button" onClick={saveResume} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2">

        {/* ================= LEFT SIDE ================= */}

        <div className="space-y-6">

          {/* Personal Information */}

          <PersonalInfoForm
            data={resumeData}
            setData={updateResumeData}
            removeBg={removeBg}
            setRemoveBg={setRemoveBg}
          />

          {/* Professional Summary */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="text-base font-semibold text-gray-800">
              Professional Summary
            </h2>

            <p className="mb-4 mt-1 text-xs text-gray-400">
              Write a short summary about yourself
            </p>

            <ProfessionalSummaryForm
              value={resumeData.professional_summary}
              onChange={(value) => updateResumeData({ ...resumeData, professional_summary: value })}
              onEnhance={enhanceSummary}
              loading={aiLoading}
            />

          </div>

          {/* Experience */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-base font-semibold text-gray-800">
                  Experience
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Add your work experience
                </p>
              </div>

              <button
                type="button"
                onClick={addExperience}
                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
              >
                + Add
              </button>

            </div>

            <div className="mt-5 space-y-5">

              {resumeData.experience?.map((exp, index) => (

                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-4"
                >

                  <div className="mb-3 flex justify-between">

                    <h3 className="text-sm font-medium text-gray-700">
                      Experience {index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="text-xs text-red-500"
                    >
                      Remove
                    </button>

                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">

                    <input
                      value={exp.company || ''}
                      onChange={(e) =>
                        updateExperience(
                          index,
                          'company',
                          e.target.value
                        )
                      }
                      placeholder="Company"
                      className="rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500"
                    />

                    <input
                      value={exp.position || ''}
                      onChange={(e) =>
                        updateExperience(
                          index,
                          'position',
                          e.target.value
                        )
                      }
                      placeholder="Position"
                      className="rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500"
                    />

                    <input
                      type="month"
                      value={exp.start_date || ''}
                      onChange={(e) =>
                        updateExperience(
                          index,
                          'start_date',
                          e.target.value
                        )
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500"
                    />

                    <input
                      type="month"
                      value={exp.end_date || ''}
                      disabled={exp.is_current}
                      onChange={(e) =>
                        updateExperience(
                          index,
                          'end_date',
                          e.target.value
                        )
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none disabled:bg-gray-100"
                    />

                  </div>

                  <label className="mt-3 flex items-center gap-2 text-xs text-gray-600">

                    <input
                      type="checkbox"
                      checked={Boolean(exp.is_current)}
                      onChange={(e) =>
                        updateExperience(
                          index,
                          'is_current',
                          e.target.checked
                        )
                      }
                    />

                    Currently working here

                  </label>

                  <textarea
                    value={exp.description || ''}
                    onChange={(e) =>
                      updateExperience(
                        index,
                        'description',
                        e.target.value
                      )
                    }
                    rows="4"
                    placeholder="Describe your responsibilities and achievements..."
                    className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500"
                  />
                  <ExperienceForm onEnhance={() => enhanceExperience(index)} loading={aiLoading} />

                </div>

              ))}

            </div>

          </div>

          {/* Education */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-base font-semibold text-gray-800">
                  Education
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Add your education
                </p>
              </div>

              <button
                type="button"
                onClick={addEducation}
                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
              >
                + Add
              </button>

            </div>

            <div className="mt-5 space-y-5">

              {resumeData.education?.map((edu, index) => (

                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-4"
                >

                  <div className="mb-3 flex justify-between">

                    <h3 className="text-sm font-medium text-gray-700">
                      Education {index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="text-xs text-red-500"
                    >
                      Remove
                    </button>

                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">

                    <input
                      value={edu.institution || ''}
                      onChange={(e) =>
                        updateEducation(
                          index,
                          'institution',
                          e.target.value
                        )
                      }
                      placeholder="Institution"
                      className="rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500"
                    />

                    <input
                      value={edu.degree || ''}
                      onChange={(e) =>
                        updateEducation(
                          index,
                          'degree',
                          e.target.value
                        )
                      }
                      placeholder="Degree"
                      className="rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500"
                    />

                    <input
                      value={edu.field || ''}
                      onChange={(e) =>
                        updateEducation(
                          index,
                          'field',
                          e.target.value
                        )
                      }
                      placeholder="Field of Study"
                      className="rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500"
                    />

                    <input
                      type="month"
                      value={edu.graduation_date || ''}
                      onChange={(e) =>
                        updateEducation(
                          index,
                          'graduation_date',
                          e.target.value
                        )
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500"
                    />

                    <input
                      value={edu.gpa || ''}
                      onChange={(e) =>
                        updateEducation(
                          index,
                          'gpa',
                          e.target.value
                        )
                      }
                      placeholder="GPA"
                      className="rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500"
                    />

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* Projects */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-base font-semibold text-gray-800">
                  Projects
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Add your projects
                </p>
              </div>

              <button
                type="button"
                onClick={addProject}
                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
              >
                + Add
              </button>

            </div>

            <div className="mt-5 space-y-5">

              {resumeData.project?.map((project, index) => (

                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-4"
                >

                  <div className="mb-3 flex justify-between">

                    <h3 className="text-sm font-medium text-gray-700">
                      Project {index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      className="text-xs text-red-500"
                    >
                      Remove
                    </button>

                  </div>

                  <input
                    value={project.name || ''}
                    onChange={(e) =>
                      updateProject(
                        index,
                        'name',
                        e.target.value
                      )
                    }
                    placeholder="Project Name"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500"
                  />

                  <input
                    value={project.type || ''}
                    onChange={(e) =>
                      updateProject(
                        index,
                        'type',
                        e.target.value
                      )
                    }
                    placeholder="Project Type"
                    className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500"
                  />

                  <textarea
                    value={project.description || ''}
                    onChange={(e) =>
                      updateProject(
                        index,
                        'description',
                        e.target.value
                      )
                    }
                    rows="4"
                    placeholder="Project Description"
                    className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500"
                  />

                </div>

              ))}

            </div>

          </div>

          {/* Skills */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-base font-semibold text-gray-800">
                  Skills
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Add your technical and professional skills
                </p>
              </div>

              <button
                type="button"
                onClick={addSkill}
                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
              >
                + Add
              </button>

            </div>

            <div className="mt-5 flex gap-2">
              <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }} placeholder="Type a skill and press Enter" className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500" />
              <button type="button" onClick={addSkill} aria-label="Add skill" className="rounded-lg bg-blue-600 px-3 text-white hover:bg-blue-700"><Plus className="size-4" /></button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {resumeData.skills?.map((skill, index) => (
                <span key={`${skill}-${index}`} className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs text-blue-700">
                  {skill}
                  <button type="button" onClick={() => removeSkill(index)} aria-label={`Remove ${skill}`} className="text-blue-500 hover:text-red-600"><Trash2 className="size-3.5" /></button>
                </span>
              ))}

            </div>

          </div>

        </div>

        {/* ================= RIGHT SIDE ================= */}

        <div className="lg:sticky lg:top-6 lg:self-start">

          <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <label className="text-xs font-semibold text-gray-700" htmlFor="template-select">Template</label>
              <select id="template-select" value={resumeData.template || 'classic'} onChange={(e) => updateResumeData({ ...resumeData, template: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500">
                <option value="classic">Classic</option>
                <option value="modern">Modern</option>
                <option value="minimal">Minimal</option>
                <option value="minimal-image">Minimal Image</option>
              </select>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <label className="text-xs font-semibold text-gray-700" htmlFor="accent-color">Accent color</label>
              <input id="accent-color" type="color" value={resumeData.accent_color || '#2563eb'} onChange={(e) => updateResumeData({ ...resumeData, accent_color: e.target.value })} className="h-8 w-12 cursor-pointer rounded border border-gray-300 bg-white p-1" />
            </div>
            <label className="mt-4 flex items-center justify-between text-xs font-semibold text-gray-700">
              Public resume
              <input type="checkbox" checked={Boolean(resumeData.public)} onChange={(e) => updateVisibility(e.target.checked)} className="size-4 accent-blue-600" />
            </label>
            <p className="mt-2 break-all text-[11px] text-gray-400">{window.location.origin}/view/{resumeId}</p>
          </div>

          <ResumePreview
            data={resumeData}
            template={resumeData.template || 'classic'}
          />

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => window.open(`/view/${resumeId}`, '_blank')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-800 px-3 py-3 text-xs font-medium text-white hover:bg-gray-900"><ExternalLink className="size-4" /> Full Preview</button>
            <button type="button" onClick={() => window.print()} className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-3 text-xs font-medium text-gray-700 hover:bg-gray-50"><FileDown className="size-4" /> Print / PDF</button>
          </div>

        </div>

      </div>

    </div>
  )
}

export default ResumeBuilder