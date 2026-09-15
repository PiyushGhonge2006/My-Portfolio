import { useState, useEffect, useCallback, useMemo } from 'react'
import { Plus, Pencil, Trash2, Search, X, ArrowUp, ArrowDown, Loader2, Star } from 'lucide-react'
import api from '../../services/api'
import { TextField, TextAreaField, SelectField, CheckboxField, NumberField } from '../../components/admin/Fields'
import TagsInput from '../../components/admin/TagsInput'
import FileUploadInput from '../../components/admin/FileUploadInput'
import GalleryUploadInput from '../../components/admin/GalleryUploadInput'

const emptyForm = (fields) => {
  const form = {}
  for (const f of fields) {
    if (f.type === 'tags' || f.type === 'gallery') form[f.name] = []
    else if (f.type === 'checkbox') form[f.name] = false
    else if (f.type === 'number') form[f.name] = 0
    else form[f.name] = ''
  }
  return form
}

function FormField({ field, value, onChange }) {
  switch (field.type) {
    case 'textarea':
      return <TextAreaField field={field} value={value} onChange={onChange} />
    case 'select':
      return <SelectField field={field} value={value} onChange={onChange} />
    case 'checkbox':
      return <CheckboxField field={field} value={value} onChange={onChange} />
    case 'number':
      return <NumberField field={field} value={value} onChange={onChange} />
    case 'tags':
      return <TagsInput label={field.label} value={value || []} onChange={(v) => onChange(field.name, v)} />
    case 'upload':
      return <FileUploadInput label={field.label} value={value} onChange={(v) => onChange(field.name, v)} accept={field.accept} />
    case 'gallery':
      return <GalleryUploadInput label={field.label} value={value || []} onChange={(v) => onChange(field.name, v)} />
    default:
      return <TextField field={field} value={value} onChange={onChange} />
  }
}

export default function ResourceManager({ config }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({})
  const [toast, setToast] = useState('')

  const { title, endpoint, fields, list } = config

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get(endpoint)
      setItems(res.data)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load ' + title)
    } finally {
      setLoading(false)
    }
  }, [endpoint, title])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return items
    const q = search.toLowerCase()
    const keys = config.searchKeys || []
    return items.filter((item) =>
      keys.some((k) => String(item[k] || '').toLowerCase().includes(q))
    )
  }, [items, search, config.searchKeys])

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm(fields))
    setModal(true)
  }

  const openEdit = (item) => {
    setEditingId(item._id)
    setForm({ ...emptyForm(fields), ...item })
    setModal(true)
  }

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        const res = await api.put(`${endpoint}/${editingId}`, form)
        setItems((prev) => prev.map((it) => (it._id === editingId ? res.data : it)))
        showToast('Updated successfully')
      } else {
        const res = await api.post(endpoint, form)
        setItems((prev) => [...prev, res.data])
        showToast('Created successfully')
      }
      setModal(false)
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return
    try {
      await api.delete(`${endpoint}/${id}`)
      setItems((prev) => prev.filter((it) => it._id !== id))
      showToast('Deleted')
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed')
    }
  }

  const toggleFeatured = async (item) => {
    try {
      const res = await api.put(`${endpoint}/${item._id}`, { featured: !item.featured })
      setItems((prev) => prev.map((it) => (it._id === item._id ? res.data : it)))
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed')
    }
  }

  const move = async (index, dir) => {
    const target = index + dir
    if (target < 0 || target >= items.length) return
    const of = config.orderField || 'order'
    const a = items[index]
    const b = items[target]
    try {
      const [ra, rb] = await Promise.all([
        api.put(`${endpoint}/${a._id}`, { [of]: b[of] }),
        api.put(`${endpoint}/${b._id}`, { [of]: a[of] }),
      ])
      setItems((prev) =>
        prev.map((it) => (it._id === a._id ? ra.data : it._id === b._id ? rb.data : it))
      )
    } catch (err) {
      showToast('Reorder failed')
    }
  }

  return (
    <div>
      {toast && (
        <div className="fixed top-20 right-4 z-50 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium shadow-lg animate-fade-in-up">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {items.length} item{items.length !== 1 && 's'}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white text-sm font-medium transition-all shadow-md shadow-primary-500/20 hover:shadow-lg"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 outline-none"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
            <Plus size={20} className="text-primary-500" />
          </div>
          <p className="text-slate-400 dark:text-slate-500">
            {items.length === 0 ? `No ${title.toLowerCase()} yet. Click "Add New" to create one.` : 'No results match your search.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item, index) => (
            <div
              key={item._id}
              className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50"
            >
              {config.orderable && (
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => move(filtered.indexOf(item), -1)}
                    disabled={filtered.indexOf(item) === 0}
                    className="p-1 rounded text-slate-400 hover:text-primary-500 disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => move(filtered.indexOf(item), 1)}
                    disabled={filtered.indexOf(item) === filtered.length - 1}
                    className="p-1 rounded text-slate-400 hover:text-primary-500 disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-white truncate">
                  {item[list.primary]}
                </p>
                {list.secondary && item[list.secondary] && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                    {item[list.secondary]}
                  </p>
                )}
                {list.badge && list.badge(item) && (
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400">
                    <Star size={10} /> {list.badge(item)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {config.fields.some((f) => f.name === 'featured') && (
                  <button
                    onClick={() => toggleFeatured(item)}
                    className={`p-2 rounded-lg transition-colors ${
                      item.featured
                        ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                        : 'text-slate-300 dark:text-slate-600 hover:text-yellow-500'
                    }`}
                    aria-label="Toggle featured"
                  >
                    <Star size={16} />
                  </button>
                )}
                <button
                  onClick={() => openEdit(item)}
                  className="p-2 rounded-lg text-slate-400 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 pb-4 sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white">
                  {editingId ? <Pencil size={16} /> : <Plus size={16} />}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingId ? 'Edit' : 'Add'} {title.replace(/s$/, '')}
                </h3>
              </div>
              <button
                onClick={() => setModal(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                {fields.map((field) => (
                  <div key={field.name} className={field.type === 'textarea' || field.type === 'tags' || field.type === 'upload' || field.type === 'gallery' ? 'sm:col-span-2' : ''}>
                    <FormField field={field} value={form[field.name]} onChange={handleChange} />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white text-sm font-medium transition-all shadow-md shadow-primary-500/20 disabled:opacity-50"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {editingId ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.25s ease-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}