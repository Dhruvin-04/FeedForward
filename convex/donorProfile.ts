import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const fillDonorInfo = mutation({

    args: { address: v.string(), businessName: v.string(), fssaiNumber: v.string(), rating: v.number(), phone: v.string()},
    handler: async (ctx, args) => {
        const user = await authComponent.safeGetAuthUser(ctx)
        if (!user) {
            throw new ConvexError("User is not authenticated")
        }
        const donor = await ctx.db.insert('donorProfile', {
            userId: user._id,
            address: args.address,
            phone: args.phone,
            businessName: args.businessName,
            fssaiNumber: args.fssaiNumber,
            rating: args.rating,
        })
        return donor
    }
})

export const getDonorProfile = query({
    args: {},
    handler: async (ctx) => {
        const user = await authComponent.safeGetAuthUser(ctx)
        if (!user) {
            throw new ConvexError("User is not authenticated")
        }

        const donorProfile = await ctx.db.query('donorProfile').collect()
        const userDonorProfile = donorProfile.find(donor => donor.userId === user._id)
        return userDonorProfile || null
    }
})
