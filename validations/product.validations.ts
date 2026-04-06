import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(1, { message: "Description is required" }),
});

export type ProductFormValues = z.infer<typeof productSchema>;
