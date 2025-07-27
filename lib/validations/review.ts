import { z } from "zod"

export const createReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  userId: z.string(), 
})

export const updateReviewSchema = z.object({
  response: z.string().optional(),
  isVisible: z.boolean().optional(),
})
