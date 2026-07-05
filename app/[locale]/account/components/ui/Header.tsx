"use client";

import { useState } from "react";
import Image from "next/image";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full flex items-center justify-between mb-8">
      {/* Left: Page title (dynamic if needed) */}
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Mon compte
      </h1>

      {/* Right: Avatar + menu */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
        >
          <Image
            src="/default-avatar.png"
            alt="Avatar"
            width={36}
            height={36}
            className="rounded-full border border-neutral-300 dark:border-neutral-700"
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="
              absolute right-0 mt-2 w-48 rounded-xl shadow-lg border
              bg-white dark:bg-neutral-900
              border-neutral-200 dark:border-neutral-800
              animate-fadeInMenu
              z-50
            "
          >
            <a
              href="/account/profile"
              className="block px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Profil
            </a>

            <a
              href="/account/orders"
              className="block px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Mes commandes
            </a>

            <a
              href="/account/messages"
              className="block px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Messages
            </a>

            <div className="border-t border-neutral-200 dark:border-neutral-800 my-1" />

            <a
              href="/api/auth/logout"
              className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Déconnexion
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
