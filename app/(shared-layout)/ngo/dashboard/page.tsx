"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef, useMemo } from 'react'
import { Package, TrendingUp, MapPin, Star, Filter } from 'lucide-react'
import Navbar from '@/components/web/Navbar'
import Sidebar from '@/components/web/Sidebar'
import StatCard from '@/components/web/StatCard'
import FoodCard from '@/components/web/FoodCard'
import AcceptFoodModal, { AcceptFoodFormData } from '@/components/web/AcceptFoodModal'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { getSocket } from "@/lib/socket";
import { toast } from 'sonner'
import type { LiveLocation } from '@/components/web/LiveMap';
import type { FoodListing } from '@/lib/mockData'

interface ILocation{
  latitude: number,
  longitude: number
}

const LiveMap = dynamic(
  () => import('@/components/web/LiveMap'),
  { ssr: false }
);

export default function NGODashboard() {

  const [filter, setFilter] = useState({
    distance: 'all',
    quantity: 'all',
    time: 'all',
  })

  const user = useQuery(api.ngoProfile.getNgoProfile)
  const listings = useQuery(api.ngoProfile.getAvailableFood)
  const ngoPickups = useQuery(api.pickups.getNgoPickups)
  const updateLocation = useMutation(api.user.updateLocation)
  const ngoAcceptFood = useMutation(api.pickups.ngoAcceptFood)
  const availableListings = Array.isArray(listings) ? listings.filter(l => l.status === 'available') : []

  // Modal state
  const [acceptModalOpen, setAcceptModalOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Query ALL active user locations (donors, NGOs, volunteers) — reactive
  const allActiveLocations = useQuery(api.user.getAllActiveLocations)
  
  
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

  
  const [userLocation, setUserLocation] = useState<ILocation>({ latitude: 0, longitude: 0 })

  useEffect(()=>{
      let socket = getSocket()
        if(!user?.userId) return
        if(!navigator.geolocation) return
        const watcher = navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords
            setUserLocation({ latitude, longitude })
            const loc = {
                type: "Point" as const,
                coordinates: [longitude, latitude]
            }
            socket.emit('identity', {
                userId: user.userId,
                location: loc
            })
            // Also persist location directly to the users table
            updateLocation({ userId: user.userId, location: loc })
        }, (error) => {
            console.error('Error watching position:', error)
        }, { enableHighAccuracy: true })
        return () => navigator.geolocation.clearWatch(watcher)
    }, [user?.userId])

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

  // Compute stats from actual pickups
  const activeReceiving = Array.isArray(ngoPickups) ? ngoPickups.filter(p => p.status !== 'delivered').length : 0
  const mealsReceived = Array.isArray(ngoPickups) ? ngoPickups.filter(p => p.status === 'delivered').reduce((sum, p) => sum + (p.quantity ?? 0), 0) : 0

  const handleAccept = (listing: FoodListing) => {
    setSelectedListing(listing)
    setAcceptModalOpen(true)
  }

  const handleSubmitAccept = async (data: AcceptFoodFormData) => {
    if (!selectedListing) return
    setIsSubmitting(true)
    try {
      await ngoAcceptFood({
        foodListingId: selectedListing._id,
        donorId: selectedListing.donorId,
        contactPerson: data.contactPerson,
        phone: data.phone,
        organizationName: data.organizationName,
        pickupNotes: data.pickupNotes || undefined,
        volunteerType: data.volunteerType,
        volunteerName: data.volunteerType === 'ngo' ? data.volunteerName : undefined,
        volunteerPhone: data.volunteerType === 'ngo' ? data.volunteerPhone : undefined,
      })
      toast.success(
        data.volunteerType === 'ngo'
          ? 'Food accepted! Your volunteer has been assigned.'
          : 'Food accepted! Waiting for a platform volunteer.'
      )
      setAcceptModalOpen(false)
      setSelectedListing(null)
    } catch {
      toast.error('Failed to accept food. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewMap = (location: string) => {
    // Mock map view
    console.log('Viewing map for:', location)
  }

   // Build LiveMap locations from all active user locations
  const liveLocations = useMemo<LiveLocation[]>(() => {
    const locs: LiveLocation[] = []

    // Add NGO's own location (freshest from browser geolocation)
    if (userLocation.latitude !== 0 || userLocation.longitude !== 0) {
      locs.push({
        userId: user?.userId ?? 'self',
        lat: userLocation.latitude,
        lng: userLocation.longitude,
        role: 'ngo',
        label: 'You',
      })
    }

    // Add all other users with locations from the DB
    if (allActiveLocations) {
      for (const u of allActiveLocations) {
        if (u.userId === user?.userId) continue
        locs.push({
          userId: u.userId,
          lat: u.location.coordinates[1],
          lng: u.location.coordinates[0],
          role: u.role,
        })
      }
    }

    return locs
  }, [userLocation, allActiveLocations, user?.userId])

  // Compute a sensible map center
  const mapCenter = useMemo(() => {
    if (userLocation.latitude !== 0 || userLocation.longitude !== 0) {
      return { lat: userLocation.latitude, lng: userLocation.longitude }
    }
    if (liveLocations.length > 0) {
      return { lat: liveLocations[0].lat, lng: liveLocations[0].lng }
    }
    return { lat: 18.9774, lng: 72.8350 } // fallback
  }, [userLocation, liveLocations])

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
                value={mealsReceived.toString()}
                icon={Package}
                iconColor="primary"
              />
              <StatCard
                title="Active Receiving"
                value={activeReceiving.toString()}
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
                        onAccept={() => handleAccept(listing as unknown as FoodListing)}
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

              {/* Live Map */}
              <div className="lg:col-span-1">
                <div className="lg:relative">
                  <div ref={mapRef} className={`lg:sticky lg:top-24 p-6 ${isFixedMap ? 'invisible' : ''}`}>
                    <h2 className="text-xl font-semibold mb-4">Live Map</h2>
                    <LiveMap locations={liveLocations} center={mapCenter} height="h-80" />
                  </div>
                </div>
              </div>

              {/* Fixed map that appears bottom-right after scrolling (large screens) */}
              {isFixedMap && (
                <div className="fixed right-6 bottom-6 z-50 hidden lg:block">
                  <div className="w-95 rounded-lg overflow-hidden">
                    <div className="p-4">
                      <h2 className="text-lg font-semibold mb-2">Live Map</h2>
                      <LiveMap locations={liveLocations} center={mapCenter} height="h-72" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Accept Food Modal */}
      <AcceptFoodModal
        isOpen={acceptModalOpen}
        onClose={() => { setAcceptModalOpen(false); setSelectedListing(null) }}
        onSubmit={handleSubmitAccept}
        foodName={selectedListing?.foodName ?? ''}
        defaultOrgName={user?.organizationName}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
