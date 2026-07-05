"use client";

import { useEffect, useState } from "react";

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/logs")
      .then((res) => res.json())
      .then((data) => setLogs(data));
  }, []);

  if (!logs) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Chargement du journal d’audit…
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-10">

      {/* HEADER */}
      <header>
        <p className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase">
          Locaplux • Administration
        </p>

        <h1 className="mt-2 text-4xl font-semibold text-gray-900">
          Journal d’audit global
        </h1>

        <p className="mt-3 text-sm text-gray-600 max-w-2xl">
          Historique complet des actions effectuées sur la marketplace :
          partenaires, produits, commandes, paiements et système.
        </p>
      </header>

      {/* LISTE DES LOGS */}
      <section className="space-y-6">
        {logs.length === 0 && (
          <div className="text-gray-600 text-center py-20">
            Aucun événement enregistré pour le moment.
          </div>
        )}

        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-900">{log.action}</p>

                {log.description && (
                  <p className="text-gray-600 text-sm mt-1">
                    {log.description}
                  </p>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  {new Date(log.createdAt).toLocaleString("fr-FR")}
                </p>

                {log.user && (
                  <p className="text-xs text-gray-500 mt-1">
                    Par : {log.user}
                  </p>
                )}
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  log.type === "product"
                    ? "bg-blue-100 text-blue-700"
                    : log.type === "order"
                    ? "bg-green-100 text-green-700"
                    : log.type === "partner"
                    ? "bg-purple-100 text-purple-700"
                    : log.type === "payment"
                    ? "bg-yellow-100 text-yellow-700"
                    : log.type === "system"
                    ? "bg-gray-200 text-gray-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {log.type}
              </span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
