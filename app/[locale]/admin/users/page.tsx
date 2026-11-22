"use client";

import { useEffect, useMemo, useState } from "react";

interface AdminUser {
  id: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  publicName?: string | null;
  email?: string | null;
  role: string;
  status: string;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
  company?: string | null;
  preferredLanguage?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  _count?: {
    ordersAsBuyer: number;
    products: number;
    buyerQuestions: number;
  };
}

function getDisplayName(u: AdminUser) {
  const full = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
  return u.publicName || u.name || full || u.email || u.id;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Erreur lors du chargement");
        }
        return data;
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
          if (data.length > 0) {
            setSelectedId(data[0].id);
          }
        }
      })
      .catch((err: any) => {
        setError(err?.message || "Erreur serveur");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const hay = [
        u.id,
        u.name,
        u.firstName,
        u.lastName,
        u.publicName,
        u.email,
        u.role,
        u.city,
        u.country,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [users, search]);

  const selectedUser = useMemo(
    () =>
      filteredUsers.find((u) => u.id === selectedId) ??
      users.find((u) => u.id === selectedId) ??
      filteredUsers[0] ??
      null,
    [filteredUsers, users, selectedId]
  );

  if (loading) {
    return <div className="text-gray-600">Chargement des utilisateurs...</div>;
  }

  if (error) {
    return (
      <div className="rounded bg-red-50 border border-red-200 p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Utilisateurs</h1>
          <p className="text-sm text-gray-500">
            {users.length} utilisateur{users.length > 1 ? "s" : ""} enregistré
            {users.length > 1 ? "s" : ""}
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher (nom, email, rôle, ville...)"
          className="w-full sm:w-80 rounded border border-gray-300 bg-white px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LISTE */}
        <div className="bg-white rounded shadow p-4 space-y-2 lg:col-span-1">
          <h2 className="font-semibold text-sm text-gray-700 mb-2">
            Liste ({filteredUsers.length})
          </h2>

          {filteredUsers.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">
              Aucun utilisateur trouvé.
            </p>
          ) : (
            <div className="space-y-2 max-h-[65vh] overflow-y-auto">
              {filteredUsers.map((u) => {
                const isSelected = selectedUser?.id === u.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setSelectedId(u.id)}
                    className={`w-full text-left p-3 rounded border transition ${
                      isSelected
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="font-medium truncate">
                      {getDisplayName(u)}
                    </div>
                    <div
                      className={`text-xs truncate ${
                        isSelected ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {u.email || "Sans email"} · {u.role}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* DÉTAILS */}
        <div className="bg-white rounded shadow p-6 lg:col-span-2">
          <h2 className="font-semibold text-lg mb-4">
            Détails de l&apos;utilisateur
          </h2>

          {selectedUser ? (
            <div className="space-y-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-gray-500">ID</dt>
                  <dd className="font-mono text-xs break-all mt-0.5">
                    {selectedUser.id}
                  </dd>
                </div>

                <div>
                  <dt className="text-gray-500">Nom affiché</dt>
                  <dd className="font-medium mt-0.5">
                    {getDisplayName(selectedUser)}
                  </dd>
                </div>

                <div>
                  <dt className="text-gray-500">Email</dt>
                  <dd className="mt-0.5">{selectedUser.email || "—"}</dd>
                </div>

                <div>
                  <dt className="text-gray-500">Rôle &amp; statut</dt>
                  <dd className="mt-0.5">
                    {selectedUser.role} · {selectedUser.status}
                  </dd>
                </div>

                <div>
                  <dt className="text-gray-500">Prénom / Nom</dt>
                  <dd className="mt-0.5">
                    {`${selectedUser.firstName ?? ""} ${
                      selectedUser.lastName ?? ""
                    }`.trim() || "—"}
                  </dd>
                </div>

                <div>
                  <dt className="text-gray-500">Téléphone</dt>
                  <dd className="mt-0.5">{selectedUser.phone || "—"}</dd>
                </div>

                <div>
                  <dt className="text-gray-500">Localisation</dt>
                  <dd className="mt-0.5">
                    {[selectedUser.city, selectedUser.country]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </dd>
                </div>

                <div>
                  <dt className="text-gray-500">Langue préférée</dt>
                  <dd className="mt-0.5">
                    {selectedUser.preferredLanguage || "fr"}
                  </dd>
                </div>

                <div>
                  <dt className="text-gray-500">Inscription</dt>
                  <dd className="mt-0.5">
                    {new Date(selectedUser.createdAt).toLocaleDateString("fr-FR")}
                  </dd>
                </div>

                <div>
                  <dt className="text-gray-500">État du compte</dt>
                  <dd className="mt-0.5">
                    {selectedUser.deletedAt
                      ? `Supprimé le ${new Date(
                          selectedUser.deletedAt
                        ).toLocaleDateString("fr-FR")}`
                      : "Actif"}
                  </dd>
                </div>
              </dl>

              {selectedUser._count && (
                <div className="pt-4 border-t grid grid-cols-3 gap-4 text-center">
                  <div className="rounded bg-gray-50 p-3">
                    <div className="text-lg font-bold">
                      {selectedUser._count.ordersAsBuyer}
                    </div>
                    <div className="text-xs text-gray-500">Commandes</div>
                  </div>
                  <div className="rounded bg-gray-50 p-3">
                    <div className="text-lg font-bold">
                      {selectedUser._count.products}
                    </div>
                    <div className="text-xs text-gray-500">Produits</div>
                  </div>
                  <div className="rounded bg-gray-50 p-3">
                    <div className="text-lg font-bold">
                      {selectedUser._count.buyerQuestions}
                    </div>
                    <div className="text-xs text-gray-500">Questions</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Aucun utilisateur sélectionné.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}