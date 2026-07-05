// lib/vision/getImageTags.ts
import { analyzeImage } from "./analyzeImage";

export async function getImageTags(imageUrl: string): Promise<string[]> {
  if (!imageUrl) return [];
  return await analyzeImage(imageUrl);
}
