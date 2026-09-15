import { useEffect, useState } from 'react'
import { Loader2, Upload, FileText, CheckCircle2, Trash2, ExternalLink } from 'lucide-react'
import api from '../../services/api'

export default function ResumeAdmin() {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const fetchResumes = async () => {
    const res = await api.get('/admin/resumes')
    setResumes(res.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchResumes().catch(() => {
      showToast('Failed to load resumes')
      setLoading(false)
    })
  }, [])

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      await api.post('/admin/resumes', {
        title: file.name,
        file: res.data.url,
        active: resumes.length === 0,
      })
      await fetchResumes()
      showToast('Resume uploaded')
    } catch (err) {
      showToast(err.response?.data?.message || 'Upload failed')
    }
    e.target.value = ''
  }

  const activate = async (id) => {
    await api.post(`/admin/resumes/${id}/activate`)
    await fetchResumes()
    showToast('Active resume updated')
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this resume?')) return
    try {
      await api.delete(`/admin/resumes/${id}`)
      await fetchResumes()
      showToast('Resume deleted')
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    )
  }

  const active = resumes.find((r) => r.active)

  return (
    <div>
      {toast && (
        <div className="fixed top-20 right-4 z-50 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium shadow-lg">
          {toast}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Resume</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          The <strong>active</strong> resume is the one visitors can view/download.
        </p>
      </div>

      {/* Upload */}
      <label className="flex flex-col items-center justify-center h-36 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 cursor-pointer hover:border-primary-500 transition-colors mb-6">
        <Upload className="w-7 h-7 text-slate-400 mb-2" />
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Upload Resume (PDF)</span>
        <span className="text-xs text-slate-400 mt-1">Maximum 10 MB</span>
        <input type="file" accept="application/pdf" onChange={handleUpload} className="sr-only" />
      </label>

      {/* Resume list */}
      {resumes.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
          <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No resume uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resumes.map((resume) => (
            <div
              key={resume._id}
              className={`flex items-center gap-4 p-4 rounded-xl border ${
                resume.active
                  ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30'
                  : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                resume.active
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}>
                {resume.active ? <CheckCircle2 size={18} /> : <FileText size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-white truncate">{resume.title}</p>
                <p className="text-xs text-slate-400">
                  {new Date(resume.updatedAt).toLocaleDateString()}
                  {resume.active && <span className="text-green-600 dark:text-green-400 font-medium ml-2">ACTIVE</span>}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!resume.active && (
                  <button
                    onClick={() => activate(resume._id)}
                    className="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium transition-colors"
                  >
                    Set Active
                  </button>
                )}
                <a
                  href={resume.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-slate-400 hover:text-primary-500 transition-colors"
                  aria-label="View resume"
                >
                  <ExternalLink size={16} />
                </a>
                <button
                  onClick={() => remove(resume._id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                  aria-label="Delete resume"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {active && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
          Visitors currently see: <span className="font-medium text-slate-600 dark:text-slate-300">{active.title}</span>
        </p>
      )}
    </div>
  )
}