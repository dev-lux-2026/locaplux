import { ReactNode, ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const base =
    "px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2";

  const variants = {
    primary:
      "bg-lp-blue text-white hover:bg-blue-600 dark:hover:bg-blue-500",
    secondary:
      "bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700",
    ghost:
      "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
    danger:
      "bg-lp-red text-white hover:bg-red-600 dark:hover:bg-red-500",
  };

  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
