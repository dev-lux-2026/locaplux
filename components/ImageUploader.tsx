"use client";

import { useState } from "react";

export default function ImageUploader({
  onUpload,
  onDelete,
  images,
}: {
  onUpload: (data: { url: string; autoCategory?: any }) => void;
  onDelete: (img: any) => void;
  images: any[];
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fd = new FormData();
    fd.append("file", file);

    // 🔥 IMPORTANT : on envoie aussi name + description si tu veux l’IA texte
    const nameInput = document.querySelector("input[name='name']") as HTMLInputElement | null;
    const descInput = document.querySelector("textarea[name='description']") as HTMLTextAreaElement | null;

    fd.append("name", nameInput?.value || "");
    fd.append("description", descInput?.value || "");

    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
      credentials: "include", // indispensable pour le JWT partenaire
    });

    const data = await res.json();

    console.log("UPLOAD RESULT:", data);

    if (data.url) {
      onUpload({
        url: data.url,
        autoCategory: data.autoCategory,
      });
    }

    setUploading(false);
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        disabled={uploading}
      />

      {uploading && (
        <p className="text-sm text-gray-500">Upload en cours…</p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div key={i} className="relative group">
              <img
                src={img.url || img}
                alt="Produit"
                className="w-full h-32 object-cover rounded"
              />

              <button
                type="button"
                onClick={() => onDelete(img)}
                className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              >
                Supprimer
              </button>

              {img.autoCategory && (
                <div className="absolute bottom-1 left-1 bg-white/80 text-xs px-2 py-1 rounded shadow">
                  {img.autoCategory.category}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
