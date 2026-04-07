import { z } from "zod";

export const gpoSchema = z.object({
  name: z.string().min(2, "GPO name must be at least 2 characters"),
});

export type GPOFormValues = z.infer<typeof gpoSchema>;
