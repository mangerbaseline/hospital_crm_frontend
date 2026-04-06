import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(1, { message: "Description is required" }),
  Marketprice: z
    .number({ message: "Market price is required" })
    .positive({ message: "Market price must be a positive number" })
    .min(0.01, { message: "Market price must be at least 0.01" }),
});

export type ProductFormValues = z.infer<typeof productSchema>;
