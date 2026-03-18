'use client'
import { Button } from "@/components/ui/button";
import NgoLogos from "@/components/web/Logos";
import Navbar from "@/components/web/Navbar";
import { getSocket } from "@/lib/socket";
import { BadgeCheck, ChevronRight, HousePlus, Truck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useConvexAuth } from "convex/react";

export default function Home() {

    const [role, setRole] = useState('')
    const { isAuthenticated, isLoading } = useConvexAuth()

    useEffect(()=>{
        const fetchrole = localStorage.getItem('role')
        if(fetchrole) setRole(fetchrole)
    }, [])
    return (
        <>
            <Navbar role={role.toLowerCase()} userName=""/>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Berkshire+Swash&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            
                .font-berkshire {
                    font-family: 'Berkshire Swash', cursive;
                }
            `}</style>
            <section className="flex flex-col items-center pb-48 text-center text-sm text-white max-md:px-2 bg-[url(https://plus.unsplash.com/premium_photo-1663045514090-00657acb4478?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDI3fHxmb29kJTIwc2hhcmluZyUyMGJ5JTIwbmdvJTIwcGVvcGxlfGVufDB8fDB8fHww)] bg-cover bg-center">
                <div className="flex flex-wrap items-center justify-center p-1.5 mt-24 md:mt-28 rounded-full border border-slate-400 text-xs">
                    <div className="flex items-center">
                        <img className="size-7 rounded-full border-3 border-white"
                            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50" alt="userImage1" />
                        <img className="size-7 rounded-full border-3 border-white -translate-x-2"
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50" alt="userImage2" />
                        <img className="size-7 rounded-full border-3 border-white -translate-x-4"
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop"
                            alt="userImage3" />
                    </div>
                    <p className="-translate-x-2">Join community of 1m+ founders </p>
                </div>
                <h1 className="font-berkshire text-[45px]/[52px] md:text-6xl/[65px] mt-6 max-w-4xl text-shadow-lg/30">
                    Rescue Surplus Food, <br /> Help Those in Need
                </h1>
                <p className="text-base mt-2 max-w-xl text-shadow-md/40">Connecting Restaurants with NGOs to Reduce Food Waste</p>

                <div className="mt-8 flex items-center gap-5">
                    {!isLoading && isAuthenticated ? (
                        <Link href={role ? `/${role.toLowerCase()}/dashboard` : '/'} className="bg-orange-500 py-4 px-10 rounded-xl text-2xl font-semibold">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href={'/auth/login'} className="bg-orange-500 py-4 px-10 rounded-xl text-2xl font-semibold">Donate Food</Link>
                            <Link href={'/auth/login'} className="bg-green-600 py-4 px-10 rounded-xl text-2xl font-semibold">Find Food</Link>
                        </>
                    )}
                </div>
            </section>
            <div className="py-14 flex justify-around items-center px-15 bg-amber-50">
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <BadgeCheck className="size-14" />
                        <h1 className="text-3xl font-semibold ">Verified Restaurants</h1>
                    </div>
                    <div className="text-xl text-muted-foreground">
                        Safe, healthy surplus food.
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <HousePlus className="size-14" />
                        <h1 className="text-3xl font-semibold ">Trusted NGOs</h1>
                    </div>
                    <div className="text-xl text-muted-foreground">
                        Helping local communities.
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <Truck className="size-14" />
                        <h1 className="text-3xl font-semibold ">Real-Time Pickups</h1>
                    </div>
                    <div className="text-xl text-muted-foreground">
                        Volunteers on the move.
                    </div>
                </div>
            </div>
            <>
                <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
                <h1 className="text-5xl font-semibold text-center mx-auto mt-8">How It Works</h1>

                <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
                    <div className="max-w-100 w-full hover:-translate-y-0.5 transition duration-300">
                        <div className="w-full h-68 object-center overflow-hidden rounded-xl">
                            <img className="rounded-xl w-full h-full object-cover" src="https://images.unsplash.com/photo-1657271528081-3b9d3b9f9623?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njh8fHdhaXRlcnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                        </div>
                        <h3 className="text-2xl text-slate-900 font-semibold mt-3">1. List Surplus Food</h3>
                        <p className="text-sm text-muted-foreground font-medium mt-2 ml-4">Restaurants post excess food.</p>
                    </div>
                    <div className="max-w-100 w-full hover:-translate-y-0.5 transition duration-300">
                        <div className="w-full h-68 object-center overflow-hidden rounded-xl">
                            <img className="rounded-xl w-full h-full object-cover" src="https://plus.unsplash.com/premium_photo-1733317223968-9bb3a925b245?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmdvJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                        </div>
                        <h3 className="text-2xl text-slate-900 font-semibold mt-3">2. Nearby NGOs Claim</h3>
                        <p className="text-sm text-muted-foreground font-medium mt-2 ml-4">Local charities get notified.</p>
                    </div>
                    <div className="max-w-100 w-full hover:-translate-y-0.5 transition duration-300">
                        <div className="w-full h-68 object-center overflow-hidden rounded-xl">
                            <img className="rounded-xl w-full h-full object-cover" src="https://plus.unsplash.com/premium_photo-1726776092398-98a1620d877e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fGZvb2QlMjBkZWxpdmVyZWR8ZW58MHx8MHx8fDA%3D" alt="" />
                        </div>
                        <h3 className="text-2xl text-slate-900 font-semibold mt-3">3. Food Delivered</h3>
                        <p className="text-sm text-muted-foreground font-medium mt-2 ml-4">Volunteers pickup & deliver.</p>
                    </div>
                </div>
            </>
            <div className="flex flex-col items-center py-10 my-8 bg-amber-50">
                <div className="text-4xl font-medium leading-loose">Join the Mission to End Food Waste</div>
                <div className="text-muted-foreground text-xl">Together, we can make a difference</div>
                <div className="flex gap-5 mt-10">
                    {!isLoading && isAuthenticated ? (
                        <Link href={role ? `/${role.toLowerCase()}/dashboard` : '/'} className="bg-orange-500 text-white py-4 px-10 rounded text-2xl font-semibold flex items-center gap-2">
                            Go to Dashboard
                            <ChevronRight className="size-7" />
                        </Link>
                    ) : (
                        <>
                            <Link href={'/auth/login'} className="bg-orange-500 text-white py-4 px-10 rounded text-2xl font-semibold flex items-center gap-2">
                                Become a Donor
                                <ChevronRight className="size-7" />
                            </Link>

                            <Link href={'/auth/login'} className="bg-green-600 text-white py-4 px-10 rounded text-2xl font-semibold flex items-center gap-2">
                                Join as NGO
                                <ChevronRight className="size-7" />
                            </Link>
                        </>
                    )}
                </div>
            </div>
            <div className="py-10 flex justify-around items-center px-30">
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-semibold ">10,000+</h1>
                    </div>
                    <div className="text-xl text-muted-foreground font-medium">
                        Meals Rescued
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-semibold ">500+</h1>
                    </div>
                    <div className="text-xl text-muted-foreground font-medium">
                        NGOS supported
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-semibold ">2,000+</h1>
                    </div>
                    <div className="text-xl text-muted-foreground font-medium">
                        Volunteers Active
                    </div>
                </div>
            </div>

            <NgoLogos/>

            <>
                <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>

                <footer className="flex flex-col bg-slate-50 items-center justify-around w-full py-16 text-sm text-gray-800/70">
                    <div className="flex items-center gap-8">
                        <a href="#" className="font-medium text-gray-500 hover:text-black transition-all">
                            Home
                        </a>
                        <a href="#" className="font-medium text-gray-500 hover:text-black transition-all">
                            About
                        </a>
                        <a href="#" className="font-medium text-gray-500 hover:text-black transition-all">
                            Services
                        </a>
                        <a href="#" className="font-medium text-gray-500 hover:text-black transition-all">
                            Contact
                        </a>
                        <a href="#" className="font-medium text-gray-500 hover:text-black transition-all">
                            FAQ
                        </a>
                    </div>
                    <div className="flex items-center gap-4 mt-8 text-indigo-500">
                        <a href="#" className="hover:-translate-y-0.5 transition-all duration-300">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                        <a href="#" className="hover:-translate-y-0.5 transition-all duration-300">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M16 11.37a4 4 0 1 1-7.914 1.173A4 4 0 0 1 16 11.37m1.5-4.87h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                        <a href="#" className="hover:-translate-y-0.5 transition-all duration-300">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6M6 9H2v12h4zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                        <a href="#" className="hover:-translate-y-0.5 transition-all duration-300">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                        <a href="#" className="hover:-translate-y-0.5 transition-all duration-300">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 18c-4.51 2-5-2-7-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                    </div>
                    <p className="mt-8 text-center">© 2026 <a href="http://localhost:3000">FeedForward</a>. All rights reservered.</p>
                </footer>
            </>
        </>
    )
}