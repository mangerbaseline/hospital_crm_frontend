import { z } from "zod";

export const createContactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  designation: z.string().optional(),
  hospital: z.string().min(1, "Please select a hospital"),
  phoneNumber: z.string().optional(),
  secondaryPhoneNumber: z.string().optional(),
  email: z.email("Please enter a valid email address"),
  isPrimary: z.boolean(),
  product: z.array(z.string()).optional(),
});

export type CreateContactValues = z.infer<typeof createContactSchema>;

export const updateContactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  designation: z.string().optional(),
  hospital: z.string().optional(),
  phoneNumber: z.string().optional(),
  secondaryPhoneNumber: z.string().optional(),
  email: z.email("Please enter a valid email address"),
  isPrimary: z.boolean(),
});

export type UpdateContactValues = z.infer<typeof updateContactSchema>;
