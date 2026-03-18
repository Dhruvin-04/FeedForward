'use client'

import { useState, useEffect, useMemo } from 'react'
import { Package, Users, MapPin, Phone, User, Navigation, Eye, CheckCircle, Truck } from 'lucide-react'
import Navbar from '@/components/web/Navbar'
import Sidebar from '@/components/web/Sidebar'
import StatusBadge from '@/components/web/StatusBadge'
import DeliveryTimeline from '@/components/web/DeliveryTimeline'
import DeliveryMapTracker from '@/components/web/DeliveryMapTracker'
import { Button } from '@/components/ui/button'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { getSocket } from '@/lib/socket'
import { toast } from 'sonner'
import { UtensilsCrossed, Clock } from 'lucide-react'

export default function OurVolunteerPickupsPage() {
  const user = useQuery(api.ngoProfile.getNgoProfile)
  const pickups = useQuery(api.pickups.getNgoOwnVolunteerPickups) ?? []
  const updateLocation = useMutation(api.user.updateLocation)
  const allActiveLocations = useQuery(api.user.getAllActiveLocations)
  const ngoConfirmPickup = useMutation(api.pickups.ngoConfirmPickup)
  const ngoMarkDelivered = useMutation(api.pickups.ngoMarkDelivered)

  const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 })
  const [trackingId, setTrackingId] = useState<string | null>(null)
  const [detailsId, setDetailsId] = useState<string | null>(null)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  // Track NGO location
  useEffect(() => {
    if (!user?.userId || !navigator.geolocation) return
    const socket = getSocket()
    const watcher = navigator.geolocation.watchPosition((pos) => {
      const { latitude, longitude } = pos.coords
      setUserLocation({ latitude, longitude })
      const loc = { type: 'Point' as const, coordinates: [longitude, latitude] }
      socket.emit('identity', { userId: user.userId, location: loc })
      updateLocation({ userId: user.userId, location: loc })
    }, undefined, { enableHighAccuracy: true })
    return () => navigator.geolocation.clearWatch(watcher)
  }, [user?.userId])

  const getTrackingLocations = (pickupId: string) => {
    const pickup = pickups.find(p => p._id === pickupId)
    if (!pickup) return {}

    const ngoLoc = userLocation.latitude !== 0
      ? { lat: userLocation.latitude, lng: userLocation.longitude, label: 'NGO (You)' }
      : { lat: 18.9774, lng: 72.835, label: 'NGO (You)' }

    const donorUser = allActiveLocations?.find(u => u.userId === pickup.donorId)
    const donorLoc = donorUser?.location
      ? { lat: donorUser.location.coordinates[1], lng: donorUser.location.coordinates[0], label: pickup.donorName }
      : { lat: ngoLoc.lat + 0.015, lng: ngoLoc.lng + 0.01, label: pickup.donorName }

    // For NGO volunteers we don't have real-time tracking, use midpoint placeholder
    const volunteerLoc = {
      lat: (ngoLoc.lat + donorLoc.lat) / 2,
      lng: (ngoLoc.lng + donorLoc.lng) / 2,
      label: pickup.volunteerName ?? 'Volunteer',
    }

    return { donorLoc, ngoLoc, volunteerLoc }
  }

  const handleConfirmPickup = async (pickupId: string) => {
    setLoadingAction(pickupId + '-confirm')
    try {
      await ngoConfirmPickup({ pickupId })
      toast.success('Pickup confirmed! Volunteer has collected the food.')
    } catch (err: any) {
      toast.error(err?.data ?? 'Failed to confirm pickup')
    } finally {
      setLoadingAction(null)
    }
  }

  const handleMarkDelivered = async (pickupId: string) => {
    setLoadingAction(pickupId + '-deliver')
    try {
      await ngoMarkDelivered({ pickupId })
      toast.success('Delivery completed! Food has been received.')
    } catch (err: any) {
      toast.error(err?.data ?? 'Failed to mark as delivered')
    } finally {
      setLoadingAction(null)
    }
  }

  const trackingPickup = pickups.find(p => p._id === trackingId)
  const trackingLocs = trackingId ? getTrackingLocations(trackingId) : {}

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="ngo" userName={user?.organizationName || 'My Organization'} />
      <div className="flex">
        <Sidebar role="ngo" />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Our Volunteer Pickups</h1>
              <p className="text-gray-500 mt-1">Live pickups handled by your organization&apos;s volunteers</p>
            </div>

            {/* Summary */}
            <div className="flex gap-4 mb-6">
              <div className="px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg text-sm">
                <span className="font-semibold text-purple-700">
                  {pickups.filter(p => p.status === 'assigned').length}
                </span>
                <span className="text-purple-600 ml-1">Assigned</span>
              </div>
              <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                <span className="font-semibold text-yellow-700">
                  {pickups.filter(p => p.status === 'picked_up').length}
                </span>
                <span className="text-yellow-600 ml-1">Picked Up</span>
              </div>
            </div>

            {/* Cards */}
            {pickups.length > 0 ? (
              <div className="space-y-4">
                {pickups.map((pickup) => (
                  <div key={pickup._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="p-5 border-b border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-linear-to-br from-green-50 to-green-100 flex items-center justify-center text-green-700">
                            <UtensilsCrossed className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{pickup.foodName}</h3>
                            <p className="text-sm text-gray-500">{pickup.businessName}</p>
                          </div>
                        </div>
                        <StatusBadge status={pickup.status} />
                      </div>

                      {/* Food Info Tags */}
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        {pickup.quantity && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                            <Users className="w-3 h-3" /> Serves {pickup.quantity}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                          <User className="w-3 h-3" /> {pickup.donorName}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                          <MapPin className="w-3 h-3" /> {pickup.pickupLocation}
                        </span>
                        {pickup.ngoAddress && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                            <MapPin className="w-3 h-3" /> NGO: {pickup.ngoAddress}
                          </span>
                        )}
                        {pickup.pickupWindow && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                            <Clock className="w-3 h-3" /> {pickup.pickupWindow.openingTime} - {pickup.pickupWindow.closingTime}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 grid md:grid-cols-2 gap-5">
                      {/* Volunteer Info */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Volunteer Details</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900 font-medium">{pickup.volunteerName}</span>
                          </div>
                          {pickup.volunteerPhone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{pickup.volunteerPhone}</span>
                            </div>
                          )}
                          {pickup.pickupCode && (
                            <div className="flex items-center gap-2 text-sm">
                              <Package className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">
                                Pickup Code: <span className="font-mono font-bold text-primary">{pickup.pickupCode}</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Timeline */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Delivery Timeline</h4>
                        <DeliveryTimeline
                          status={pickup.status}
                          createdAt={pickup.createdAt}
                          assignedAt={pickup.assignedAt}
                          pickedAt={pickup.pickedAt}
                          deliveredAt={pickup.deliveredAt}
                        />
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-5 pb-5 space-y-3">
                      {/* Status Action Buttons */}
                      {pickup.status === 'assigned' && (
                        <Button
                          onClick={() => handleConfirmPickup(pickup._id)}
                          disabled={loadingAction === pickup._id + '-confirm'}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {loadingAction === pickup._id + '-confirm' ? 'Confirming...' : 'Confirm Pickup from Donor'}
                        </Button>
                      )}
                      {pickup.status === 'picked_up' && (
                        <Button
                          onClick={() => handleMarkDelivered(pickup._id)}
                          disabled={loadingAction === pickup._id + '-deliver'}
                          className="w-full bg-green-600 hover:bg-green-700 text-white h-11"
                        >
                          <Truck className="h-4 w-4 mr-2" />
                          {loadingAction === pickup._id + '-deliver' ? 'Updating...' : 'Mark as Delivered'}
                        </Button>
                      )}
                      {/* Secondary Actions */}
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1 text-black"
                          onClick={() => setTrackingId(pickup._id)}
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Track Delivery
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 text-black"
                          onClick={() => setDetailsId(detailsId === pickup._id ? null : pickup._id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {detailsId === pickup._id ? 'Hide Details' : 'View Details'}
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {detailsId === pickup._id && (
                      <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Donor Address</span>
                            <p className="font-medium">{pickup.donorAddress || pickup.pickupLocation}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">NGO Address</span>
                            <p className="font-medium">{pickup.ngoAddress || '—'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Category</span>
                            <p className="font-medium">{pickup.category === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Created</span>
                            <p className="font-medium">{new Date(pickup.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 text-center py-16">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Active Volunteer Pickups</h2>
                <p className="text-gray-600">When you accept food with your own volunteer, it will appear here.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Map Tracking Modal */}
      <DeliveryMapTracker
        isOpen={!!trackingId}
        onClose={() => setTrackingId(null)}
        donorLocation={trackingLocs.donorLoc}
        ngoLocation={trackingLocs.ngoLoc}
        volunteerLocation={trackingLocs.volunteerLoc}
        foodName={trackingPickup?.foodName ?? ''}
        status={trackingPickup?.status ?? ''}
        volunteerName={trackingPickup?.volunteerName}
        volunteerPhone={trackingPickup?.volunteerPhone}
        pickupCode={trackingPickup?.pickupCode}
      />
    </div>
  )
}
