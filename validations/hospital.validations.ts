import { z } from "zod";

export const hospitalSchema = z
  .object({
    idn: z.string().min(1, "IDN is required"),
    hospitalName: z
      .string()
      .min(2, "Hospital name must be at least 2 characters"),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    gpo: z.string().optional(),
    primaryRep: z.string().optional(),
    secondaryRep: z.string().optional(),
    teamHospital: z.boolean().nullable().optional(),
    magnetHospital: z.boolean().nullable().optional(),
    ICUBeds: z.number().min(0, "ICU Beds must be 0 or more"),
    totalBeds: z.number().min(0, "Total Beds must be 0 or more").optional(),
  })
  .refine(
    (data) => {
      if (
        data.primaryRep &&
        data.secondaryRep &&
        data.primaryRep !== "__none__" &&
        data.secondaryRep !== "__none__"
      ) {
        return data.primaryRep !== data.secondaryRep;
      }
      return true;
    },
    {
      message: "Primary representative and Secondary representative cannot be the same user",
      path: ["secondaryRep"],
    }
  );

export type HospitalFormValues = z.infer<typeof hospitalSchema>;
