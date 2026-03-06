import z from "zod";

export const foodListingSchema = z.object({
    foodName: z.string().min(2).max(100),
    category: z.enum(['veg', 'non-veg']),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1").optional(),
    cookedTime: z.string(),
    expiryTime: z.string(),
    pickupWindow: z.object({
        openingTime: z.string(),
        closingTime: z.string()
    }),
    location: z.string().min(2).max(200),
    notes: z.string().max(500).optional(),
    status: z.enum(['available', 'claimed', 'reserved', 'picked_up', 'delivered']).default('available'),
})