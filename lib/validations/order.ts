import { z } from "zod"

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      dishId: z.string(),
      quantity: z.number().min(1),
      notes: z.string().optional(),
    }),
  ),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(["CASH", "CARD", "PAYPAL", "STRIPE", "BANK_TRANSFER"]).optional(),
})

export const updateOrderSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PREPARING", "READY", "DELIVERED", "CANCELLED"]).optional(),
})
