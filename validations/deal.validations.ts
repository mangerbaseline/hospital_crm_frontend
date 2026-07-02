import { z } from "zod";
import { DealProductStage } from "@/store/types";

export const dealProductSchema = z.object({
  product: z.string().min(1, "Product is required"),
  beds: z.number().min(0),
  dealAmount: z.number().min(0, "Amount must be 0 or more").optional(),
  stage: z.enum(DealProductStage),
  expectedCloseDate: z.union([z.date(), z.string()]).optional(),
  leadSource: z.string().optional(),
  leadSourceDetails: z.string().optional(),
});

export const dealSchema = z.object({
  hospital: z.string().min(1, "Hospital is required"),
  idn: z.string().min(1, "IDN is required"),
  gpo: z.string().min(1, "GPO is required"),
  contact: z.string().optional(),
  products: z
    .array(dealProductSchema)
    .min(1, "At least one product must be selected"),
  notes: z.string().optional(),
  userId: z.string().optional(),
});

export type DealFormValues = z.infer<typeof dealSchema>;
export type DealProductFormValues = z.infer<typeof dealProductSchema>;
