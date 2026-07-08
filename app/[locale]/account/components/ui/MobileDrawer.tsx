"use client";

import { useEffect } from "react";
import NavItem from "./NavItem";
import {
  DashboardIcon,
  ProductsIcon,
  OrdersIcon,
  ProfileIcon,
} from "./icons";

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn z-40"
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 text-xl font-semibold">Locaplux</div>

        <nav className="flex flex-col gap-1 px-4">
          <NavItem href="/account/dashboard" label="Dashboard" icon={DashboardIcon} />
          <NavItem href="/account/products" label="Produits" icon={ProductsIcon} />
          <NavItem href="/account/orders" label="Commandes" icon={OrdersIcon} />
          <NavItem href="/account/profile" label="Profil" icon={ProfileIcon} />
        </nav>
      </div>
    </>
  );
}
