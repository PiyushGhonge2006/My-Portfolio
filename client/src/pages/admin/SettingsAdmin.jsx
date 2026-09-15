import { useEffect, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import api from '../../services/api'
import { TextField, SelectField } from '../../components/admin/Fields'

export default function SettingsAdmin() {
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    api
      .get('/admin/settings')
      .then((res) => setForm(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const set = (name, value) => setForm((prev) => ({ ...prev, [name]: value }))

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/admin/settings', form)
      showToast('Settings saved')
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    )
  }

  const fields = [
    { name: 'siteTitle', label: 'Site Title', placeholder: 'Piyush Ghonge' },
    { name: 'tagline', label: 'Tagline', placeholder: 'Computer Science Engineering Student & Developer' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone' },
    { name: 'location', label: 'Location' },
    { name: 'footerText', label: 'Footer Text', placeholder: 'Optional custom footer text' },
  ]

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {toast && (
        <div className="fixed top-20 right-4 z-50 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium shadow-lg">
          {toast}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Site Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Global information used across the site.
        </p>
      </div>

      <div className="space-y-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 p-6">
        <div className="grid sm:grid-cols-2 gap-5">
          {fields.map((f) => (
            <TextField
              key={f.name}
              field={f}
              value={form[f.name]}
              onChange={set}
            />
          ))}
        </div>

        <div>
          <SelectField
            field={{
              name: 'defaultTheme',
              label: 'Default Theme',
              options: ['dark', 'light'],
            }}
            value={form.defaultTheme}
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
            Save Settings
          </button>
        </div>
      </div>
    </form>
  )
}