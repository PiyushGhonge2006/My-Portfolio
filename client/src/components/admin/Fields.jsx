const baseInput =
  'w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all'

export function FieldLabel({ htmlFor, children, required }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}

export function TextField({ field, value, onChange }) {
  return (
    <div>
      <FieldLabel htmlFor={field.name} required={field.required}>{field.label}</FieldLabel>
      <input
        id={field.name}
        type={field.type || 'text'}
        required={field.required}
        value={value || ''}
        onChange={(e) => onChange(field.name, e.target.value)}
        placeholder={field.placeholder || ''}
        className={baseInput}
      />
    </div>
  )
}

export function TextAreaField({ field, value, onChange }) {
  return (
    <div>
      <FieldLabel htmlFor={field.name} required={field.required}>{field.label}</FieldLabel>
      <textarea
        id={field.name}
        required={field.required}
        rows={field.rows || 4}
        value={value || ''}
        onChange={(e) => onChange(field.name, e.target.value)}
        placeholder={field.placeholder || ''}
        className={`${baseInput} resize-y`}
      />
    </div>
  )
}

export function SelectField({ field, value, onChange }) {
  return (
    <div>
      <FieldLabel htmlFor={field.name} required={field.required}>{field.label}</FieldLabel>
      <select
        id={field.name}
        value={value || ''}
        onChange={(e) => onChange(field.name, e.target.value)}
        className={baseInput}
      >
        {field.options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}

export function CheckboxField({ field, value, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={Boolean(value)}
        onChange={(e) => onChange(field.name, e.target.checked)}
        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
      />
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{field.label}</span>
    </label>
  )
}

export function NumberField({ field, value, onChange }) {
  return (
    <div>
      <FieldLabel htmlFor={field.name} required={field.required}>{field.label}</FieldLabel>
      <input
        id={field.name}
        type="number"
        value={value ?? 0}
        onChange={(e) => onChange(field.name, Number(e.target.value))}
        className={baseInput}
      />
      {field.helper && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{field.helper}</p>
      )}
    </div>
  )
}