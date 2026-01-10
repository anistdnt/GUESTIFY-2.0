import { Field, useField } from "formik";

/* ================= INPUT ================= */

export function Input({
  label,
  name,
  type = "text",
  placeholder,
  onChange,
  readOnly,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  onChange?: any;
  readOnly?: boolean;
}) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-800 mb-1">
        {label}
        <span className="text-red-700 ms-1">*</span>
      </label>

      <Field
        {...field}
        type={type}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={onChange ?? field.onChange}
        className={`rounded-md px-3 py-2 text-gray-900 focus:outline-none
          ${
            hasError
              ? "border border-red-500 focus:ring-2 focus:ring-red-200"
              : "border border-gray-400 focus:ring-2 focus:ring-blue-200"
          }
        `}
      />

      {hasError && (
        <span className="text-xs text-red-600 mt-1">{meta.error}</span>
      )}
    </div>
  );
}

/* ================= TEXTAREA ================= */

export function Textarea({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder?: string;
}) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className="flex flex-col md:col-span-2">
      <label className="text-sm font-medium text-gray-800 mb-1">
        {label}
        <span className="text-red-700 ms-1">*</span>
      </label>

      <Field
        as="textarea"
        {...field}
        placeholder={placeholder}
        rows={3}
        className={`rounded-md px-3 py-2 text-gray-900 resize-none focus:outline-none
          ${
            hasError
              ? "border border-red-500 focus:ring-2 focus:ring-red-200"
              : "border border-gray-400 focus:ring-2 focus:ring-blue-200"
          }
        `}
      />

      {hasError && (
        <span className="text-xs text-red-600 mt-1">{meta.error}</span>
      )}
    </div>
  );
}

/* ================= SECTION ================= */

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-600 mb-2">
        {title}
      </h3>
      <hr/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        {children}
      </div>
    </div>
  );
}
