import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "danger";
  loading?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const variantClasses =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-blue-600 hover:bg-blue-700";

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`rounded-md px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses} ${className}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}