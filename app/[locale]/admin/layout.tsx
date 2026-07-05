import { adminGuard } from "./guard";
import Link from "next/link";

export default async function AdminLayout({ children }) {
  await adminGuard(); // Protection serveur

  const nav = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/partners", label: "Partenaires" },
    { href: "/admin/products", label: "Produits" },
    { href: "/admin/orders", label: "Commandes" },
    { href: "/admin/categories", label: "Catégories" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 shrink-0 bg-gray-900 text-white p-6 space-y-6">
        <h2 className="text-xl font-bold">Locaplux Admin</h2>

        <nav className="flex flex-col space-y-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-gray-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* CONTENU */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-x-auto">
        {children}
      </main>
    </div>
  );
}
