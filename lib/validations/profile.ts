
import { z } from "zod"

export const profileSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
})

export type ProfileInput = z.infer<typeof profileSchema>
