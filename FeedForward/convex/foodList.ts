import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const createFoodList = mutation({
    args: {
        foodName: v.string(),
        category: v.string(),
        quantity: v.optional(v.number()),
        cookedTime: v.string(),
        expiryTime: v.string(),
        pickupWindow: v.object({
            openingTime: v.string(),
            closingTime: v.string()
        }),
        location: v.string(),
        notes: v.optional(v.string()),
        status: v.string()
    },
    handler: async (ctx, args) => {
        const user = await authComponent.safeGetAuthUser(ctx)
        if (!user) {
            throw new ConvexError('Unauthorized')
        }



        const donorUser = await ctx.db.query('donorProfile').collect()
        let business = ''
        for (const donor of donorUser) {
            if (user._id === donor.userId) {
                business = donor.businessName
            }
        }


        const foodlist = await ctx.db.insert('foodlistings', {
            donorId: user._id,
            donorName: user.name || user.email,
            businessName: business,
            category: args.category,
            cookedTime: args.cookedTime,
            expiryTime: args.expiryTime,
            foodName: args.foodName,
            location: args.location,
            pickupWindow: args.pickupWindow,
            status: args.status,
            notes: args.notes,
            quantity: args.quantity
        })
    }
})

export const getFoodList = query({
    args: {},
    handler: async (ctx) => {
        const user = await authComponent.safeGetAuthUser(ctx)
        if (!user) {
            throw new ConvexError('Unauthorized')
        }

        try {
            const foodList = await ctx.db.query('foodlistings').collect()
            const userFoodList = foodList?.filter(donor => donor.donorId === user._id) || []
            return await Promise.all(
                userFoodList.map(async (donor) => {
                    return {
                        ...donor,
                        user
                    }
                })
            )
        } catch (error) {
            return {
                error : 'Something went wrong'
            }
        }

    }
})

export const getAvailableFoodListings = query({
    args: {},
    handler: async (ctx) => {
        try {
            // Get all available food listings that volunteers can accept
            const foodListings = await ctx.db.query('foodlistings').collect()
            
            // Filter only available items (not yet picked up or in process)
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