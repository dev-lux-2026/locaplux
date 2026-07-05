import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`
        border border-gray-200 dark:border-white/10 
        rounded-xl p-4 shadow-sm 
        bg-white dark:bg-[#18181A] 
        hover:shadow-lg hover:-translate-y-1 dark:hover:bg-white/5 
        transition cursor-pointer
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
