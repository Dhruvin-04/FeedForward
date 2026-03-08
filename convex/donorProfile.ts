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

        // Get email from the users table
        const users = await ctx.db.query('users').collect()
        const userRecord = users.find(u => u.userId === user._id)

        // Count donations and meals
        const foodListings = await ctx.db.query('foodlistings').collect()
        const donorListings = foodListings.filter(f => f.donorId === user._id)
        const totalDonations = donorListings.length
        const totalMealsDonated = donorListings
            .filter(f => f.status === 'delivered')
            .reduce((sum, f) => sum + (f.quantity || 0), 0)

        if (!userDonorProfile) return null

        return {
            ...userDonorProfile,
            email: userRecord?.email ?? '',
            totalDonations,
            totalMealsDonated,
        }
    }
})

export const updateDonorProfile = mutation({
    args: {
        businessName: v.string(),
        address: v.string(),
        phone: v.string(),
        fssaiNumber: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await authComponent.safeGetAuthUser(ctx)
        if (!user) {
            throw new ConvexError("User is not authenticated")
        }

        const donorProfiles = await ctx.db.query('donorProfile').collect()
        const profile = donorProfiles.find(d => d.userId === user._id)
        if (!profile) {
            throw new ConvexError("Donor profile not found")
        }

        await ctx.db.patch(profile._id, {
            businessName: args.businessName,
            address: args.address,
            phone: args.phone,
            fssaiNumber: args.fssaiNumber,
        })

        return { success: true }
    }
})
