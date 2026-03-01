import z from "zod";

export const login = z.object({
    email: z.email(),
    password: z.string()
})

export const signUp = z.object({
    name: z.string().min(3).max(20),
    email: z.email(),
    role: z.string(),
    password: z.string().min(8).max(32),
})