import { supabase } from "./supabase";

/**
 * Upload un fichier dans Supabase Storage
 * @param file Fichier envoyé depuis un <input type="file">
 * @param path Chemin dans le bucket (ex: "avatars/123", "banners/123")
 * @returns URL publique du fichier
 */
export async function uploadToSupabase(file: File, path: string) {
  const ext = file.name.split(".").pop();
  const fileName = `${path}.${ext}`;

  const { error } = await supabase.storage
    .from("public") // ton bucket
    .upload(fileName, file, {
      upsert: true, // remplace automatiquement l’ancienne image
    });

  if (error) {
    console.error("Upload error:", error);
    throw error;
  }

  // Génère l’URL publique
  const { data: publicUrl } = supabase.storage
    .from("public")
    .getPublicUrl(fileName);

  return publicUrl.publicUrl;
}

/**
 * Supprime un fichier dans Supabase Storage
 * @param path Chemin complet du fichier (ex: "banners/123.png")
 */
export async function deleteFromSupabase(path: string) {
  const { error } = await supabase.storage
    .from("public")
    .remove([path]);

  if (error) {
    console.error("Delete error:", error);
    throw error;
  }

  return true;
}
