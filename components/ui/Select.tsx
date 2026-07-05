import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export default function Select({ className = "", children, ...props }: SelectProps) {
  return (
    <select
      className={`
        w-full px-3 py-2 rounded-lg text-sm
        bg-white dark:bg-[#1A1A1D]
        border border-gray-300 dark:border-white/10
        focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
        transition
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  );
}
