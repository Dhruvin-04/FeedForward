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

// ─── Volunteer Workflow Queries & Mutations ───────────────────────────

// Get enriched volunteer assignments (active + completed) with food & donor details
export const getVolunteerAssignments = query({
    args: {},
    handler: async (ctx) => {
        const user = await authComponent.safeGetAuthUser(ctx)
        if (!user) {
            throw new ConvexError('Unauthorized')
        }

        const pickups = await ctx.db.query('pickups').collect()
        const myPickups = pickups.filter((p) => p.volunteerId === user._id)

        const enriched = await Promise.all(
            myPickups.map(async (pickup) => {
                const foodListing = await ctx.db.get(pickup.foodListingId as Id<"foodlistings">)
                // Get donor profile for address
                const donorProfiles = await ctx.db.query('donorProfile').collect()
                const donorProfile = donorProfiles.find(dp => dp.userId === pickup.donorId)
                // Get ngo profile for address
                const ngoProfiles = await ctx.db.query('ngoProfile').collect()
                const ngoProfile = ngoProfiles.find(np => np.userId === pickup.ngoId)

                return {
                    ...pickup,
                    foodName: foodListing?.foodName ?? 'Unknown',
                    businessName: foodListing?.businessName ?? 'Unknown',
                    donorName: foodListing?.donorName ?? 'Unknown',
                    quantity: foodListing?.quantity,
                    category: foodListing?.category ?? '',
                    pickupLocation: foodListing?.location ?? '',
                    pickupWindow: foodListing?.pickupWindow,
                    expiryTime: foodListing?.expiryTime,
                    notes: foodListing?.notes,
                    donorPhone: donorProfile?.phone ?? '',
                    donorAddress: donorProfile?.address ?? foodListing?.location ?? '',
                    ngoAddress: ngoProfile?.address ?? '',
                }
            })
        )

        return enriched
    }
})

// Get a single pickup's full details by ID
export const getPickupDetails = query({
    args: { pickupId: v.string() },
    handler: async (ctx, args) => {
        const user = await authComponent.safeGetAuthUser(ctx)
        if (!user) {
            throw new ConvexError('Unauthorized')
        }

        const pickup = await ctx.db.get(args.pickupId as Id<"pickups">)
        if (!pickup) {
            throw new ConvexError('Pickup not found')
        }

        const foodListing = await ctx.db.get(pickup.foodListingId as Id<"foodlistings">)
        const donorProfiles = await ctx.db.query('donorProfile').collect()
        const donorProfile = donorProfiles.find(dp => dp.userId === pickup.donorId)
        const ngoProfiles = await ctx.db.query('ngoProfile').collect()
        const ngoProfile = ngoProfiles.find(np => np.userId === pickup.ngoId)

        return {
            ...pickup,
            foodName: foodListing?.foodName ?? 'Unknown',
            businessName: foodListing?.businessName ?? 'Unknown',
            donorName: foodListing?.donorName ?? 'Unknown',
            quantity: foodListing?.quantity,
            category: foodListing?.category ?? '',
            pickupLocation: foodListing?.location ?? '',
            pickupWindow: foodListing?.pickupWindow,
            expiryTime: foodListing?.expiryTime,
            notes: foodListing?.notes,
            donorPhone: donorProfile?.phone ?? '',
            donorAddress: donorProfile?.address ?? foodListing?.location ?? '',
            ngoAddress: ngoProfile?.address ?? '',
        }
    }
})

// Volunteer accepts a pending pickup (assigns themselves)
export const assignVolunteerToFood = mutation({
    args: {
        pickupId: v.string(),
        volunteerName: v.string(),
        volunteerPhone: v.string(),
        vehicleType: v.optional(v.string()),
        notes: v.optional(v.string()),
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

        await ctx.db.patch(args.pickupId as Id<"pickups">, {
            volunteerId: user._id,
            volunteerName: args.volunteerName,
            volunteerPhone: args.volunteerPhone,
            status: 'assigned',
            assignedAt: new Date().toISOString(),
        })

        // Update food listing status
        const foodListing = await ctx.db.get(pickup.foodListingId as Id<"foodlistings">)
        if (foodListing) {
            await ctx.db.patch(pickup.foodListingId as Id<"foodlistings">, {
                status: 'reserved',
            })
        }

        return {
            success: true,
            pickupCode: pickup.pickupCode,
            pickupId: args.pickupId,
        }
    }
})

