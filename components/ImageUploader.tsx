"use client";

import { useState } from "react";

export default function ImageUploader({
  onUpload,
  onDelete,
  images,
}: {
  onUpload: (data: { url: string; autoCategory?: any }) => void;
  onDelete: (url: string) => void;
  images: string[];
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    setUploading(true);
    setProgress({ current: 0, total: files.length });

    const nameInput = document.querySelector("input[name='name']") as HTMLInputElement | null;
    const descInput = document.querySelector("textarea[name='description']") as HTMLTextAreaElement | null;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress({ current: i + 1, total: files.length });

      const fd = new FormData();
      fd.append("file", file);
      fd.append("name", nameInput?.value || "");
      fd.append("description", descInput?.value || "");

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: fd,
          credentials: "include",
        });

        const data = await res.json();
        console.log("UPLOAD RESULT:", data);

        if (data.url) {
          onUpload({
            url: data.url,
            autoCategory: data.autoCategory,
          });
        }
      } catch (err) {
        console.error("Erreur upload fichier:", file.name, err);
      }
    }

    setUploading(false);
    setProgress(null);
    // Réinitialise l'input pour pouvoir re-sélectionner des fichiers ensuite
    e.target.value = "";
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        disabled={uploading}
        className="block w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-black file:text-white dark:file:bg-white dark:file:text-black hover:file:opacity-90"
      />

      {uploading && (
        <p className="text-sm text-gray-500">
          Upload en cours… {progress ? `(${progress.current}/${progress.total})` : ""}
        </p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((img, i) => {
            const src = typeof img === "string" ? img : (img as any).url;
            return (
              <div key={`${src}-${i}`} className="relative group">
                <img
                  src={src}
                  alt={`Produit ${i + 1}`}
                  className="w-full h-32 object-cover rounded-xl border border-gray-200 dark:border-white/10"
                />

                <button
                  type="button"
                  onClick={() => onDelete(src)}
                  className="absolute top-2 right-2 bg-black/75 text-white text-xs px-2.5 py-1 rounded-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition"
                >
                  Supprimer
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}