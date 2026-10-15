import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoaderCircle } from 'lucide-react'
import pdfToText from 'react-pdftotext'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../config/api'

const Dashboard = () => {
  const navigate = useNavigate()
  const token = useSelector((state) => state.auth.token)

  const [resumes, setResumes] = useState([])
  const [openCreateResume, setOpenCreateResume] = useState(false)
  const [openUploadResume, setOpenUploadResume] = useState(false)

  const [resumeTitle, setResumeTitle] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  // ================= LOAD RESUMES =================

  useEffect(() => {
    api.get('/api/users/resumes', { headers: { Authorization: token } })
      .then(({ data }) => setResumes(data.resumes || []))
      .catch((error) => toast.error(error.response?.data?.message || 'Could not load resumes'))
  }, [token])

  // ================= CREATE RESUME =================

  const handleCreateResume = async () => {
    if (!resumeTitle.trim()) {
      return
    }
    try {
      const { data } = await api.post('/api/resumes/create', { title: resumeTitle.trim() }, { headers: { Authorization: token } })
      setResumes((previous) => [...previous, data.resume])
      setResumeTitle('')
      setOpenCreateResume(false)
      navigate(`/app/builder/${data.resume._id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not create resume')
    }
  }

  // ================= UPLOAD RESUME =================

  const handleUploadResume = async () => {
    if (!resumeFile) {
      return
    }

    setUploading(true)
    try {
      const resumeText = await pdfToText(resumeFile)
      const { data } = await api.post('/api/ai/upload-resume', {
        resumeText,
        title: resumeFile.name.replace(/\.pdf$/i, '') || 'Uploaded Resume'
      }, { headers: { Authorization: token } })
      setResumeFile(null)
      setOpenUploadResume(false)
      navigate(`/app/builder/${data.resumeId}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not upload resume')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm('Delete this resume?')) return
    try {
      await api.delete(`/api/resumes/delete/${resumeId}`, { headers: { Authorization: token } })
      setResumes((previous) => previous.filter((resume) => resume._id !== resumeId))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete resume')
    }
  }

  const handleEditTitle = async (resume) => {
    const title = window.prompt('Resume title', resume.title)
    if (!title?.trim() || title.trim() === resume.title) return
    try {
      await api.put('/api/resumes/update', {
        resumeId: resume._id,
        resumeData: { title: title.trim() }
      }, { headers: { Authorization: token } })
      setResumes((previous) => previous.map((item) => item._id === resume._id ? { ...item, title: title.trim() } : item))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update title')
    }
  }

  // ================= OPEN RESUME =================

  const openResume = (resumeId) => {
    if (!resumeId) {
      console.error('Resume ID is missing')
      return
    }

    navigate(`/app/builder/${resumeId}`)
  }

  // ================= SAFE RESUME LIST =================

  const validResumes = resumes.filter(
    (resume) =>
      resume &&
      typeof resume === 'object' &&
      resume._id
  )

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">

      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="mb-8">

          <h1 className="text-2xl font-semibold text-gray-800">
            My Resumes
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create, upload and manage your resumes
          </p>

        </div>

        {/* ================= ACTION BUTTONS ================= */}

        <div className="mb-8 flex flex-wrap gap-4">

          <button
            type="button"
            onClick={() => setOpenCreateResume(true)}
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            + Create Resume
          </button>

          <button
            type="button"
            onClick={() => setOpenUploadResume(true)}
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Upload Existing Resume
          </button>

        </div>

        {/* ================= RESUME CARDS ================= */}

        {validResumes.length > 0 ? (

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {validResumes.map((resume) => (

              <div
                key={resume._id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <button
                  type="button"
                  onClick={() => openResume(resume._id)}
                  className="block w-full text-left"
                >

                  {/* Resume Image / Placeholder */}

                  <div className="flex h-44 items-center justify-center bg-gray-100 p-4">

                    {resume.personal_info?.image ? (

                      <img
                        src={resume.personal_info.image}
                        alt={
                          resume.personal_info?.full_name ||
                          'Resume'
                        }
                        className="h-full w-full object-contain"
                      />

                    ) : (

                      <div className="text-center">

                        <div className="text-3xl font-semibold text-gray-300">
                          CV
                        </div>

                        <div className="mt-1 text-xs text-gray-400">
                          Resume Preview
                        </div>

                      </div>

                    )}

                  </div>

                  {/* Resume Details */}

                  <div className="p-5">

                    <h2 className="text-base font-semibold text-gray-800">

                      {resume.title ||
                        `${resume.personal_info?.full_name || 'Untitled'}'s Resume`}

                    </h2>

                    <p className="mt-1 text-xs text-gray-500">

                      {resume.personal_info?.profession ||
                        'Professional Resume'}

                    </p>

                    <p className="mt-3 text-xs font-medium text-blue-600">
                      Open Resume →
                    </p>

                  </div>

                </button>

                <div className="flex gap-3 border-t border-gray-100 px-5 py-3">
                  <button type="button" onClick={() => handleEditTitle(resume)} className="text-xs font-medium text-blue-600 hover:text-blue-800">
                    Edit title
                  </button>
                  <button type="button" onClick={() => handleDeleteResume(resume._id)} className="text-xs font-medium text-red-500 hover:text-red-700">
                    Delete
                  </button>
                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">

            <h2 className="text-lg font-semibold text-gray-700">
              No Resumes Yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Create your first resume to get started.
            </p>

          </div>

        )}

      </div>

      {/* ================================================= */}
      {/* CREATE RESUME MODAL */}
      {/* ================================================= */}

      {openCreateResume && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

            <h2 className="text-lg font-semibold text-gray-800">
              Create Resume
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Give your resume a title to get started.
            </p>

            <input
              type="text"
              value={resumeTitle}
              onChange={(e) =>
                setResumeTitle(e.target.value)
              }
              placeholder="Enter resume title"
              autoFocus
              className="mt-5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            <div className="mt-5 flex justify-end gap-3">

              <button
                type="button"
                onClick={() => {
                  setOpenCreateResume(false)
                  setResumeTitle('')
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!resumeTitle.trim()}
                onClick={handleCreateResume}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Create
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ================================================= */}
      {/* UPLOAD RESUME MODAL */}
      {/* ================================================= */}

      {openUploadResume && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

            <h2 className="text-lg font-semibold text-gray-800">
              Upload Existing Resume
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Upload your existing resume as a PDF.
            </p>

            <label
              htmlFor="resume-input"
              className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-5 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50"
            >

              <div className="text-sm font-medium text-gray-700">

                {resumeFile
                  ? resumeFile.name
                  : 'Select resume file'}

              </div>

              <div className="mt-1 text-xs text-gray-400">
                PDF files only
              </div>

              <input
                id="resume-input"
                type="file"
                accept=".pdf,application/pdf"
                hidden
                onChange={(e) => {
                  const file =
                    e.target.files?.[0] || null

                  setResumeFile(file)
                }}
              />

            </label>

            <div className="mt-5 flex justify-end gap-3">

              <button
                type="button"
                onClick={() => {
                  setOpenUploadResume(false)
                  setResumeFile(null)
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!resumeFile || uploading}
                onClick={handleUploadResume}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {uploading ? (
                  <span className="inline-flex items-center gap-2"><LoaderCircle className="size-4 animate-spin" /> Uploading...</span>
                )
                  : 'Upload Resume'}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default Dashboard