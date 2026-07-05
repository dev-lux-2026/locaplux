import { partnerGuard } from "@/lib/guards/partnerGuard";
import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/lib/logAdminAction";
import { PartnerModeProvider } from "@/lib/context/PartnerModeContext";

export default async function PartnerLayout({ children }) {
  const { mode, userId: adminId } = await partnerGuard();

  // On récupère l'URL via les props du layout (Next.js 15)
  // Le layout reçoit automatiquement "params" et "searchParams"
  // mais comme tu n'as pas défini la signature, on utilise une astuce :
  const fullUrl = globalThis.location?.href || ""; // fallback client
  const urlObj = new URL(fullUrl || "http://localhost");
  const searchParams = urlObj.searchParams;
  const pathname = urlObj.pathname;

  const partnerId = searchParams.get("partnerId");

  let partnerData = null;

  /* -------------------------------------------------------------------------- */
  /*                         MODE ADMIN OVERWATCH SEULEMENT                     */
  /* -------------------------------------------------------------------------- */

  if (mode === "admin-overwatch") {
    if (partnerId) {
      partnerData = await prisma.user.findUnique({
        where: { id: partnerId },
        select: {
          publicName: true,
          company: true,
          firstName: true,
          lastName: true,
          avatar: true,
          image: true,
          status: true,
          city: true,
          country: true,
        },
      });

      // LOG INTELLIGENT
      let action;

      if (pathname.includes("/products")) action = "Consultation des produits";
      else if (pathname.includes("/orders")) action = "Consultation des commandes";
      else if (pathname.includes("/payouts")) action = "Consultation des paiements";
      else if (pathname.includes("/messages")) action = "Consultation des messages";
      else if (pathname.includes("/account")) action = "Consultation du profil partenaire";
      else if (pathname.includes("/settings")) action = "Consultation des paramètres partenaire";
      else action = "Consultation du dashboard partenaire";

      await logAdminAction({
        adminId,
        partnerId,
        action,
      });
    }

    // Forcer asAdmin=1 si absent
    if (!searchParams.get("asAdmin")) {
      redirect(
        `/partner/dashboard?asAdmin=1${partnerId ? `&partnerId=${partnerId}` : ""}`
      );
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                         PRÉPARATION MINI PROFIL                            */
  /* -------------------------------------------------------------------------- */

  const partnerName =
    partnerData?.publicName ||
    partnerData?.company ||
    `${partnerData?.firstName || ""} ${partnerData?.lastName || ""}`.trim();

  const partnerPhoto = partnerData?.avatar || partnerData?.image || null;

  const partnerStatus = partnerData?.status || null;

  const partnerLocation =
    partnerData?.city && partnerData?.country
      ? `${partnerData.city}, ${partnerData.country}`
      : partnerData?.country || partnerData?.city || null;

  /* -------------------------------------------------------------------------- */
  /*                                NAVIGATION                                  */
  /* -------------------------------------------------------------------------- */

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

  /* -------------------------------------------------------------------------- */
  /*                                 RENDER                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* BANDEAU OVERWATCH */}
      {mode === "admin-overwatch" && (
        <>
          <div className="bg-red-600 text-white py-2 z-50 flex items-center justify-center gap-8 px-4">

            {partnerPhoto && (
              <img
                src={partnerPhoto}
                alt="Logo partenaire"
                className="w-10 h-10 rounded-full border border-white shadow"
              />
            )}

            <div className="flex flex-col text-center">
              <span className="font-semibold">
                🛡️ Mode Admin Overwatch — Vous observez :
              </span>

              <span className="font-bold underline text-lg">
                {partnerName || "Partenaire inconnu"}
              </span>

              <div className="text-sm opacity-90">
                {partnerStatus && (
                  <span className="mr-2 capitalize">
                    Statut : <strong>{partnerStatus}</strong>
                  </span>
                )}

                {partnerLocation && (
                  <span>
                    Localisation : <strong>{partnerLocation}</strong>
                  </span>
                )}
              </div>
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
          <main className="flex-1 p-8 mt-6">
            {children}
          </main>
        </PartnerModeProvider>
      </div>
    </div>
  );
}
