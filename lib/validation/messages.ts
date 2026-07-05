// lib/validation/messages.ts
import { z } from "zod";

export const messageCreateSchema = z.object({
  conversationId: z.string().min(1, "Conversation manquante"),
  text: z.string().optional(),
  image: z.string().optional(),
}).refine(
  (data) => data.text || data.image,
  { message: "Un message doit contenir du texte ou une image" }
);
