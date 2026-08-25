import type { ChangeEvent } from "react";

type InputProps = {
  label: string;
  type: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
};

export default function Input({
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        className={`rounded-md border px-3 py-2 text-slate-900 outline-none ${
          error
            ? "border-red-500 focus:ring-1 focus:ring-red-500"
            : "border-slate-300 focus:ring-1 focus:ring-blue-500"
        }`}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}