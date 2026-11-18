"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";

export default function CaptureSuccessPage() {
  const searchParams = useSearchParams();
  const session = searchParams.get("session");
  const router = useRouter();
  const params = useParams();
  
  // Récupère la locale courante (ex: "fr", "en", etc.) depuis l'URL
  const locale = params?.locale as string || "fr";

  function handleNewPhoto() {
    if (!session) return;
    router.push(`/partner/products/capture?session=${session}`);
  }

  function handleReturnPC() {
    router.push(`/${locale}/product/new`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Photo envoyée 📸
        </h1>

        <p className="text-gray-600 mb-6">
          Votre photo a bien été transférée sur votre ordinateur.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleNewPhoto}
            className="w-full py-3 bg-black text-white rounded-lg font-medium"
          >
            Prendre une autre photo
          </button>

          <button
            onClick={handleReturnPC}
            className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg font-medium"
          >
            Retourner sur l’ordinateur
          </button>
        </div>
      </div>
    </div>
  );
}