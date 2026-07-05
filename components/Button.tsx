import React from "react";
import clsx from "clsx";

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  [key: string]: any;
}) {
  return (
    <button
      {...props}
      className={clsx(
        "px-4 py-2 rounded font-medium transition",
        variant === "primary" && "bg-black text-white hover:bg-gray-800",
        variant === "secondary" && "bg-gray-200 text-gray-900 hover:bg-gray-300",
        className
      )}
    >
      {children}
    </button>
  );
}
