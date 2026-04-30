import { z } from "zod";

export const composeEmailSchema = z.object({
  toEmail: z
    .email("Invalid email address")
    .min(1, "Recipient email is required"),
  subject: z.string().min(1, "Subject is required"),
  content: z
    .string()
    .min(1, "Email content is required")
    .refine(
      (val) => val !== "<p><br></p>" && val.trim() !== "",
      "Email content cannot be empty",
    ),
  ccEmails: z.string(),
  bccEmails: z.string(),
});

export type ComposeEmailFormValues = z.infer<typeof composeEmailSchema>;
