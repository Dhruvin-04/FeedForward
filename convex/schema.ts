import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    donorProfile: defineTable({
        userId: v.string(),
        businessName: v.string(),
        address: v.string(),
        phone: v.string(),
        fssaiNumber: v.string(),
        rating: v.number(),
    }),

    ngoProfile: defineTable({
        userId: v.string(),
        organizationName: v.string(),
        address: v.string(),
        phone: v.string(),
        registrationId: v.string(),
    }),

    volunteerProfile: defineTable({
        userId: v.string(),
        userName: v.string(),
        address: v.string(),
        phone: v.string(),
    }),

    users: defineTable({
        userId: v.string(),
        role: v.string(),
        email: v.string(),
    }),

    userSockets: defineTable({
        userId: v.string(),
        socketId: v.string(),
    }),

    foodlistings: defineTable({
        donorId: v.string(),
        donorName: v.string(),
        businessName: v.string(),
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
    }),

    pickups: defineTable({
        foodListingId: v.string(),
        donorId: v.string(),
        volunteerId: v.string(),
        volunteerName: v.string(),
        pickupCode: v.optional(v.string()),
        status: v.string(), // pending, assigned, picked, delivered
        createdAt: v.string(),
        assignedAt: v.optional(v.string()),
        pickedAt: v.optional(v.string()),
        deliveredAt: v.optional(v.string()),
    })
})