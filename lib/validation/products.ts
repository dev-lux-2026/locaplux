// lib/validation/products.ts
import { z } from "zod";

export const damageTypeEnum = z.enum([
  "no_damage",
  "exhibition_damage",
  "transport_damage",
  "stock_damage",
  "missing_part",
  "packaging_damage",
  "other",
]);

export const productCreateSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),

  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .optional()
    .or(z.literal("")),

  // --- Prix ---
  prix_normal: z
    .number()
    .int()
    .positive("Le prix normal doit être supérieur à 0"),

  prix_locaplux: z
    .number()
    .int()
    .positive("Le prix Locaplux doit être supérieur à 0"),

  prix_achat: z
    .number()
    .int()
    .positive("Le prix d'achat doit être supérieur à 0")
    .optional()
    .nullable(),

  // --- Stock ---
  stock: z.number().int().min(0, "Le stock ne peut pas être négatif"),

  // --- Images ---
  images: z
    .array(z.string().url("URL d'image invalide"))
    .min(1, "Au moins une image est requise"),

  // --- Dommages ---
  damage_type: damageTypeEnum,

  // ⭐ CORRECTION CRITIQUE : accepte null, string vide, string
  damage_description: z
    .string()
    .max(500, "La description du dommage est trop longue")
    .nullable()
    .optional(),

  // --- Catégorie (auto ou manuelle)
  categoryId: z.string().optional().nullable(),

  // --- Auto-category IA
  autoCategoryIdFromImage: z.string().uuid().nullable().optional(),

  // ⭐ NEW — Tags Cloudinary pour IA image
  imageTags: z.array(z.string()).optional(),
});

// Pour mise à jour partielle
export const productUpdateSchema = z.object({
  productId: z.string().min(1),

  name: z.string().min(3).optional(),
  description: z.string().min(10).optional(),

  prix_normal: z.number().int().positive().optional(),
  prix_locaplux: z.number().int().positive().optional(),
  prix_achat: z.number().int().positive().optional().nullable(),

  stock: z.number().int().min(0).optional(),

  images: z.array(z.string().url()).min(1).optional(),

  damage_type: damageTypeEnum.optional(),

  // ⭐ Harmonisation avec createSchema
  damage_description: z
    .string()
    .max(500)
    .nullable()
    .optional(),

  categoryId: z.string().optional().nullable(),
  autoCategoryIdFromImage: z.string().uuid().nullable().optional(),

  // ⭐ NEW — Tags Cloudinary pour IA image
  imageTags: z.array(z.string()).optional(),
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