// Volunteer confirms pickup from donor (two-way: step 1)
export const confirmFoodPickup = mutation({
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
        if (pickup.status !== 'assigned' && pickup.status !== 'pickup_pending') {
            throw new ConvexError('Pickup must be in assigned or pickup_pending status')
        }
        if (pickup.volunteerId !== user._id) {
            throw new ConvexError('Only the assigned volunteer can confirm pickup')
        }
        if (pickup.volunteerPickupConfirmed) {
            throw new ConvexError('You have already confirmed pickup')
        }

        const donorAlsoConfirmed = pickup.donorPickupConfirmed === true

        if (donorAlsoConfirmed) {
            // Both confirmed → move to picked_up
            await ctx.db.patch(args.pickupId as Id<"pickups">, {
                volunteerPickupConfirmed: true,
                status: 'picked_up',
                pickedAt: new Date().toISOString(),
            })
            const foodListing = await ctx.db.get(pickup.foodListingId as Id<"foodlistings">)
            if (foodListing) {
                await ctx.db.patch(pickup.foodListingId as Id<"foodlistings">, {
                    status: 'picked_up',
                })
            }
        } else {
            // Only volunteer confirmed → waiting for donor
            await ctx.db.patch(args.pickupId as Id<"pickups">, {
                volunteerPickupConfirmed: true,
                status: 'pickup_pending',
            })
        }

        return { success: true, bothConfirmed: donorAlsoConfirmed }
    }
})

// Donor confirms volunteer picked up food (two-way: step 2)
export const donorConfirmPickup = mutation({
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
        if (pickup.donorId !== user._id) {
            throw new ConvexError('Only the donor can confirm this pickup')
        }
        if (pickup.status !== 'assigned' && pickup.status !== 'pickup_pending') {
            throw new ConvexError('Pickup must be in assigned or pickup_pending status')
        }
        if (pickup.donorPickupConfirmed) {
            throw new ConvexError('You have already confirmed pickup')
        }

        const volunteerAlsoConfirmed = pickup.volunteerPickupConfirmed === true

        if (volunteerAlsoConfirmed) {
            // Both confirmed → move to picked_up
            await ctx.db.patch(args.pickupId as Id<"pickups">, {
                donorPickupConfirmed: true,
                status: 'picked_up',
                pickedAt: new Date().toISOString(),
            })
            const foodListing = await ctx.db.get(pickup.foodListingId as Id<"foodlistings">)
            if (foodListing) {
                await ctx.db.patch(pickup.foodListingId as Id<"foodlistings">, {
                    status: 'picked_up',
                })
            }
        } else {
            // Only donor confirmed → waiting for volunteer
            await ctx.db.patch(args.pickupId as Id<"pickups">, {
                donorPickupConfirmed: true,
                status: 'pickup_pending',
            })
        }

        return { success: true, bothConfirmed: volunteerAlsoConfirmed }
    }
})

// Volunteer confirms delivery to NGO (two-way: step 1)
export const markFoodDelivered = mutation({
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
        if (pickup.status !== 'picked_up' && pickup.status !== 'delivery_pending') {
            throw new ConvexError('Pickup must be picked up before marking delivered')
        }
        if (pickup.volunteerId !== user._id) {
            throw new ConvexError('Only the assigned volunteer can mark as delivered')
        }
        if (pickup.volunteerDeliveryConfirmed) {
            throw new ConvexError('You have already confirmed delivery')
        }

        const ngoAlsoConfirmed = pickup.ngoDeliveryConfirmed === true

        if (ngoAlsoConfirmed) {
            // Both confirmed → move to delivered
            await ctx.db.patch(args.pickupId as Id<"pickups">, {
                volunteerDeliveryConfirmed: true,
                status: 'delivered',
                deliveredAt: new Date().toISOString(),
            })
            const foodListing = await ctx.db.get(pickup.foodListingId as Id<"foodlistings">)
            if (foodListing) {
                await ctx.db.patch(pickup.foodListingId as Id<"foodlistings">, {
                    status: 'delivered',
                })
            }
        } else {
            // Only volunteer confirmed → waiting for NGO
            await ctx.db.patch(args.pickupId as Id<"pickups">, {
                volunteerDeliveryConfirmed: true,
                status: 'delivery_pending',
            })
        }

        return { success: true, bothConfirmed: ngoAlsoConfirmed }
    }
})

// NGO confirms food received from volunteer (two-way: step 2)
export const ngoConfirmDelivery = mutation({
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
        if (pickup.ngoId !== user._id) {
            throw new ConvexError('Only the receiving NGO can confirm delivery')
        }
        if (pickup.status !== 'picked_up' && pickup.status !== 'delivery_pending') {
            throw new ConvexError('Pickup must be picked up or delivery pending')
        }
        if (pickup.ngoDeliveryConfirmed) {
            throw new ConvexError('You have already confirmed delivery')
        }

        const volunteerAlsoConfirmed = pickup.volunteerDeliveryConfirmed === true

        if (volunteerAlsoConfirmed) {
            // Both confirmed → move to delivered
            await ctx.db.patch(args.pickupId as Id<"pickups">, {
                ngoDeliveryConfirmed: true,
                status: 'delivered',
                deliveredAt: new Date().toISOString(),
            })
            const foodListing = await ctx.db.get(pickup.foodListingId as Id<"foodlistings">)
            if (foodListing) {
                await ctx.db.patch(pickup.foodListingId as Id<"foodlistings">, {
                    status: 'delivered',
                })
            }
        } else {
            // Only NGO confirmed → waiting for volunteer
            await ctx.db.patch(args.pickupId as Id<"pickups">, {
                ngoDeliveryConfirmed: true,
                status: 'delivery_pending',
            })
        }

        return { success: true, bothConfirmed: volunteerAlsoConfirmed }
    }
})

