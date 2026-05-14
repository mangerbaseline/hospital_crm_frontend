import { z } from "zod";

export const hospitalSchema = z.object({
  idn: z.string().min(1, "IDN is required"),
  hospitalName: z
    .string()
    .min(2, "Hospital name must be at least 2 characters"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip code is required"),
  gpo: z.string().min(1, "GPO is required"),
  // competitiveProduct: z.string(),
  // teamHospital: z.boolean(),
  // magnetHospital: z.boolean(),
  // bedsWithMac: z.number().min(0, "Must be 0 or more"),
  // ICUBeds: z.number().min(0, "Must be 0 or more"),
});

export type HospitalFormValues = z.infer<typeof hospitalSchema>;
