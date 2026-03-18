import z from "zod";

export const volunteerSchema = z.object({
  userName: z.string().min(3).max(50),
  phone: z.string().min(10).max(10),
  address: z.string(),
})