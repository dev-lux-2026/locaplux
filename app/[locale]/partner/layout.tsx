"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PartnerModeProvider } from "@/lib/context/PartnerModeContext";

export default function PartnerLayout({ children }) {
  const [mode, setMode] = useState<string | null>(null);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [partnerData, setPartnerData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const fullUrl = window.location.href;
      const urlObj = new URL(fullUrl);
      const searchParams = urlObj.searchParams;

      const modeParam = searchParams.get("mode");
      const pid = searchParams.get("partnerId");

      setMode(modeParam);
      setPartnerId(pid);

      if (modeParam === "admin-overwatch" && pid) {
        const res = await fetch(`/api/admin/partners/${pid}`);
        const data = await res.json();
        setPartnerData(data);
      }
    }

    load();
  }, []);

  const nav = [
    { href: "/partner/dashboard", label: "Dashboard" },
    { href: "/partner/products", label: "Mes produits" },
    { href: "/partner/products/new", label: "➕ Ajouter un produit" },
    { href: "/partner/orders", label: "Commandes" },
    { href: "/partner/payouts", label: "Paiements" },
    { href: "/partner/account", label: "Mon compte" },
    { href: "/partner/settings", label: "Paramètres" },
  ];

  const overwatchMenu = [
    { href: "/partner/products", label: "Produits" },
    { href: "/partner/orders", label: "Commandes" },
    { href: "/partner/messages", label: "Messages" },
    { href: "/partner/account", label: "Profil" },
    { href: "/partner/settings", label: "Paramètres" },
  ];

  const readOnly = mode === "admin-overwatch";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {mode === "admin-overwatch" && partnerData && (
        <>
          <div className="bg-red-600 text-white py-2 z-50 flex items-center justify-center gap-8 px-4">
            {partnerData.avatar && (
              <Image
                src={partnerData.avatar}
                alt="Logo partenaire"
                width={40}
                height={40}
                className="rounded-full border border-white shadow"
              />
            )}

            <div className="flex flex-col text-center">
              <span className="font-semibold">
                🛡️ Mode Admin Overwatch — Vous observez :
              </span>

              <span className="font-bold underline text-lg">
                {partnerData.publicName ||
                  partnerData.company ||
                  `${partnerData.firstName} ${partnerData.lastName}`}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white text-red-700 px-3 py-1 rounded shadow">
              <Link href="/admin/partners" className="font-semibold hover:underline">
                Admin
              </Link>

              <span className="text-gray-500">↔</span>

              <Link
                href={`/partner/dashboard?asAdmin=1${partnerId ? `&partnerId=${partnerId}` : ""}`}
                className="font-semibold hover:underline"
              >
                Partenaire
              </Link>
            </div>
          </div>

          <div className="bg-red-100 border-b border-red-300 py-2 flex justify-center gap-6 text-red-700 font-medium">
            {overwatchMenu.map((item) => (
              <Link
                key={item.href}
                href={`${item.href}?asAdmin=1${partnerId ? `&partnerId=${partnerId}` : ""}`}
                className="hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </>
      )}

      <div className="flex flex-1">
        <aside className="w-64 bg-white shadow-md p-6 hidden md:block mt-6">
          <h2 className="text-xl font-bold mb-6">Espace partenaire</h2>

          <nav className="space-y-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={
                  mode === "admin-overwatch"
                    ? `${item.href}?asAdmin=1${partnerId ? `&partnerId=${partnerId}` : ""}`
                    : item.href
                }
                className="block px-2 py-1 rounded hover:text-blue-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <PartnerModeProvider readOnly={readOnly}>
          <main className="flex-1 p-8 mt-6">{children}</main>
        </PartnerModeProvider>
      </div>
    </div>
  );
}
