import { z } from "zod";

export const hospitalSchema = z.object({
  idn: z.string().optional(),
  hospitalName: z
    .string()
    .min(2, "Hospital name must be at least 2 characters"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  gpo: z.string().optional(),
  userId: z.string(),
  teamHospital: z.boolean().nullable().optional(),
  magnetHospital: z.boolean().nullable().optional(),
  ICUBeds: z.number().min(0, "ICU Beds must be 0 or more"),
  totalBeds: z.number().min(0, "Total Beds must be 0 or more").optional(),
});

export type HospitalFormValues = z.infer<typeof hospitalSchema>;
