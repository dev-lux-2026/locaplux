import { ReactNode } from "react";
import clsx from "clsx";

export default function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "success" | "danger" | "warning" | "info";
}) {
  const variants = {
    default:
      "bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200",
    success: "bg-lp-green/20 text-lp-green",
    danger: "bg-lp-red/20 text-lp-red",
    warning: "bg-yellow-200 text-yellow-800",
    info: "bg-lp-blue/20 text-lp-blue",
  };

  return (
    <span
      className={clsx(
        "px-2 py-1 text-xs rounded-lg font-medium",
        variants[variant]
      )}
    >
      {children}
    </span>
  );
}
