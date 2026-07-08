import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={`
        rounded-xl bg-white dark:bg-neutral-900
        border border-neutral-200 dark:border-neutral-800
        shadow-sm p-6
        ${className || ""}
      `}
    >
      {children}
    </div>
  );
}
