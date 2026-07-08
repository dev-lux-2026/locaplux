"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ConfirmModal from "../../components/ConfirmModal";
import Toast from "../../components/Toast";

interface Partner {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  phonePrefix?: string;
  company?: string;
  publicName?: string;
  vat?: string;
  website?: string;
  street?: string;
  number?: string;
  postal?: string;
  city?: string;
  country?: string;
  status?: string;
}

interface KycData {
  status: "approved" | "rejected" | "pending";
  adminComment?: string;
}

interface LogEntry {
  id: string;
  message: string;
  createdAt: string;
}

export default function AdminPartnerDetail() {
  const params = useParams();
  const id = params?.id as string;

  const [partner, setPartner] = useState<Partner | null>(null);
  const [kyc, setKyc] = useState<KycData | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string | null>(null);

  const [adminComment, setAdminComment] = useState<string>("");
  const [toast, setToast] = useState<
    null | { message: string; type: "success" | "error" }
  >(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      const p = await fetch(`/api/admin/partners/${id}`).then((r) => r.json());
      const k = await fetch(`/api/admin/partners/${id}/kyc`).then((r) =>
        r.status === 200 ? r.json() : null
      );
      const l = await fetch(`/api/admin/partners/${id}/logs`).then((r) =>
        r.status === 200 ? r.json() : []
      );

      setPartner(p);
      setKyc(k);
      setLogs(l);
      setLoading(false);
    }

    load();
  }, [id]);

  function openModal(type: string) {
    setActionType(type);
    setModalOpen(true);
  }

  async function confirmAction() {
    if (!actionType) return;

    setProcessing(true);

    let endpoint = `/api/admin/partners/${id}`;
    let method = "PATCH";
    let body: any = null;

    if (
      ["approved", "active", "paused", "banned", "rejected", "pending"].includes(
        actionType
      )
    ) {
      body = JSON.stringify({ status: actionType });
    }

    if (actionType === "delete") {
      method = "DELETE";
    }

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      ...(body && { body }),
    });

    if (res.ok) {
      setToast({ message: "Action effectuée", type: "success" });

      if (actionType === "delete") {
        window.location.href = "/admin/partners";
        return;
      }

      if (body) {
        const newStatus = JSON.parse(body).status;
        setPartner((prev) => (prev ? { ...prev, status: newStatus } : prev));
      }
    } else {
      setToast({ message: "Erreur lors de l’action", type: "error" });
    }

    setProcessing(false);
    setModalOpen(false);
  }

  async function updateKYC(newStatus: "approved" | "rejected") {
    setProcessing(true);

    const res = await fetch(`/api/admin/partners/${id}/kyc`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: newStatus,
        adminComment,
      }),
    });

    if (res.ok) {
      setToast({ message: "KYC mis à jour", type: "success" });
      const updated = await res.json();
      setKyc(updated);

      setPartner((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus === "approved" ? "approved" : "rejected",
            }
          : prev
      );
    } else {
      setToast({ message: "Erreur lors de la mise à jour KYC", type: "error" });
    }

    setProcessing(false);
  }

  if (loading) return <p>Chargement...</p>;
  if (!partner) return <p>Partenaire introuvable.</p>;

  const statusColors: Record<string, string> = {
    approved: "bg-green-100 text-green-700",
    active: "bg-green-200 text-green-800",
    paused: "bg-yellow-100 text-yellow-700",
    banned: "bg-red-100 text-red-700",
    pending: "bg-gray-100 text-gray-700",
    rejected: "bg-red-200 text-red-800",
  };

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Link href="/admin/partners" className="text-blue-600 hover:underline">
        ← Retour
      </Link>

      <h1 className="text-2xl font-bold">Partenaire #{partner.id}</h1>

      <Link
        href={`/partner/dashboard?asAdmin=1&partnerId=${partner.id}`}
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        👁️ Voir comme ce partenaire
      </Link>

     <ConfirmModal
  open={modalOpen}
  onClose={() => !processing && setModalOpen(false)}
  onConfirm={confirmAction}
  title="Confirmation"
  message={
    processing ? "Traitement en cours..." : "Confirmer cette action ?"
  }
