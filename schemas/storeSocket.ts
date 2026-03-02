import z from "zod";

export const socketSchema = z.object({
    userId: z.string(), 
    socketId: z.string(),
    location: z.object({
        type: z.string(), // "Point"
        coordinates: z.array(z.number()) // [longitude, latitude]
    })
})