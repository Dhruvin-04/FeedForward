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
            
            const foodListings = await ctx.db.query('foodlistings').collect()
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

// NGO accepts food - creates a pickup record
export const ngoAcceptFood = mutation({
    args: {
        foodListingId: v.string(),
        donorId: v.string(),
        contactPerson: v.string(),
        phone: v.string(),
        organizationName: v.string(),
        pickupNotes: v.optional(v.string()),
        volunteerType: v.string(), // "ngo" | "platform"
        volunteerName: v.optional(v.string()),
        volunteerPhone: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await authComponent.safeGetAuthUser(ctx)
        if (!user) {
            throw new ConvexError('Unauthorized')
        }

        const foodListing = await ctx.db.get(args.foodListingId as Id<"foodlistings">)
        if (!foodListing) {
            throw new ConvexError('Food listing not found')
        }
        if (foodListing.status !== 'available') {
            throw new ConvexError('This food listing is no longer available')
        }

        const isNgoVolunteer = args.volunteerType === 'ngo'
        const status = isNgoVolunteer ? 'assigned' : 'pending'
        const pickupCode = generatePickupCode()

        // Update food listing status
        await ctx.db.patch(args.foodListingId as Id<"foodlistings">, {
            status: status === 'assigned' ? 'reserved' : 'claimed',
        })

        const pickup = await ctx.db.insert('pickups', {
            foodListingId: args.foodListingId,
            donorId: args.donorId,
            ngoId: user._id,
            ngoName: args.organizationName,
            ngoPhone: args.phone,
            ngoContactPerson: args.contactPerson,
            ngoNotes: args.pickupNotes,
            volunteerType: args.volunteerType,
            volunteerId: isNgoVolunteer ? 'ngo-volunteer' : undefined,
            volunteerName: isNgoVolunteer ? args.volunteerName : undefined,
            volunteerPhone: isNgoVolunteer ? args.volunteerPhone : undefined,
            pickupCode,
            status,
            createdAt: new Date().toISOString(),
            assignedAt: isNgoVolunteer ? new Date().toISOString() : undefined,
        })

        return {
            _id: pickup,
            pickupCode,
            status,
        }
    }
})

// Get all pickups for an NGO
export const getNgoPickups = query({
    args: {},
    handler: async (ctx) => {
        const user = await authComponent.safeGetAuthUser(ctx)
        if (!user) {
            throw new ConvexError('Unauthorized')
        }

        const pickups = await ctx.db.query('pickups').collect()
        const ngoPickups = pickups.filter((p) => p.ngoId === user._id)

        // Enrich with food listing details
        const enriched = await Promise.all(
            ngoPickups.map(async (pickup) => {
                const foodListing = await ctx.db.get(pickup.foodListingId as Id<"foodlistings">)
                return {
                    ...pickup,
                    foodName: foodListing?.foodName ?? 'Unknown',
                    businessName: foodListing?.businessName ?? 'Unknown',
                    donorName: foodListing?.donorName ?? 'Unknown',
                    quantity: foodListing?.quantity,
                    category: foodListing?.category ?? '',
                    pickupLocation: foodListing?.location ?? '',
                    pickupWindow: foodListing?.pickupWindow,
                }
            })
        )

        return enriched
    }
})

// Platform volunteer accepts a pending pickup
export const volunteerAcceptPickup = mutation({
    args: {
        pickupId: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await authComponent.safeGetAuthUser(ctx)
        if (!user) {
            throw new ConvexError('Unauthorized')
        }

        const pickup = await ctx.db.get(args.pickupId as Id<"pickups">)
        if (!pickup) {
            throw new ConvexError('Pickup not found')
        }
        if (pickup.status !== 'pending') {
            throw new ConvexError('This pickup is no longer available')
        }

        // Get volunteer profile for phone
        const volunteerProfiles = await ctx.db.query('volunteerProfile').collect()
        const vProfile = volunteerProfiles.find(vp => vp.userId === user._id)

        await ctx.db.patch(args.pickupId as Id<"pickups">, {
            volunteerId: user._id,
            volunteerName: user.name || user.email,
            volunteerPhone: vProfile?.phone,
            status: 'assigned',
            assignedAt: new Date().toISOString(),
        })

        // Also update food listing
        const foodListing = await ctx.db.get(pickup.foodListingId as Id<"foodlistings">)
        if (foodListing) {
            await ctx.db.patch(pickup.foodListingId as Id<"foodlistings">, {
                status: 'reserved',
            })
        }

        return { success: true }
    }
})

