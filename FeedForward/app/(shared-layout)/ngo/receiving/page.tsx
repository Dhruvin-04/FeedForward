'use client'

import { useState, useEffect, useMemo } from 'react'
import { Package } from 'lucide-react'
import Navbar from '@/components/web/Navbar'
import Sidebar from '@/components/web/Sidebar'
import ReceivingCard from '@/components/web/ReceivingCard'
import MapTrackingModal from '@/components/web/MapTrackingModal'
import { api } from '@/convex/_generated/api'
import { useQuery, useMutation } from 'convex/react'
import { getSocket } from '@/lib/socket'
import { toast } from 'sonner'

export default function NGOReceivingPage() {
  const user = useQuery(api.ngoProfile.getNgoProfile)
  const ngoPickups = useQuery(api.pickups.getNgoPickups)
  const updateLocation = useMutation(api.user.updateLocation)
  const allActiveLocations = useQuery(api.user.getAllActiveLocations)

  const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 })
  const [mapModalOpen, setMapModalOpen] = useState(false)
  const [trackingItem, setTrackingItem] = useState<string | null>(null)
  const ngoConfirmDelivery = useMutation(api.pickups.ngoConfirmDelivery)
  const [confirmingDeliveryId, setConfirmingDeliveryId] = useState<string | null>(null)

  // Track NGO location
  useEffect(() => {
    if (!user?.userId || !navigator.geolocation) return
    const socket = getSocket()
    const watcher = navigator.geolocation.watchPosition((pos) => {
      const { latitude, longitude } = pos.coords
      setUserLocation({ latitude, longitude })
      const loc = { type: "Point" as const, coordinates: [longitude, latitude] }
      socket.emit('identity', { userId: user.userId, location: loc })
      updateLocation({ userId: user.userId, location: loc })
    }, undefined, { enableHighAccuracy: true })
    return () => navigator.geolocation.clearWatch(watcher)
  }, [user?.userId])

  // Filter active receiving items (not delivered)
  const activeItems = useMemo(() => {
    if (!Array.isArray(ngoPickups)) return []
    return ngoPickups.filter(p => p.status !== 'delivered')
  }, [ngoPickups])

  // Get mock coordinates for map tracking
  const getTrackingLocations = (pickupId: string) => {
    const pickup = activeItems.find(p => p._id === pickupId)
    if (!pickup) return {}

    // Use NGO's own location
    const ngoLoc = userLocation.latitude !== 0
      ? { lat: userLocation.latitude, lng: userLocation.longitude, label: 'NGO (You)' }
      : { lat: 18.9774, lng: 72.835, label: 'NGO (You)' }

    // Try to find donor location from active user locations
    const donorUser = allActiveLocations?.find(u => u.userId === pickup.donorId)
    const donorLoc = donorUser?.location
      ? { lat: donorUser.location.coordinates[1], lng: donorUser.location.coordinates[0], label: pickup.donorName }
      : { lat: ngoLoc.lat + 0.015, lng: ngoLoc.lng + 0.01, label: pickup.donorName }

    // Try to find volunteer location
    let volunteerLoc = undefined
    if (pickup.volunteerId && pickup.status !== 'pending') {
      const volUser = allActiveLocations?.find(u => u.userId === pickup.volunteerId)
      volunteerLoc = volUser?.location
        ? { lat: volUser.location.coordinates[1], lng: volUser.location.coordinates[0], label: pickup.volunteerName ?? 'Volunteer' }
        : { lat: (ngoLoc.lat + donorLoc.lat) / 2, lng: (ngoLoc.lng + donorLoc.lng) / 2, label: pickup.volunteerName ?? 'Volunteer' }
    }

    return { donorLoc, ngoLoc, volunteerLoc }
  }

  const handleTrackMap = (pickupId: string) => {
    setTrackingItem(pickupId)
    setMapModalOpen(true)
  }

  const trackingPickup = activeItems.find(p => p._id === trackingItem)
  const trackingLocs = trackingItem ? getTrackingLocations(trackingItem) : {}

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="ngo" userName={user?.organizationName || "My Organization"} />
      <div className="flex">
        <Sidebar role="ngo" />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Receiving</h1>
              <p className="text-gray-500 mt-1">Track your accepted food items and deliveries</p>
            </div>

            {/* Summary bar */}
            <div className="flex gap-4 mb-6">
              <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                <span className="font-semibold text-amber-700">
                  {activeItems.filter(i => i.status === 'pending').length}
                </span>
                <span className="text-amber-600 ml-1">Pending</span>
              </div>
              <div className="px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg text-sm">
                <span className="font-semibold text-purple-700">
                  {activeItems.filter(i => i.status === 'assigned').length}
                </span>
                <span className="text-purple-600 ml-1">Assigned</span>
              </div>
              <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                <span className="font-semibold text-yellow-700">
                  {activeItems.filter(i => i.status === 'pickup_pending' || i.status === 'assigned').length}
                </span>
                <span className="text-yellow-600 ml-1">Pickup Pending</span>
              </div>
              <div className="px-4 py-2 bg-orange-50 border border-orange-200 rounded-lg text-sm">
                <span className="font-semibold text-orange-700">
                  {activeItems.filter(i => i.status === 'picked_up' || i.status === 'delivery_pending').length}
                </span>
                <span className="text-orange-600 ml-1">In Transit</span>
              </div>
            </div>

            {/* Receiving Cards */}
            {activeItems.length > 0 ? (
              <div className="space-y-4">
                {activeItems.map((item) => (
                  <ReceivingCard
                    key={item._id}
                    item={item}
                    onTrackMap={() => handleTrackMap(item._id)}
                    onConfirmDelivery={async () => {
                      setConfirmingDeliveryId(item._id)
                      try {
                        await ngoConfirmDelivery({ pickupId: item._id })
                        toast.success('Delivery confirmed!')
                      } catch (err: any) {
                        toast.error(err?.data ?? 'Failed to confirm delivery')
                      } finally {
                        setConfirmingDeliveryId(null)
                      }
                    }}
                    confirmingDelivery={confirmingDeliveryId === item._id}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 text-center py-16">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Active Receiving</h2>
                <p className="text-gray-600">You don&apos;t have any food being delivered at the moment.</p>
                <p className="text-gray-500 text-sm mt-1">Accept food from the Dashboard to see items here.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Map Tracking Modal */}
      <MapTrackingModal
        isOpen={mapModalOpen}
        onClose={() => { setMapModalOpen(false); setTrackingItem(null) }}
        donorLocation={trackingLocs.donorLoc}
        ngoLocation={trackingLocs.ngoLoc}
        volunteerLocation={trackingLocs.volunteerLoc}
        foodName={trackingPickup?.foodName ?? ''}
        status={trackingPickup?.status ?? ''}
      />
    </div>
  )
}
