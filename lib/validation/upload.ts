// lib/validation/upload.ts
import { z } from "zod";

export const productImageUploadSchema = z.object({
  // Si un jour tu ajoutes des champs textuels dans ton FormData :
  // exampleField: z.string().optional(),
});
