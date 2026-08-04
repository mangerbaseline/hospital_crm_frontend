import { z } from "zod";

export const createContactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().optional(),
  designation: z.string().optional(),
  hospitals: z.array(z.string()).min(1, "Please select at least one hospital"),
  phoneNumber: z.string().optional(),
  secondaryPhoneNumber: z.string().optional(),
  email: z.email("Please enter a valid email address"),
  isPrimary: z.boolean(),
  product: z.array(z.string()).optional(),
});

export type CreateContactValues = z.infer<typeof createContactSchema>;

export const updateContactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().optional(),
  designation: z.string().optional(),
  hospitals: z.array(z.string()).optional(),
  phoneNumber: z.string().optional(),
  secondaryPhoneNumber: z.string().optional(),
  email: z.email("Please enter a valid email address"),
  isPrimary: z.boolean(),
});

export type UpdateContactValues = z.infer<typeof updateContactSchema>;
