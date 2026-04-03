import { UserRole } from "@/store/types";
import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: "Password must be at least 8 characters long",
    })
    .refine(
      (val) =>
        !val || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/.test(val),
      {
        message:
          "Password must include at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&#)",
      },
    ),
  role: z.enum(UserRole),
});
