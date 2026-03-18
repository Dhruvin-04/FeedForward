import { Id } from "@/convex/_generated/dataModel";
import z from "zod";

export const ngoSchema = z.object({
  organizationName: z.string(),
  address: z.string(),
  phone: z.string().min(10).max(10),
  registrationId: z.string().min(15).max(15),
})