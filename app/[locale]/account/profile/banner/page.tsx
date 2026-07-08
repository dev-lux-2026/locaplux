"use client";

import { useState, ChangeEvent } from "react";
import Cropper from "react-easy-crop";
import { useToast } from "@/components/ui/use-toast";

export default function BannerUploadPage() {
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // 🔥 Obligatoire pour react-easy-crop
  const [crop, setCrop] = useState({ x: 0, y: 0 });

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);

  const MAX_SIZE_MB = 5;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (!f) return;

    if (f.size > MAX_SIZE_BYTES) {
      toast.error(`Image trop lourde. Taille maximale : ${MAX_SIZE_MB} Mo.`);
      return;
    }

    setFile(f);

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(f);
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
    });

  const getCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return null;

    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), "image/jpeg");
    });
  };

  const handleUpload = async () => {
    setLoading(true);

    const croppedBlob = await getCroppedImage();
    if (!croppedBlob) {
      toast.error("Impossible de recadrer l’image.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", croppedBlob, "banner.jpg");

    const res = await fetch("/api/account/banner", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      toast.success("Bannière mise à jour.");
      setImageSrc(null);
      setFile(null);
    } else {
      toast.error("Impossible d’envoyer la bannière.");
    }
  };

  const handleDelete = async () => {
    setLoading(true);

    const res = await fetch("/api/account/banner", {
      method: "DELETE",
    });

    setLoading(false);

    if (res.ok) {
      toast.success("Bannière supprimée.");
      setImageSrc(null);
      setFile(null);
    } else {
      toast.error("Impossible de supprimer la bannière.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0B0C] px-4 py-10">
      <div className="max-w-xl mx-auto bg-white dark:bg-[#0F0F10] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm space-y-6">

        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Mettre à jour votre bannière
        </h1>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Format recommandé : <strong>1600×500</strong><br />
          Ratio imposé : <strong>3:1</strong><br />
          Taille max : <strong>{MAX_SIZE_MB} Mo</strong>
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 dark:text-gray-300"
        />

        {imageSrc && (
          <>
            <div className="relative w-full h-64 bg-black rounded-xl overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}               // 🔥 obligatoire
                onCropChange={setCrop}    // 🔥 obligatoire
                cropShape="rect"
                aspect={3 / 1}
                zoom={zoom}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedPixels) =>
                  setCroppedAreaPixels(croppedPixels)
                }
              />
            </div>

            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />

            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full px-5 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:bg-gray-900 dark:hover:bg-gray-200 transition disabled:opacity-40"
            >
              {loading ? "Envoi…" : "Appliquer le recadrage & envoyer"}
            </button>
          </>
        )}

        <button
          onClick={handleDelete}
          disabled={loading}
          className="w-full px-5 py-3 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition"
        >
          Supprimer la bannière
        </button>
      </div>
    </div>
  );
}
