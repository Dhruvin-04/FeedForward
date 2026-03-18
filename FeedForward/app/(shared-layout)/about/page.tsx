'use client'
import Navbar from "@/components/web/Navbar"
import { Heart, Building2, Truck, UtensilsCrossed, Users, HandHeart, TrendingDown, Handshake } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function AboutPage() {
    const [role, setRole] = useState('')

    useEffect(() => {
        const fetchrole = localStorage.getItem('role')
        if (fetchrole) setRole(fetchrole)
    }, [])

    return (
        <>
            <Navbar role={role.toLowerCase()} userName="" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Berkshire+Swash&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
                * { font-family: 'Poppins', sans-serif; }
                .font-berkshire { font-family: 'Berkshire Swash', cursive; }
            `}</style>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-orange-50 via-white to-green-50 py-24 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-center gap-6 mb-8">
                        <div className="bg-orange-100 p-4 rounded-full">
                            <UtensilsCrossed className="size-10 text-orange-500" />
                        </div>
                        <div className="bg-green-100 p-4 rounded-full">
                            <Users className="size-10 text-green-500" />
                        </div>
                        <div className="bg-blue-100 p-4 rounded-full">
                            <Truck className="size-10 text-blue-500" />
                        </div>
                    </div>
                    <h1 className="font-berkshire text-5xl md:text-6xl text-gray-900 leading-tight">
                        Fighting Food Waste, <br /> Feeding Communities
                    </h1>
                    <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
                        FeedForward connects restaurants, NGOs, and volunteers to redistribute surplus food and ensure it reaches those in need.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-semibold text-gray-900 mb-6">Our Mission</h2>
                    <div className="w-20 h-1 bg-orange-400 mx-auto mb-8 rounded-full" />
                    <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                        FeedForward is a food redistribution platform designed to reduce food waste and fight hunger.
                        Restaurants and donors can list surplus food, NGOs can accept it, and volunteers help deliver
                        it to the people who need it most. We believe that no meal should go to waste when someone
                        nearby is going hungry.
                    </p>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 px-6 bg-amber-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-semibold text-center text-gray-900 mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
                            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <HandHeart className="size-8 text-orange-500" />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Donate Food</h3>
                            <p className="text-gray-600">
                                Restaurants or donors list surplus food that would otherwise go to waste.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Building2 className="size-8 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-3">NGOs Accept</h3>
                            <p className="text-gray-600">
                                Nearby NGOs accept food donations based on availability and need.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Truck className="size-8 text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Volunteers Deliver</h3>
                            <p className="text-gray-600">
                                Volunteers pick up the food and deliver it safely to NGOs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Section */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-semibold text-center text-gray-900 mb-12">Our Impact</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-orange-50 rounded-2xl p-8 text-center hover:shadow-md transition-shadow">
                            <div className="bg-orange-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                                <UtensilsCrossed className="size-7 text-orange-500" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">10,000+</h3>
                            <p className="text-gray-600 mt-2 font-medium">Meals Saved</p>
                        </div>
                        <div className="bg-green-50 rounded-2xl p-8 text-center hover:shadow-md transition-shadow">
                            <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingDown className="size-7 text-green-500" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">5,000 kg</h3>
                            <p className="text-gray-600 mt-2 font-medium">Food Waste Reduced</p>
                        </div>
                        <div className="bg-blue-50 rounded-2xl p-8 text-center hover:shadow-md transition-shadow">
                            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Handshake className="size-7 text-blue-500" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">500+</h3>
                            <p className="text-gray-600 mt-2 font-medium">NGOs Connected</p>
                        </div>
                        <div className="bg-purple-50 rounded-2xl p-8 text-center hover:shadow-md transition-shadow">
                            <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="size-7 text-purple-500" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">2,000+</h3>
                            <p className="text-gray-600 mt-2 font-medium">Active Volunteers</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-16 px-6 bg-gradient-to-r from-orange-500 to-green-500 text-center text-white">
                <h2 className="text-3xl font-semibold mb-4">Ready to Make a Difference?</h2>
                <p className="text-lg mb-8 opacity-90">Join FeedForward today and help fight food waste in your community.</p>
                <Link href="/auth/register" className="bg-white text-orange-500 font-semibold py-3 px-8 rounded-xl text-lg hover:bg-gray-100 transition-colors">
                    Get Started
                </Link>
            </section>
        </>
    )
}
