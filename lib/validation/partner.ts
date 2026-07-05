// lib/validation/partner.ts
import { z } from "zod";

export const partnerApplicationUpdateSchema = z.object({
  applicationId: z.string().min(1),
  action: z.enum(["approve", "reject"]),
});
