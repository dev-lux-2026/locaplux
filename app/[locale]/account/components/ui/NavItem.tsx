"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

type NavItemProps = {
  href: string;
  label: ReactNode;
  icon: ReactNode;
};

export default function NavItem({ href, label, icon }: NavItemProps) {
  const pathname = usePathname();
  const active = pathname.startsWith(href);

  return (
    <a
      href={href}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-lg transition
        ${
          active
            ? "bg-neutral-100 dark:bg-neutral-800 text-lp-black dark:text-white font-medium"
            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        }
      `}
    >
      <span className="w-5 h-5">{icon}</span>
      {label}
    </a>
  );
}
