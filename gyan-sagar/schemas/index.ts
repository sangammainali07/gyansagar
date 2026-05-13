import * as z from "zod";
export const RegisterSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(6, { message: "Minimum 6 characters required" }),
  name: z.string().min(1, { message: "Name is required" }),
  role: z.enum(["STUDENT", "TEACHER"]),
});

export const ResetSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, {
    message: "Current password is required",
  }),
  newPassword: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
  confirmPassword: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
