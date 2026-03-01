"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from 'react'
import { Package, TrendingUp, MapPin, Star, Filter } from 'lucide-react'
import Navbar from '@/components/web/Navbar'
import Sidebar from '@/components/web/Sidebar'
import StatCard from '@/components/web/StatCard'
import FoodCard from '@/components/web/FoodCard'
import MapPlaceholder from '@/components/web/MapPlaceholder'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Mapview } from '@/components/web/Map'
import { getSocket } from "@/lib/socket";

const Map = dynamic(
  () => import("../../../../components/web/Map").then((component) => component.Mapview),
  { ssr: false }
);

export default function NGODashboard() {
  const storeSocket = useMutation(api.user.storeSocketId)

  const [filter, setFilter] = useState({
    distance: 'all',
    quantity: 'all',
    time: 'all',
  })

  const user = useQuery(api.ngoProfile.getNgoProfile)
  const listings = useQuery(api.ngoProfile.getAvailableFood)
  const availableListings = Array.isArray(listings) ? listings.filter(l => l.status === 'available') : []

    let socket=null;
    if(user){
      socket = getSocket();
    }
    storeSocket({
      userId: user?.userId || "",
      socketId: socket?.id || "",
    })
    

  // Client-side filters: quantity and time
  const filteredListings = availableListings.filter((listing) => {
    const qty = typeof listing.quantity === 'number' ? listing.quantity : Number(listing.quantity) || 0

    const qtyMatch = (() => {
      if (filter.quantity === 'all') return true
      if (filter.quantity === '<25') return qty < 25
      if (filter.quantity === '25-50') return qty >= 25 && qty <= 50
      if (filter.quantity === '>50') return qty > 50
      return true
    })()

    const getHour = () => {
      if (listing.cookedTime) {
        const d = new Date(listing.cookedTime)
        if (!isNaN(d.getTime())) return d.getHours()
      }
      if (listing.pickupWindow && typeof listing.pickupWindow.openingTime === 'string') {
        const parts = listing.pickupWindow.openingTime.split(':')
        const h = Number(parts[0])
        if (!Number.isNaN(h)) return h
      }
      return null
    }

    const hour = getHour()
    const timeMatch = (() => {
      if (filter.time === 'all') return true
      if (hour === null) return true
      if (filter.time === 'morning') return hour >= 5 && hour <= 11
      if (filter.time === 'afternoon') return hour >= 12 && hour <= 16
      if (filter.time === 'evening') return hour >= 17 && hour <= 22
      return true
    })()

    return qtyMatch && timeMatch
  })

  const mapRef = useRef<HTMLDivElement | null>(null)
  const [isFixedMap, setIsFixedMap] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      if (typeof window === 'undefined') return
      // Only enable fixed map on large screens
      if (window.innerWidth < 1024) {
        setIsFixedMap(false)
        return
      }

      // Trigger when page is scrolled past 300px (adjustable)
      const trigger = 300
      setIsFixedMap(window.scrollY > trigger)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // const stats = {
  //   mealsReceived: mockFoodListings.filter(l => l.ngoId === '2' && l.status === 'delivered').reduce((sum, l) => sum + l.quantity, 0),
  //   activeRequests: mockFoodListings.filter(l => l.ngoId === '2' && (l.status === 'reserved' || l.status === 'picked')).length,
  //   nearbyDonors: new Set(mockFoodListings.map(l => l.donorId)).size,
  //   trustScore: 4.9,
  // }

  const handleAccept = (listingId: string) => {
    // Mock accept action
    console.log('Accepting food listing:', listingId)
  }

  const handleViewMap = (location: string) => {
    // Mock map view
    console.log('Viewing map for:', location)
  }

   const locations = [
    { id: "550e8400-e29b-41d4-a716-446655440000", lat: 18.9774, lng: 72.8350 },
    { id: "550e8400-e29b-41d4-a716-446655440013", lat: 18.9772, lng: 72.7350 },
    { id: "550e8400-e29b-41d4-a716-446655440014", lat: 18.9674, lng: 72.8650 },
    { id: "550e8400-e29b-41d4-a716-446655440015", lat: 18.9764, lng: 72.8300 },
    { id: "550e8400-e29b-41d4-a716-446655440016", lat: 18.8774, lng: 72.8310 },
    { id: "550e8400-e29b-41d4-a716-446655440017", lat: 18.9574, lng: 72.9750 },
    { id: "550e8400-e29b-41d4-a716-446655440018", lat: 18.9743, lng: 72.0350 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="ngo" userName={user?.organizationName || "My Organization"} />
      <div className="flex">
        <Sidebar role="ngo" />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Meals Received"
                value='0'
                icon={Package}
                iconColor="primary"
              />
              <StatCard
                title="Active Requests"
                value={availableListings.length.toString()}
                icon={TrendingUp}
                iconColor="secondary"
              />
              <StatCard
                title="Nearby Donors"
                value='0'
                icon={MapPin}
                iconColor="primary"
              />
              <StatCard
                title="Trust Score"
                value='0'
                icon={Star}
                iconColor="secondary"
              />
            </div>

            {/* Filters */}
            <div className="card mb-6">
              <div className="flex items-center mb-4">
                <Filter className="h-5 w-5 text-gray-600 mr-2" />
                <h2 className="text-lg font-semibold">Filters</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
                  <select
                    value={filter.distance}
                    onChange={(e) => setFilter({ ...filter, distance: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Distances</option>
                    <option value="<5km">&lt; 5 km</option>
                    <option value="5-10km">5-10 km</option>
                    <option value=">10km">&gt; 10 km</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <select
                    value={filter.quantity}
                    onChange={(e) => setFilter({ ...filter, quantity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Quantities</option>
                    <option value="<25">&lt; 25 servings</option>
                    <option value="25-50">25-50 servings</option>
                    <option value=">50">&gt; 50 servings</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <select
                    value={filter.time}
                    onChange={(e) => setFilter({ ...filter, time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Times</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Real-time Food Listings */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Available Food Listings</h2>
                <div className="space-y-4">
                  {filteredListings.length > 0 ? (
                    filteredListings.map((listing) => (
                      <FoodCard
                        key={listing._id}
                        listing={listing}
                        showActions
                        onAccept={() => handleAccept(listing._id)}
                        onViewMap={() => handleViewMap(listing.location)}
                      />
                    ))
                  ) : (
                    <div className="card text-center py-12">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No available food listings at the moment.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Map Preview */}
              <div className="lg:col-span-1">
                <div className="lg:relative">
                  <div ref={mapRef} className={`lg:sticky lg:top-24 p-6 ${isFixedMap ? 'invisible' : ''}`}>
                    <h2 className="text-xl font-semibold mb-4">Map View</h2>
                    <Map center={{ lng: 72.8350, lat: 18.9774 }} locations={locations}/>
                    {/* <MapPlaceholder location="Food listings nearby" height={filteredListings.length > 0 ? 'h-80' : 'h-56'} /> */}
                  </div>
                </div>
              </div>

              {/* Fixed map that appears bottom-right after scrolling (large screens) */}
              {isFixedMap && (
                <div className="fixed right-6 bottom-6 z-50 hidden lg:block">
                  <div className="w-95 rounded-lg overflow-hidden">
                    <div className="p-4">
                      <h2 className="text-lg font-semibold mb-2">Map View</h2>
                      <Map center={{ lng: 72.8350, lat: 18.9774 }} locations={locations}/>
                      {/* <MapPlaceholder location="Food listings nearby" height={filteredListings.length > 0 ? 'h-80' : 'h-56'} /> */}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
