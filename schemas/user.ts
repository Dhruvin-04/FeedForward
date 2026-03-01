import z from "zod";

export const userSchema = z.object({
    email: z.string(),
    role: z.string(),
    userId: z.string(),
})