import { z } from "zod"

export const registerSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
})

export const updateProfileSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères").optional(),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
})
