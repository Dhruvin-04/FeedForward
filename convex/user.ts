import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const storeEmail = mutation({
    args: {email: v.string(), role: v.string(), userId: v.string()},
    handler: async (ctx, args)=>{
        const emailStore = await ctx.db.insert('users', {
            email: args.email,
            role: args.role,
            userId: args.userId,
        })
    }
})

export const storeSocketId = mutation({
    args: {userId: v.string(), socketId: v.string(), location: v.object({
        type: v.string(), // "Point"
        coordinates: v.array(v.number()) // [longitude, latitude]
    })},
    handler: async (ctx, args)=>{
        // find and remove any existing socket entry for this user
        const existing = await ctx.db
          .query('userSockets')
          .filter(q => q.eq(q.field('userId'), args.userId))
          .first();
        if (existing) {
          await ctx.db.delete(existing._id);
        }
        // insert the new socketId row
        await ctx.db.insert('userSockets', {
            userId: args.userId,
            socketId: args.socketId,
            location: args.location,
            updatedAt: new Date().toISOString()
        });
    }
})

export const getRole = query({
    args: {email: v.string()},
    handler: async (ctx, args)=>{
        const user = await ctx.db.query('users').collect()
        for(const elem of user){
            if(elem.email === args.email){
                return elem.role
            }
        }
        return null
    }
})