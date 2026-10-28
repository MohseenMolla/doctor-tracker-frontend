import clsx from 'clsx';

export function Field({ label, error, hint, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error ? <p className="mt-1 text-xs font-medium text-rose-600">{error}</p> : hint ? <p className="mt-1 text-xs text-ink-500">{hint}</p> : null}
    </div>
  );
}

export function TextInput({ label, error, hint, className, ...props }) {
  return (
    <Field label={label} error={error} hint={hint}>
      <input className={clsx('input', error && 'input-error', className)} {...props} />
    </Field>
  );
}

/** options: [{ value, label }] or plain strings */
export function Select({ label, error, value, onChange, options = [], placeholder, className, ...props }) {
  const select = (
    <select
      className={clsx('input appearance-none bg-[length:16px] bg-[right_10px_center] bg-no-repeat pr-8', error && 'input-error', className)}
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%235E7A7F' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((o) => {
        const opt = typeof o === 'string' ? { value: o, label: o } : o;
        return <option key={opt.value} value={opt.value}>{opt.label}</option>;
      })}
    </select>
  );
  return label ? <Field label={label} error={error}>{select}</Field> : select;
}
