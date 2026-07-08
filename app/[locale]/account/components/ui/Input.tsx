import { InputHTMLAttributes, ReactNode } from "react";

type InputProps = {
  label?: ReactNode;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({ label, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm text-neutral-600 dark:text-neutral-300">
          {label}
        </label>
      )}

      <input
        className={`
          w-full px-3 py-2 rounded-lg border
          bg-white dark:bg-neutral-900
          border-neutral-300 dark:border-neutral-700
          text-neutral-900 dark:text-neutral-100
          focus:outline-none focus:ring-2 focus:ring-lp-blue
          transition
          ${className || ""}
        `}
        {...props}
      />
    </div>
  );
}
