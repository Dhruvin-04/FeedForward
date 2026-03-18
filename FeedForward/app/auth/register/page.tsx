import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Bike, Hotel, Users } from "lucide-react";
import Link from "next/link";

export default function authPage(){
    return(
        <div className="flex flex-col justify-center items-center py-30 relative">
            <div className="absolute top-5 left-5">
                <Link href={'/'} className={`${buttonVariants({variant: 'secondary'})}`}>
                    <ArrowLeft className="size-3" />
                    Back to Home
                </Link>
            </div>
            <h1 className="text-3xl font-bold mb-8">Select Your Role</h1>
            <div className="flex gap-8">
                <Link className={`${buttonVariants({variant: "ghost"})} bg-gray-200 h-50 w-50 hover:bg-gray-300 flex flex-col gap-6 text-xl text-orange-400 hover:text-orange-500`} href={'/auth/register/donors'}>
                    <Hotel className="size-10 text-orange-400"/>
                    Donors
                </Link>
                <Link className={`${buttonVariants({variant: 'outline'})} bg-gray-200 h-50 w-50 hover:bg-gray-300 flex flex-col gap-6 text-xl text-black`} href={'/auth/register/volunteers'}>
                    <Bike className="size-10 text-black"/>
                    Volunteer
                </Link>
                <Link className={`${buttonVariants({variant: 'outline'})} bg-gray-200 h-50 w-50 hover:bg-gray-300 flex flex-col gap-6 text-xl text-green-500 hover:text-green-600`} href={'/auth/register/ngos'}>
                    <Users className="size-10 text-green-500"/>
                    NGOs
                </Link>
            </div>
        </div>
    )
}