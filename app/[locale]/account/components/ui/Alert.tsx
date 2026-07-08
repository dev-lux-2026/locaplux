import { ReactNode } from "react";
import clsx from "clsx";

export default function Alert({
  children,
  variant = "info",
}: {
  children: ReactNode;
  variant?: "info" | "success" | "danger" | "warning";
}) {
  const variants = {
    info: "bg-lp-blue/10 text-lp-blue border-l-4 border-lp-blue",
    success: "bg-lp-green/10 text-lp-green border-l-4 border-lp-green",
    danger: "bg-lp-red/10 text-lp-red border-l-4 border-lp-red",
    warning: "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500",
  };

  return (
    <div className={clsx("p-4 rounded-lg", variants[variant])}>
      {children}
    </div>
  );
}
