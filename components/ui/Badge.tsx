import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-block px-3 py-1 text-xs rounded-full
        bg-gray-100 dark:bg-[#1F1F22]
        text-gray-700 dark:text-gray-300
        ${className}
      `}
    >
      {children}
    </span>
  );
}
