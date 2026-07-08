"use client";

import { useEffect, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);

  // 🔥 Correction strict TS ici
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/categories/list")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  function openModal(id: string) {
    setSelectedId(id);
    setModalOpen(true);
  }

  async function confirmAction() {
    await fetch(`/api/admin/categories/${selectedId}`, {
      method: "DELETE",
    });

    setToast({ message: "Catégorie supprimée", type: "success" });

    setModalOpen(false);
    setTimeout(() => location.reload(), 1200);
  }

  if (loading) return <p>Chargement...</p>;
  if (categories.length === 0) return <p>Aucune catégorie trouvée.</p>;

  return (
    <div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-2xl font-bold mb-6">Catégories</h1>

      <ConfirmModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmAction}
        title="Supprimer la catégorie"
        message="Cette action est irréversible. Confirmer ?"
      />

      <table className="w-full bg-white shadow rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Nom</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-3">{c.id}</td>
              <td className="p-3">{c.name}</td>
              <td className="p-3 space-x-3">
                <a href={`/admin/categories/${c.id}`} className="text-blue-600 hover:underline">Modifier</a>
                <button onClick={() => openModal(c.id)} className="text-red-600 hover:underline">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
