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
        // find the existing user row and patch it with socket info
        const existing = await ctx.db
          .query('users')
          .filter(q => q.eq(q.field('userId'), args.userId))
          .first();
        if (!existing) {
          throw new ConvexError(`User not found: ${args.userId}`);
        }
        await ctx.db.patch(existing._id, {
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

// Update just the location on the users table (called from client-side geolocation)
export const updateLocation = mutation({
    args: {
        userId: v.string(),
        location: v.object({
            type: v.string(),
            coordinates: v.array(v.number())
        })
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
          .query('users')
          .filter(q => q.eq(q.field('userId'), args.userId))
          .first();
        if (!existing) {
          throw new ConvexError(`User not found: ${args.userId}`);
        }
        await ctx.db.patch(existing._id, {
            location: args.location,
            updatedAt: new Date().toISOString()
        });
    }
})

// Get locations for a list of userIds (returns userId + location + role)
export const getUserLocations = query({
    args: { userIds: v.array(v.string()) },
    handler: async (ctx, args) => {
        const allUsers = await ctx.db.query('users').collect();
        return allUsers
            .filter(u => args.userIds.includes(u.userId))
            .map(u => ({
                userId: u.userId,
                role: u.role,
                location: u.location ?? null,
            }));
    }
})

// Get all users that have a location set (for showing all roles on the map)
export const getAllActiveLocations = query({
    args: {},
    handler: async (ctx) => {
        const allUsers = await ctx.db.query('users').collect();
        return allUsers
            .filter(u => u.location != null)
            .map(u => ({
                userId: u.userId,
                role: u.role,
                location: u.location!,
            }));
    }
})


