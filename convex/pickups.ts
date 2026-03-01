import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { Id } from "./_generated/dataModel";

// Generate a random 6-character alphanumeric code
function generatePickupCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
}

export const getAvailableFoodListings = query({
    args: {},
    handler: async (ctx) => {
        try {
            const user = await authComponent.safeGetAuthUser(ctx)
            
            // Get all available food listings
            const foodListings = await ctx.db.query('foodlistings').collect()
            
            // Filter only available items
            const availableListings = foodListings.filter(
                (listing) => listing.status === 'available'
            )
            
            return availableListings
        } catch (error) {
            console.error('Error fetching available food listings:', error)
            throw new ConvexError('Failed to fetch food listings')
        }
    }
})

export const acceptPickup = mutation({
    args: {
        foodListingId: v.string(),
        donorId: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await authComponent.safeGetAuthUser(ctx)
        if (!user) {
            throw new ConvexError('Unauthorized')
        }

        try {
            // Get the food listing
            const foodListing = await ctx.db.get(args.foodListingId as Id<"foodlistings">)
            if (!foodListing) {
                throw new ConvexError('Food listing not found')
            }

            // Check if listing is still available
            if (!('status' in foodListing) || foodListing.status !== 'available') {
                throw new ConvexError('This food listing is no longer available')
            }

            // Create pickup record - storing with status 'pending'
            const pickup = await ctx.db.insert('pickups', {
                foodListingId: args.foodListingId,
                donorId: args.donorId,
                volunteerId: user._id,
                volunteerName: user.name || user.email,
                status: 'pending',
                createdAt: new Date().toISOString(),
            })

            return {
                _id: pickup,
                id: pickup,
                foodListingId: args.foodListingId,
                volunteerId: user._id,
                volunteerName: user.name || user.email,
                status: 'pending',
                createdAt: new Date().toISOString(),
            }
        } catch (error) {
            console.error('Error accepting pickup:', error)
            if (error instanceof ConvexError) {
                throw error
            }
            throw new ConvexError('Failed to accept pickup')
        }
    }
})

export const getVolunteerPickups = query({
    args: {},
    handler: async (ctx) => {
        const user = await authComponent.safeGetAuthUser(ctx)
        if (!user) {
            throw new ConvexError('Unauthorized')
        }

        try {
            // Get all pickups for this volunteer
            const pickups = await ctx.db.query('pickups').collect()
            const volunteerPickups = pickups.filter((pickup) => pickup.volunteerId === user._id)
            
            return volunteerPickups
        } catch (error) {
            console.error('Error fetching volunteer pickups:', error)
            throw new ConvexError('Failed to fetch pickups')
        }
    }
})

export const assignPickupCode = mutation({
    args: {
        pickupId: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await authComponent.safeGetAuthUser(ctx)
        if (!user) {
            throw new ConvexError('Unauthorized')
        }

        try {
            // Get the pickup
            const pickup = await ctx.db.get(args.pickupId as Id<"pickups">)
            if (!pickup) {
                throw new ConvexError('Pickup not found')
            }

            // Generate pickup code
            const pickupCode = generatePickupCode()

            // Update pickup with code and assign status
            await ctx.db.patch(args.pickupId as Id<"pickups">, {
                pickupCode: pickupCode,
                status: 'assigned',
                assignedAt: new Date().toISOString(),
            })

            return {
                pickupId: args.pickupId,
                pickupCode: pickupCode,
                status: 'assigned',
                assignedAt: new Date().toISOString(),
            }
        } catch (error) {
            console.error('Error assigning pickup code:', error)
            if (error instanceof ConvexError) {
                throw error
            }
            throw new ConvexError('Failed to assign pickup code')
        }
    }
})

export const updatePickupStatus = mutation({
    args: {
        pickupId: v.string(),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            const pickup = await ctx.db.get(args.pickupId as Id<"pickups">)
            if (!pickup) {
                throw new ConvexError('Pickup not found')
            }

            await ctx.db.patch(args.pickupId as Id<"pickups">, {
                status: args.status,
                ...(args.status === 'picked' && { pickedAt: new Date().toISOString() }),
                ...(args.status === 'delivered' && { deliveredAt: new Date().toISOString() }),
            })

            return { success: true }
        } catch (error) {
            console.error('Error updating pickup status:', error)
            if (error instanceof ConvexError) {
                throw error
            }
            throw new ConvexError('Failed to update pickup status')
        }
    }
})

export const getPickupByCode = query({
    args: {
        pickupCode: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            const pickups = await ctx.db.query('pickups').collect()
            const pickup = pickups.find((p) => p.pickupCode === args.pickupCode)
            
            if (!pickup) {
                throw new ConvexError('Pickup code not found')
            }

            return pickup
        } catch (error) {
            console.error('Error fetching pickup by code:', error)
            throw new ConvexError('Failed to fetch pickup')
        }
    }
})
