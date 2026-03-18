import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const fillNgoInfo = mutation({
    args: {organizationName: v.string(), address: v.string(), registrationId: v.string(), phone: v.string()},
    handler: async (ctx, args)=>{
        const user = await authComponent.safeGetAuthUser(ctx)
        if(!user){
            throw new ConvexError('Unauthorized Details') 
        }

        const ngo = await ctx.db.insert('ngoProfile',{
            userId: user._id,
            organizationName: args.organizationName,
            address: args.address,
            phone: args.phone,
            registrationId: args.registrationId,
        })
        return ngo
    }
})

export const getAvailableFood = query({
    args: {},
    handler: async (ctx)=>{
        const user = await authComponent.safeGetAuthUser(ctx)
        if(!user){
            throw new ConvexError('Unauthorized');
        }

        const foodlist = await ctx.db.query('foodlistings').collect();
        const availableFood = foodlist.filter(food => food.status === 'available');
        return availableFood
    }
})

export const getNgoProfile = query({
    args: {},
    handler: async (ctx) => {
        const user = await authComponent.safeGetAuthUser(ctx)
        if (!user) {
            throw new ConvexError("User is not authenticated")
        }

        const ngoProfile = await ctx.db.query('ngoProfile').collect()
        const userNgoProfile = ngoProfile.find(ngo => ngo.userId === user._id)
        return userNgoProfile || null
    }
})