/>
      {/* Infos partenaires */}
      <div className="space-y-2 bg-white p-6 shadow rounded">
        <p><span className="font-semibold">Nom public :</span> {partner.publicName || "—"}</p>
        <p><span className="font-semibold">Entreprise :</span> {partner.company || "—"}</p>

        <p><span className="font-semibold">Nom :</span> {partner.firstName} {partner.lastName}</p>
        <p><span className="font-semibold">Email :</span> {partner.email}</p>

        <p>
          <span className="font-semibold">Téléphone :</span>{" "}
          {partner.phonePrefix} {partner.phone}
        </p>

        <p><span className="font-semibold">TVA :</span> {partner.vat || "—"}</p>

        {/* Badge TVA */}
        {partner.vat && (
          <p>
            <span className="font-semibold">Statut TVA :</span>{" "}
            {partner.vatCheckFailed === false && (
              <span className="px-3 py-1 rounded text-sm bg-green-100 text-green-700">
                TVA valide
              </span>
            )}

            {partner.vatCheckFailed === true && (
              <span className="px-3 py-1 rounded text-sm bg-red-100 text-red-700">
                TVA invalide
              </span>
            )}

            {(partner.vatCheckFailed === null ||
              partner.vatCheckFailed === undefined) && (
              <span className="px-3 py-1 rounded text-sm bg-yellow-100 text-yellow-700">
                TVA non vérifiée
              </span>
            )}
          </p>
        )}

        {/* Vérification TVA */}
        <button
          onClick={async () => {
            const res = await fetch(`/api/admin/partners/${partner.id}/vat`);
            const data = await res.json();

            setToast({
              message: data.message,
              type: data.status === "valid" ? "success" : "error",
            });

            const updated = await fetch(`/api/admin/partners/${partner.id}`).then(r => r.json());
            setPartner(updated);
          }}
          className="mt-2 px-3 py-1.5 bg-black text-white rounded hover:bg-gray-800 text-sm"
        >
          Vérifier TVA maintenant
        </button>

        <p><span className="font-semibold">Site web :</span> {partner.website || "—"}</p>

        <p className="mt-3">
          <span className="font-semibold">Adresse :</span><br />
          {partner.street && (
            <>
              {partner.street} {partner.number}
              <br />
            </>
          )}
          {partner.postal} {partner.city}
          <br />
          {partner.country}
        </p>

        <p className="mt-3">
          <span className="font-semibold">Statut :</span>{" "}
          <span className={`px-3 py-1 rounded text-sm ${statusColors[partner.status ?? "pending"]}`}>
            {partner.status}
          </span>
        </p>
      </div>

      {/* Actions statut */}
      <div className="space-x-3 bg-white p-6 shadow rounded">
        {partner.status !== "approved" && (
          <button
            disabled={processing}
            onClick={() => openModal("approved")}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Approuver
          </button>
        )}

        {partner.status !== "paused" && (
          <button
            disabled={processing}
            onClick={() => openModal("paused")}
            className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Mettre en pause
          </button>
        )}

        {partner.status !== "banned" && (
          <button
            disabled={processing}
            onClick={() => openModal("banned")}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Bannir
          </button>
        )}
      </div>

      {/* Produits */}
      <div className="space-y-4 bg-white p-6 shadow rounded">
        <h2 className="text-xl font-semibold">Produits du partenaire</h2>

        {partner.products?.length === 0 && (
          <p>Aucun produit pour ce partenaire.</p>
        )}

        {partner.products?.map((product: any) => (
          <div key={product.id} className="border p-4 rounded">
            <p><strong>Nom :</strong> {product.name}</p>
            <p><strong>Statut :</strong> {product.status}</p>
            <p><strong>Prix :</strong> {product.price} €</p>

            <a
              href={`/admin/products/${product.id}`}
              className="text-blue-600 underline"
            >
              Voir le produit
            </a>
          </div>
        ))}
      </div>

      {/* KYC */}
      <div className="space-y-4 bg-white p-6 shadow rounded">
        <h2 className="text-xl font-semibold">Documents KYC</h2>

        {kyc?.documents?.length > 0 ? (
          <ul className="list-disc ml-6">
            {kyc.documents.map((doc: string, i: number) => (
              <li key={i}>
                <a
                  href={doc}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Document {i + 1}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun document envoyé.</p>
        )}

        <textarea
          placeholder="Commentaire admin (optionnel)"
          className="w-full border p-2 rounded"
          value={adminComment}
          onChange={(e) => setAdminComment(e.target.value)}
        />

        <div className="space-x-3">
          <button
            disabled={processing}
            onClick={() => updateKYC("approved")}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Approuver KYC
          </button>

          <button
            disabled={processing}
            onClick={() => updateKYC("rejected")}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Rejeter KYC
          </button>
        </div>
      </div>

      {/* Logs admin */}
      <div className="space-y-4 bg-white p-6 shadow rounded">
        <h2 className="text-xl font-semibold">Historique des actions admin</h2>

        {logs.length === 0 && <p>Aucune action enregistrée.</p>}

        {logs.map((log) => (
          <div key={log.id} className="border p-3 rounded">
            <p>
              <strong>Action :</strong> {log.action}
            </p>
            {log.comment && (
              <p>
                <strong>Commentaire :</strong> {log.comment}
              </p>
            )}
            <p>
              <strong>Admin :</strong>{" "}
              {log.admin?.name || log.admin?.email || "Admin inconnu"}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(log.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
