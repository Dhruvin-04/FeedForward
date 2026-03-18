import { Id } from "@/convex/_generated/dataModel";
import z from "zod";

export const donorSchema = z.object({
  businessName: z.string(),
  address: z.string(),
  phone: z.string().min(10).max(10),
  fssaiNumber: z.string().min(14).max(14),
  rating: z.number(),
})