// Get donor's active (non-delivered) pickups with tracking info
export const getDonorPickupTracking = query({
    args: {},
    handler: async (ctx) => {
        const user = await authComponent.safeGetAuthUser(ctx)
        if (!user) {
            throw new ConvexError('Unauthorized')
        }

        const pickups = await ctx.db.query('pickups').collect()
        const donorPickups = pickups.filter(
            (p) => p.donorId === user._id && p.status !== 'delivered'
        )

        const enriched = await Promise.all(
            donorPickups.map(async (pickup) => {
                const foodListing = await ctx.db.get(pickup.foodListingId as Id<"foodlistings">)
                return {
                    ...pickup,
                    foodName: foodListing?.foodName ?? 'Unknown',
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

// Get NGO's own-volunteer pickups (volunteerType === 'ngo', active statuses)
export const getNgoOwnVolunteerPickups = query({
    args: {},
    handler: async (ctx) => {
        const user = await authComponent.safeGetAuthUser(ctx)
        if (!user) {
            throw new ConvexError('Unauthorized')
        }

        const pickups = await ctx.db.query('pickups').collect()
        const ownVolPickups = pickups.filter(
            (p) => p.ngoId === user._id && p.volunteerType === 'ngo' && ['assigned', 'pickup_pending', 'picked_up', 'delivery_pending'].includes(p.status)
        )

        const enriched = await Promise.all(
            ownVolPickups.map(async (pickup) => {
                const foodListing = await ctx.db.get(pickup.foodListingId as Id<"foodlistings">)
                const donorProfiles = await ctx.db.query('donorProfile').collect()
                const donorProfile = donorProfiles.find(dp => dp.userId === pickup.donorId)
                const ngoProfiles = await ctx.db.query('ngoProfile').collect()
                const ngoProfile = ngoProfiles.find(np => np.userId === pickup.ngoId)

                return {
                    ...pickup,
                    foodName: foodListing?.foodName ?? 'Unknown',
                    businessName: foodListing?.businessName ?? 'Unknown',
                    donorName: foodListing?.donorName ?? 'Unknown',
                    quantity: foodListing?.quantity,
                    category: foodListing?.category ?? '',
                    pickupLocation: foodListing?.location ?? '',
                    pickupWindow: foodListing?.pickupWindow,
                    donorAddress: donorProfile?.address ?? foodListing?.location ?? '',
                    ngoAddress: ngoProfile?.address ?? '',
                }
            })
        )

        return enriched
    }
})

// NGO confirms their own volunteer has picked up food from donor
export const ngoConfirmPickup = mutation({
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
        if (pickup.ngoId !== user._id) {
            throw new ConvexError('Only the owning NGO can update this pickup')
        }
        if (pickup.volunteerType !== 'ngo') {
            throw new ConvexError('This action is only for NGO volunteer pickups')
        }
        if (pickup.status !== 'assigned') {
            throw new ConvexError('Pickup must be in assigned status to confirm')
        }

        await ctx.db.patch(args.pickupId as Id<"pickups">, {
            status: 'picked_up',
            pickedAt: new Date().toISOString(),
        })

        const foodListing = await ctx.db.get(pickup.foodListingId as Id<"foodlistings">)
        if (foodListing) {
            await ctx.db.patch(pickup.foodListingId as Id<"foodlistings">, {
                status: 'picked_up',
            })
        }

        return { success: true }
    }
})

// NGO marks their own volunteer's delivery as completed
export const ngoMarkDelivered = mutation({
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
        if (pickup.ngoId !== user._id) {
            throw new ConvexError('Only the owning NGO can update this pickup')
        }
        if (pickup.volunteerType !== 'ngo') {
            throw new ConvexError('This action is only for NGO volunteer pickups')
        }
        if (pickup.status !== 'picked_up') {
            throw new ConvexError('Pickup must be picked up before marking delivered')
        }

        await ctx.db.patch(args.pickupId as Id<"pickups">, {
            status: 'delivered',
            deliveredAt: new Date().toISOString(),
        })

        const foodListing = await ctx.db.get(pickup.foodListingId as Id<"foodlistings">)
        if (foodListing) {
            await ctx.db.patch(pickup.foodListingId as Id<"foodlistings">, {
                status: 'delivered',
            })
        }

        return { success: true }
    }
})
