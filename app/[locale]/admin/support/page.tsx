"use client";

import { useEffect, useState } from "react";

interface SupportTicket {
  id: string;
  type: string;
  subject: string;
  priority: string;
  status: string;
  updatedAt: string;
  author: {
    publicName?: string;
    email?: string;
  };
}

interface SupportMessage {
  id: string;
  from: string;
  content: string;
  createdAt: string;
}

interface SupportDetail {
  id: string;
  subject: string;
  description: string;
  messages: SupportMessage[];
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<SupportDetail | null>(null);
  const [reply, setReply] = useState<string>("");

  useEffect(() => {
    fetch("/api/admin/support")
      .then((r) => r.json())
      .then((d) => {
        setTickets(Array.isArray(d.tickets) ? d.tickets : []);
      });
  }, []);

  const openTicket = async (id: string) => {
    setSelected(id);

    const res = await fetch(`/api/admin/support/${id}`);
    const data = await res.json();

    setDetail(data);
  };

  const sendReply = async () => {
    if (!reply.trim() || !selected) return;

    await fetch(`/api/admin/support/${selected}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: reply, adminId: "admin" }),
    });

    setReply("");
    openTicket(selected);
  };

  const changeStatus = async (status: string) => {
    if (!selected) return;

    await fetch(`/api/admin/support/${selected}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    openTicket(selected);
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Support & Médiation</h1>

      {/* TABLEAU */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Sujet</th>
              <th className="p-3 text-left">Auteur</th>
              <th className="p-3 text-left">Priorité</th>
              <th className="p-3 text-left">Statut</th>
              <th className="p-3 text-left">MAJ</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((t) => (
              <tr
                key={t.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => openTicket(t.id)}
              >
                <td className="p-3">{t.type}</td>
                <td className="p-3">{t.subject}</td>
                <td className="p-3">{t.author.publicName || t.author.email}</td>
                <td className="p-3">{t.priority}</td>
                <td className="p-3">{t.status}</td>
                <td className="p-3">
                  {new Date(t.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DÉTAIL */}
      {detail && (
        <div className="border rounded-lg p-6 space-y-6 bg-white shadow">
          <h2 className="text-xl font-semibold">{detail.subject}</h2>

          <p className="text-gray-700">{detail.description}</p>

          <div className="space-y-3">
            <h3 className="font-semibold">Messages</h3>

            <div className="space-y-2">
              {detail.messages.map((m) => (
                <div key={m.id} className="p-3 border rounded">
                  <div className="text-xs text-gray-500">
                    {m.from} — {new Date(m.createdAt).toLocaleString()}
                  </div>
                  <div>{m.content}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RÉPONSE */}
          <div className="space-y-3">
            <textarea
              className="w-full border rounded p-3"
              rows={3}
              placeholder="Votre réponse…"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />

            <button
              onClick={sendReply}
              className="px-4 py-2 bg-black text-white rounded"
            >
              Envoyer
            </button>
          </div>

          {/* STATUT */}
          <div className="flex gap-3">
            {["open", "in_progress", "resolved", "closed"].map((s) => (
              <button
                key={s}
                onClick={() => changeStatus(s)}
                className="px-3 py-1 border rounded"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
