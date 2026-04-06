import { z } from "zod";

export const createContactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  designation: z.string().min(2, "Designation must be at least 2 characters"),
  hospital: z.string().min(1, "Please select a hospital"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.email("Please enter a valid email address"),
  isPrimary: z.boolean(),
});

export type CreateContactValues = z.infer<typeof createContactSchema>;
