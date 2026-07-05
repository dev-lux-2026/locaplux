"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Toast from "../components/Toast";

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<
    null | { message: string; type: "success" | "error" }
  >(null);

  useEffect(() => {
    fetch("/api/admin/partners/list")
      .then((res) => res.json())
      .then((data) => {
        setPartners(data);
        setLoading(false);
      });
  }, []);

  const statusColors: any = {
    approved: "bg-green-100 text-green-700",
    active: "bg-green-200 text-green-800",
    paused: "bg-yellow-100 text-yellow-700",
    banned: "bg-red-100 text-red-700",
    pending: "bg-gray-100 text-gray-700",
    rejected: "bg-red-200 text-red-800",
  };

  if (loading) return <p className="p-6">Chargement...</p>;

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-2xl font-bold">Partenaires</h1>

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Nom public</th>
              <th className="p-3">Entreprise</th>
              <th className="p-3">Email</th>
              <th className="p-3">Téléphone</th>
              <th className="p-3">Adresse</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Produits</th>
              <th className="p-3">Commission</th>
              <th className="p-3">Limite gratuite</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {partners.map((partner) => (
              <tr key={partner.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-semibold">
                  {partner.publicName || "—"}
                </td>

                <td className="p-3">{partner.company || "—"}</td>

                <td className="p-3">{partner.email}</td>

                <td className="p-3">
                  {partner.phonePrefix} {partner.phone}
                </td>

                <td className="p-3 text-sm">
                  {partner.street && (
                    <>
                      {partner.street} {partner.number}
                      <br />
                    </>
                  )}
                  {partner.postal} {partner.city}
                  <br />
                  {partner.country}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${statusColors[partner.status]}`}
                  >
                    {partner.status}
                  </span>
                </td>

                <td className="p-3">{partner._count.products}</td>

                <td className="p-3">
                  {partner.commissionRate
                    ? `${partner.commissionRate * 100}%`
                    : "Défaut"}
                </td>

                <td className="p-3">
                  {partner.freeProductLimit ?? 0} produits<br />
                  {partner.freeUntil
                    ? `Jusqu'au ${new Date(
                        partner.freeUntil
                      ).toLocaleDateString()}`
                    : "—"}
                </td>

                <td className="p-3 space-x-3">
                  <Link
                    href={`/admin/partners/${partner.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Voir
                  </Link>

                  {partner.status !== "approved" && (
                    <button
                      className="text-green-600 hover:underline"
                      onClick={async () => {
                        await fetch(`/api/admin/partners/${partner.id}/status`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            status: "approved",
                            adminId: "system",
                          }),
                        });

                        setToast({
                          message: "Partenaire approuvé",
                          type: "success",
                        });

                        setPartners((prev) =>
                          prev.map((p) =>
                            p.id === partner.id
                              ? { ...p, status: "approved" }
                              : p
                          )
                        );
                      }}
                    >
                      Approuver
                    </button>
                  )}

                  {partner.status !== "paused" && (
                    <button
                      className="text-yellow-600 hover:underline"
                      onClick={async () => {
                        await fetch(`/api/admin/partners/${partner.id}/status`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            status: "paused",
                            adminId: "system",
                          }),
                        });

                        setToast({
                          message: "Partenaire mis en pause",
                          type: "success",
                        });

                        setPartners((prev) =>
                          prev.map((p) =>
                            p.id === partner.id
                              ? { ...p, status: "paused" }
                              : p
                          )
                        );
                      }}
                    >
                      Pause
                    </button>
                  )}

                  {partner.status !== "banned" && (
                    <button
                      className="text-red-600 hover:underline"
                      onClick={async () => {
                        await fetch(`/api/admin/partners/${partner.id}/status`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            status: "banned",
                            adminId: "system",
                          }),
                        });

                        setToast({
                          message: "Partenaire banni",
                          type: "success",
                        });

                        setPartners((prev) =>
                          prev.map((p) =>
                            p.id === partner.id
                              ? { ...p, status: "banned" }
                              : p
                          )
                        );
                      }}
                    >
                      Bannir
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
