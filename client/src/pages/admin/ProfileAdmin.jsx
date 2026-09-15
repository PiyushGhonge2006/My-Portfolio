import { useEffect, useState } from 'react'
import { Loader2, Save, Image as ImageIcon } from 'lucide-react'
import api from '../../services/api'
import { TextField, TextAreaField } from '../../components/admin/Fields'
import FileUploadInput from '../../components/admin/FileUploadInput'

export default function ProfileAdmin() {
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  useEffect(() => {
    api
      .get('/admin/profile')
      .then((res) => setForm(res.data))
      .catch(() => showToast('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const set = (name, value) => setForm((prev) => ({ ...prev, [name]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/admin/profile', form)
      showToast('Profile saved')
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const fields = [
    { name: 'name', label: 'Full Name', required: true },
    { name: 'title', label: 'Headline', placeholder: 'e.g. Computer Science Engineering Undergraduate' },
    { name: 'subtitle', label: 'Subtitle', placeholder: 'e.g. Full-Stack Developer' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone', placeholder: '+91...' },
    { name: 'location', label: 'Location', placeholder: 'City, State, India' },
  ]

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {toast && (
        <div className="fixed top-20 right-4 z-50 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium shadow-lg">
          {toast}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          This information appears in the Hero and Contact sections.
        </p>
      </div>

      <div className="space-y-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 p-6">
        <div className="max-w-xs">
          <FileUploadInput
            label="Profile Photo"
            value={form.photo}
            onChange={(v) => set('photo', v)}
            helper="Leave empty to show the default avatar"
          />
          {form.photo && (
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <ImageIcon size={12} /> Current: {form.photo}
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {fields.map((f) => (
            <TextField
              key={f.name}
              field={{ ...f, label: f.label, type: undefined }}
              value={form[f.name]}
              onChange={set}
            />
          ))}
        </div>

        <div>
          <TextAreaField
            field={{ name: 'tagline', label: 'Hero Tagline (2-3 lines intro)', rows: 3 }}
            value={form.tagline}
            onChange={set}
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Profile
          </button>
        </div>
      </div>
    </form>
  )
}