'use client';

interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  error?: any;
  children: React.ReactNode;
}

export function FormField({
  label,
  name,
  required,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
