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

const optionalText = (max = 500) =>
  z.string().max(max).nullable().optional().or(z.literal(""));

export const productCreateSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),

  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .optional()
    .or(z.literal("")),

  prix_normal: z.number().int().positive("Le prix normal doit être supérieur à 0"),
  prix_locaplux: z.number().int().positive("Le prix Locaplux doit être supérieur à 0"),
  prix_achat: z.number().int().positive("Le prix d'achat doit être supérieur à 0").optional().nullable(),

  stock: z.number().int().min(0, "Le stock ne peut pas être négatif"),

  images: z.array(z.string().url("URL d'image invalide")).min(1, "Au moins une image est requise"),

  condition: optionalText(100),
  reason: optionalText(500),
  reference: optionalText(120),
  dimensions: optionalText(200),
  materials: optionalText(250),
  brand: optionalText(150),

  damage_type: damageTypeEnum,
  damage_description: z.string().max(500, "La description du dommage est trop longue").nullable().optional(),

  categoryId: z.string().optional().nullable(),

  autoCategoryIdFromImage: z.string().uuid().nullable().optional(),

  imageTags: z.array(z.string()).optional(),

  pickup_available: z.boolean().optional(),
  delivery_available: z.boolean().optional(),

  boostEnabled: z.boolean().optional(),
  boostMode: z.enum(["credit", "paid"]).optional(),
  boostDuration: z.number().int().positive().max(90).optional(),
});

export const productUpdateSchema = z.object({
  productId: z.string().min(1),

  name: z.string().min(3).optional(),
  description: z.string().min(10).optional(),

  prix_normal: z.number().int().positive().optional(),
  prix_locaplux: z.number().int().positive().optional(),
  prix_achat: z.number().int().positive().optional().nullable(),

  stock: z.number().int().min(0).optional(),

  images: z.array(z.string().url()).min(1).optional(),

  condition: optionalText(100),
  reason: optionalText(500),
  reference: optionalText(120),
  dimensions: optionalText(200),
  materials: optionalText(250),
  brand: optionalText(150),

  damage_type: damageTypeEnum.optional(),
  damage_description: z.string().max(500).nullable().optional(),

  categoryId: z.string().optional().nullable(),
  autoCategoryIdFromImage: z.string().uuid().nullable().optional(),

  imageTags: z.array(z.string()).optional(),

  pickup_available: z.boolean().optional(),
  delivery_available: z.boolean().optional(),
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;