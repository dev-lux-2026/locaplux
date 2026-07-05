"use client";

import { useState } from "react";
import MobileMenuButton from "./components/ui/MobileMenuButton";
import MobileDrawer from "./components/ui/MobileDrawer";
import Header from "./components/ui/Header";

export default function AccountLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-neutral-50 dark:bg-neutral-950">

      {/* Drawer mobile */}
      <MobileDrawer open={open} onClose={() => setOpen(false)} />

      {/* Sidebar desktop */}
      <aside className="w-64 hidden md:flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="p-6 text-xl font-semibold">Locaplux</div>

        <nav className="flex flex-col gap-1 px-4">
          {/* NavItem déjà configurés */}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10">

        {/* Header mobile */}
        <div className="md:hidden mb-6 flex items-center justify-between">
          <MobileMenuButton onClick={() => setOpen(true)} />
          <span className="text-lg font-semibold">Locaplux</span>
        </div>

        {/* Header desktop premium */}
        <div className="hidden md:block">
          <Header />
        </div>

        {children}
      </main>
    </div>
  );
}
