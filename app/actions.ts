'use server'
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { getSocket } from "@/lib/socket";
import { login } from "@/schemas/auth";
import { donorSchema } from "@/schemas/donorSchema";
import { foodListingSchema } from "@/schemas/foodListing";
import { ngoSchema } from "@/schemas/ngoSchema";
import { socketSchema } from "@/schemas/storeSocket";
import { userSchema } from "@/schemas/user";
import { volunteerSchema } from "@/schemas/volunteerSchema";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

export async function createDonor(data: z.infer<typeof donorSchema>) {
    const parsed = donorSchema.safeParse(data)

    if (!parsed.success) {
        throw new Error("Something went wrong")
    }

    const token = await getToken()
    try {
        const donorCreate = await fetchMutation(api.donorProfile.fillDonorInfo, {
            address: parsed.data.address,
            phone: parsed.data.phone,
            businessName: parsed.data.businessName,
            fssaiNumber: parsed.data.fssaiNumber,
            rating: parsed.data.rating,
        }, { token })
    } catch (error) {
        return {
            error: 'Something went wrong while filling details'
        }
    }
    return redirect('/donor/dashboard')
}

export async function createNGO(data: z.infer<typeof ngoSchema>) {
    const parsed = ngoSchema.safeParse(data)

    if (!parsed.success) {
        throw new Error("Something went wrong")
    }

    const token = await getToken()
    try {
        const ngoCreate = await fetchMutation(api.ngoProfile.fillNgoInfo, {
            address: parsed.data.address,
            phone: parsed.data.phone,
            organizationName: parsed.data.organizationName,
            registrationId: parsed.data.registrationId,
        }, { token })
    } catch (error) {
        return {
            error: 'Something went wrong while filling details'
        }
    }
    return redirect('/ngo/dashboard')
}

export async function createVolunteer(data: z.infer<typeof volunteerSchema>) {
    const parsed = volunteerSchema.safeParse(data)

    if (!parsed.success) {
        throw new Error("Something went wrong")
    }

    const token = await getToken()
    try {
        const volunteerCreate = await fetchMutation(api.volunteerProfile.fillVolunteerInfo, {
            userName: parsed.data.userName,
            address: parsed.data.address,
            phone: parsed.data.phone,
        }, { token })
    } catch (error) {
        return {
            error: 'Something went wrong while filling details'
        }
    }
    return redirect('/volunteer/dashboard')
}

export async function createUser(data: z.infer<typeof userSchema>) {
    const parsed = userSchema.safeParse(data)

    if (!parsed.success) {
        throw new Error("Something went wrong")
    }

    const token = await getToken();
    try {
        const userCreate = await fetchMutation(api.user.storeEmail, {
            email: parsed.data.email,
            role: parsed.data.role,
            userId: parsed.data.userId,
        }, { token })
    } catch (error) {
        return {
            error: 'Something went wrong while filling details'
        }
    }
}

export async function storeSocket(data: z.infer<typeof socketSchema>){
    // validation must use the socket schema, not userSchema
    const parsed = socketSchema.safeParse(data)

    if (!parsed.success) {

        throw new Error("Invalid socket data")
    }
    const token = await getToken();
    try {
        const socketStore = await fetchMutation(api.user.storeSocketId, {
            userId: parsed.data.userId,
            socketId: parsed.data.socketId,
            location: parsed.data.location
        }, { token })
    } catch (error) {        
        console.error('storeSocket mutation error', error);
        return {
            error: 'Something went wrong while filling details'
        }
    }
}

export async function getUserRole(data: z.infer<typeof login>){
    const user = await fetchQuery(api.user.getRole, {
        email: data.email
    })
}

export async function createFoodListing(data: z.infer<typeof foodListingSchema>){
    const parsed = foodListingSchema.safeParse(data)

    if (!parsed.success) {
        throw new Error("Something went wrong")
    }

    const token = await getToken()

    try {
        
        const createList = await fetchMutation(api.foodList.createFoodList, {
            category: parsed.data.category,
            cookedTime: parsed.data.cookedTime,
            expiryTime: parsed.data.expiryTime,
            foodName: parsed.data.foodName,
            location: parsed.data.location,
            pickupWindow: parsed.data.pickupWindow,
            quantity: parsed.data.quantity,
            status: 'available',
            notes: parsed.data.notes
        }, {token})
        return { success: true }
    } catch (error) {
        return{
            error: "Something went wrong"
        }
    }
}