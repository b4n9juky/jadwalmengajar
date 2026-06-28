import { useEffect, useRef } from 'react';

interface Field {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'email' | 'select';
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  min?: number;
}

interface FormModalProps {
  title: string;
  fields: Field[];
  values: Record<string, unknown>;
  onChange: (name: string, value: string) => void;
  onSave: () => void;
  onClose: () => void;
  saveLabel?: string;
}

export default function FormModal({
  title, fields, values, onChange, onSave, onClose, saveLabel = 'Simpan',
}: FormModalProps) {
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
          {fields.map((f, i) => (
            <div className="form-group" key={f.name}>
              <label>{f.label}</label>
              {f.type === 'select' ? (
                <select
                  value={String(values[f.name] ?? '')}
                  onChange={(e) => onChange(f.name, e.target.value)}
                  required={f.required}
                >
                  <option value="">Pilih {f.label.toLowerCase()}...</option>
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  ref={i === 0 ? firstRef : undefined}
                  type={f.type || 'text'}
                  value={String(values[f.name] ?? '')}
                  onChange={(e) => onChange(f.name, e.target.value)}
                  required={f.required}
                  placeholder={f.placeholder}
                  min={f.min}
                />
              )}
            </div>
          ))}
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary">{saveLabel}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
