import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const fillVolunteerInfo = mutation({
    args: {userName: v.string(), phone: v.string(), address: v.string() },
    handler: async (ctx, args) => {
        const user = await authComponent.safeGetAuthUser(ctx)
        if (!user) {
            throw new ConvexError('Unauthorized Details')
        }
        const volunteer = await ctx.db.insert('volunteerProfile', {
            userName: args.userName,
            userId: user._id,
            address: args.address,
            phone: args.phone,
        })
        return volunteer
    }
})

export const updateVolunteerProfile = mutation({
    args: { userName: v.string(), phone: v.string(), address: v.string() },
    handler: async (ctx, args) => {
        const user = await authComponent.safeGetAuthUser(ctx)
        if (!user) {
            throw new ConvexError('Unauthorized')
        }

        try {
            // Check if volunteer profile exists
            const volunteerProfiles = await ctx.db.query('volunteerProfile').collect()
            const existingProfile = volunteerProfiles.find((profile) => profile.userId === user._id)

            if (existingProfile) {
                // Update existing profile
                await ctx.db.patch(existingProfile._id, {
                    userName: args.userName,
                    phone: args.phone,
                    address: args.address,
                })
                return { success: true, action: 'updated' }
            } else {
                // Create new profile
                await ctx.db.insert('volunteerProfile', {
                    userId: user._id,
                    userName: args.userName,
                    phone: args.phone,
                    address: args.address,
                })
                return { success: true, action: 'created' }
            }
        } catch (error) {
            console.error('Error updating volunteer profile:', error)
            throw new ConvexError('Failed to update volunteer profile')
        }
    }
})

export const getVolunteerProfile = query({
    args: {},
    handler: async (ctx) => {
        const user = await authComponent.safeGetAuthUser(ctx)
        if (!user) {
            throw new ConvexError("User is not authenticated")
        }

        const volunteerProfile = await ctx.db.query('volunteerProfile').collect()
        const userVolunteerProfile = volunteerProfile.find(vp => vp.userId === user._id)
        return userVolunteerProfile || null
    }
})