// Get pending pickups for platform volunteers
export const getPendingPickups = query({
    args: {},
    handler: async (ctx) => {
        const pickups = await ctx.db.query('pickups').collect()
        const pending = pickups.filter((p) => p.status === 'pending' && p.volunteerType === 'platform')

        const enriched = await Promise.all(
            pending.map(async (pickup) => {
                const foodListing = await ctx.db.get(pickup.foodListingId as Id<"foodlistings">)
                return {
                    ...pickup,
                    foodName: foodListing?.foodName ?? 'Unknown',
                    businessName: foodListing?.businessName ?? 'Unknown',
                    donorName: foodListing?.donorName ?? 'Unknown',
                    quantity: foodListing?.quantity,
                    category: foodListing?.category ?? '',
                    pickupLocation: foodListing?.location ?? '',
                    pickupWindow: foodListing?.pickupWindow,
                }
            })
        )

        return enriched
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

        const foodListing = await ctx.db.get(args.foodListingId as Id<"foodlistings">)
        if (!foodListing) {
            throw new ConvexError('Food listing not found')
        }
        if (foodListing.status !== 'available') {
            throw new ConvexError('This food listing is no longer available')
        }

        const pickup = await ctx.db.insert('pickups', {
            foodListingId: args.foodListingId,
            donorId: args.donorId,
            ngoId: '',
            ngoName: '',
            ngoPhone: '',
            ngoContactPerson: '',
            volunteerType: 'platform',
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
    }
})

export const getVolunteerPickups = query({
    args: {},
    handler: async (ctx) => {
        const user = await authComponent.safeGetAuthUser(ctx)
        if (!user) {
            throw new ConvexError('Unauthorized')
        }

        const pickups = await ctx.db.query('pickups').collect()
        const volunteerPickups = pickups.filter((pickup) => pickup.volunteerId === user._id)
        
        return volunteerPickups
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

        const pickup = await ctx.db.get(args.pickupId as Id<"pickups">)
        if (!pickup) {
            throw new ConvexError('Pickup not found')
        }

        const pickupCode = generatePickupCode()

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
    }
})

export const updatePickupStatus = mutation({
    args: {
        pickupId: v.string(),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const pickup = await ctx.db.get(args.pickupId as Id<"pickups">)
        if (!pickup) {
            throw new ConvexError('Pickup not found')
        }

        await ctx.db.patch(args.pickupId as Id<"pickups">, {
            status: args.status,
            ...(args.status === 'picked_up' && { pickedAt: new Date().toISOString() }),
            ...(args.status === 'delivered' && { deliveredAt: new Date().toISOString() }),
        })

        // Update food listing status on delivery
        if (args.status === 'delivered') {
            const foodListing = await ctx.db.get(pickup.foodListingId as Id<"foodlistings">)
            if (foodListing) {
                await ctx.db.patch(pickup.foodListingId as Id<"foodlistings">, {
                    status: 'delivered',
                })
            }
        }

        return { success: true }
    }
})

export const getPickupByCode = query({
    args: {
        pickupCode: v.string(),
    },
    handler: async (ctx, args) => {
        const pickups = await ctx.db.query('pickups').collect()
        const pickup = pickups.find((p) => p.pickupCode === args.pickupCode)
        
        if (!pickup) {
            throw new ConvexError('Pickup code not found')
        }

        return pickup
    }
})
