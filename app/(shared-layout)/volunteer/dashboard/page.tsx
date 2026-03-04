'use client'
import Link from 'next/link'
import { Package, TrendingUp, MapPin, Star, ArrowRight } from 'lucide-react'
import { getPickupsByVolunteer, mockPickups } from '@/lib/mockData'
import Navbar from '@/components/web/Navbar'
import Sidebar from '@/components/web/Sidebar'
import StatCard from '@/components/web/StatCard'
import StatusBadge from '@/components/web/StatusBadge'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useEffect, useState, useMemo } from 'react'
import { getSocket } from '@/lib/socket'
import dynamic from 'next/dynamic'
import type { LiveLocation } from '@/components/web/LiveMap'

interface ILocation{
  latitude: number,
  longitude: number
}

const LiveMap = dynamic(
  () => import('@/components/web/LiveMap'),
  { ssr: false }
);

export default function VolunteerDashboard() {

  const volunteerId = '3' // Mock volunteer ID
  const pickups = getPickupsByVolunteer(volunteerId)
  const activePickups = pickups.filter(p => p.status !== 'delivered')
  const user = useQuery(api.volunteerProfile.getVolunteerProfile)
  const updateLocation = useMutation(api.user.updateLocation)

  // Fetch real pickups for this volunteer from Convex
  const realPickups = useQuery(api.pickups.getVolunteerPickups)

  // Query ALL active user locations (donors, NGOs, volunteers) — reactive
  const allActiveLocations = useQuery(api.user.getAllActiveLocations)

  const stats = {
    activePickups: activePickups.length,
    completedDeliveries: pickups.filter(p => p.status === 'delivered').length,
    distanceTraveled: pickups.filter(p => p.status === 'delivered').length * 8.5, // Mock: 8.5 km per delivery
    rating: 4.7,
  }

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

  // Build LiveMap locations from all active user locations
  const liveLocations = useMemo<LiveLocation[]>(() => {
    const locs: LiveLocation[] = []

    // Add volunteer's own location (freshest from browser geolocation)
    if (userLocation.latitude !== 0 || userLocation.longitude !== 0) {
      locs.push({
        userId: user?.userId ?? 'self',
        lat: userLocation.latitude,
        lng: userLocation.longitude,
        role: 'volunteer',
        label: 'You',
      })
    }

    // Add all other users with locations from the DB
    if (allActiveLocations) {
      for (const u of allActiveLocations) {
        // Skip self (we already added the volunteer above with fresh coords)
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
      <Navbar role="volunteer" userName={user?.userName || "John Doe"} />
      <div className="flex">
        <Sidebar role="volunteer" />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Active Pickups"
                value={stats.activePickups}
                icon={Package}
                iconColor="primary"
              />
              <StatCard
                title="Completed Deliveries"
                value={stats.completedDeliveries}
                icon={TrendingUp}
                iconColor="secondary"
              />
              <StatCard
                title="Distance Traveled"
                value={`${stats.distanceTraveled.toFixed(1)} km`}
                icon={MapPin}
                iconColor="primary"
              />
              <StatCard
                title="Rating"
                value={stats.rating}
                icon={Star}
                iconColor="secondary"
              />
            </div>

            {/* Assigned Pickups */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Assigned Pickups</h2>
                <div className="space-y-4">
                  {activePickups.length > 0 ? (
                    activePickups.map((pickup) => (
                      <div key={pickup._id} className="card">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              Pickup #{pickup._id}
                            </h3>
                            <p className="text-sm text-gray-600">
                              From: {pickup.donorName} → To: {pickup.ngoName}
                            </p>
                          </div>
                          <StatusBadge status={pickup.status} />
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="font-medium">Pickup:</span> {pickup.donorLocation}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="font-medium">Delivery:</span> {pickup.ngoLocation}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Package className="h-4 w-4 mr-2" />
                            <span className="font-medium">Pickup Code:</span> {pickup.pickupCode}
                          </div>
                        </div>

                        <Link
                          href={`/volunteer/pickup/${pickup._id}`}
                          className="btn-primary w-full inline-flex items-center justify-center"
                        >
                          View Details <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="card text-center py-12">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No active pickups assigned.</p>
                    </div>
                  )}
                </div>

                {/* Completed Pickups */}
                {pickups.filter(p => p.status === 'delivered').length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Completed Deliveries</h2>
                    <div className="space-y-4">
                      {pickups
                        .filter(p => p.status === 'delivered')
                        .map((pickup) => (
                          <div key={pickup._id} className="card opacity-75">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                  Pickup #{pickup._id}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {pickup.donorName} → {pickup.ngoName}
                                </p>
                                <p className="text-xs text-gray-500 mt-1" suppressHydrationWarning>
                                  Delivered: {pickup.deliveredAt ? new Date(pickup.deliveredAt).toLocaleString() : 'N/A'}
                                </p>
                              </div>
                              <StatusBadge status={pickup.status} />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Live Map */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Live Map</h2>
                <LiveMap locations={liveLocations} center={mapCenter} height="h-96" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
