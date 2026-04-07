import { z } from "zod";

export const idnSchema = z.object({
  name: z.string().min(2, "IDN name must be at least 2 characters"),
});

export type IDNFormValues = z.infer<typeof idnSchema>;
