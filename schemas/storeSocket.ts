import z from "zod";

export const socketSchema = z.object({
    userId: z.string(), 
    socketId: z.string(),
})