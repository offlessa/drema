import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  options: { value: string; label: string }[]
}

export function Select({ label, error, id, options, className = '', ...props }: SelectProps) {
  const selectId = id ?? props.name
  return (
    <div className="text-left">
      <label htmlFor={selectId} className="block text-sm font-medium text-neutral-700 mb-1">
        {label}
      </label>
      <select
        id={selectId}
        className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-primary ${
          error ? 'border-danger' : 'border-neutral-300'
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  )
}
