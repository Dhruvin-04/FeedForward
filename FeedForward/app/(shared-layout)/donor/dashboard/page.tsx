'use client'
import Link from 'next/link'
import { Package, TrendingUp, Star, Plus, CheckCircle } from 'lucide-react'
import Navbar from '@/components/web/Navbar'
import Sidebar from '@/components/web/Sidebar'
import StatCard from '@/components/web/StatCard'
import StatusBadge from '@/components/web/StatusBadge'
import DeliveryTimeline from '@/components/web/DeliveryTimeline'
import { api } from '@/convex/_generated/api'
import { useEffect, useState } from 'react'
import { getSocket } from '@/lib/socket'
import { useMutation, useQuery } from 'convex/react'
import { toast } from 'sonner'

interface ILocation{
  latitude: number,
  longitude: number
}

export default function DonorDashboard() {

  const [userLocation, setUserLocation] = useState<ILocation>({ latitude: 0, longitude: 0 })
  const user = useQuery(api.donorProfile.getDonorProfile)
  const listings = useQuery(api.foodList.getFoodList)
  const donorPickups = useQuery(api.pickups.getDonorPickupTracking) ?? []
  const updateLocation = useMutation(api.user.updateLocation)
  const donorConfirmPickup = useMutation(api.pickups.donorConfirmPickup)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  
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

  const filteredListings = Array.isArray(listings) ? listings.filter(l => l !== undefined) : []
  
  const stats = {
    totalDonated: filteredListings.length,
    activeListings: filteredListings.filter(l => l?.status === 'available' || l?.status === 'reserved').length,
    mealsServed: filteredListings.reduce((sum, l) => sum + (l?.status === 'delivered' ? (l?.quantity || 0) : 0), 0),
    rating: 4.8,
  }  

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="donor" userName={user?.businessName || "Donor"} />
      <div className="flex">
        <Sidebar role="donor" />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <Link href="/donor/new" className="btn-primary inline-flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Post New Donation
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Food Donated"
                value={stats.totalDonated}
                icon={Package}
                iconColor="primary"
              />
              <StatCard
                title="Active Listings"
                value={stats.activeListings}
                icon={TrendingUp}
                iconColor="secondary"
              />
              <StatCard
                title="Meals Served"
                value={stats.mealsServed}
                icon={Package}
                iconColor="primary"
              />
              <StatCard
                title="Rating Score"
                value={stats.rating}
                icon={Star}
                iconColor="secondary"
                trend={{ value: '+0.2 this month', isPositive: true }}
              />
            </div>

            {/* Past Food Listings Table */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Past Food Listings</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Food Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Quantity</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Pickup Window</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(listings) && filteredListings.length > 0 ? filteredListings.map((listing) => (
                      <tr key={listing?._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{listing?.foodName}</div>
                          <div className="text-sm text-gray-500">{listing?.category === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{listing?.quantity} servings</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{listing?.pickupWindow.openingTime} - {listing?.pickupWindow.closingTime}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={listing?.status || 'available'} />
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {new Date(listing? listing._creationTime: '').toLocaleDateString()}
                        </td>
                      </tr>
                    )) : <tr><td colSpan={5} className="py-3 px-4 text-center text-gray-500">No donations yet. <Link href="/donor/new" className="text-blue-600 hover:underline">Post your first donation</Link></td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pickup Tracking Section */}
            {donorPickups.length > 0 && (
              <div className="card mt-8">
                <h2 className="text-xl font-semibold mb-4">Active Pickup Tracking</h2>
                <div className="space-y-4">
                  {donorPickups.map((pickup: any) => (
                    <div key={pickup._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{pickup.foodName}</h3>
                          <p className="text-sm text-gray-500">
                            {pickup.quantity && <>{pickup.quantity} servings &bull; </>}
                            NGO: {pickup.ngoName}
                            {pickup.volunteerName && <> &bull; Volunteer: {pickup.volunteerName}</>}
                          </p>
                          {pickup.pickupWindow && (
                            <p className="text-sm text-gray-400 mt-0.5">
                              Pickup: {pickup.pickupWindow.openingTime} - {pickup.pickupWindow.closingTime}
                            </p>
                          )}
                        </div>
                        <StatusBadge status={pickup.status} />
                      </div>
                      {pickup.pickupCode && (
                        <div className="mb-3 inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-md px-3 py-1.5">
                          <span className="text-xs font-medium text-blue-600">Pickup Code:</span>
                          <span className="text-sm font-bold tracking-widest text-blue-800">{pickup.pickupCode}</span>
                        </div>
                      )}
                      {/* Donor pickup confirmation */}
                      {(pickup.status === 'assigned' || pickup.status === 'pickup_pending') && !pickup.donorPickupConfirmed && (
                        <div className="mb-3">
                          {pickup.volunteerPickupConfirmed && (
                            <p className="text-sm text-amber-600 mb-2">Volunteer has marked pickup. Please confirm that food was collected.</p>
                          )}
                          <button
                            onClick={async () => {
                              setConfirmingId(pickup._id)
                              try {
                                await donorConfirmPickup({ pickupId: pickup._id })
                                toast.success('Pickup confirmed!')
                              } catch (err: any) {
                                toast.error(err?.data ?? 'Failed to confirm pickup')
                              } finally {
                                setConfirmingId(null)
                              }
                            }}
                            disabled={confirmingId === pickup._id}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            <CheckCircle className="h-4 w-4" />
                            {confirmingId === pickup._id ? 'Confirming...' : 'Confirm Volunteer Picked Up Food'}
                          </button>
                        </div>
                      )}
                      {pickup.donorPickupConfirmed && pickup.status === 'pickup_pending' && (
                        <p className="text-sm text-amber-600 mb-3">Waiting for volunteer confirmation...</p>
                      )}
                      <DeliveryTimeline
                        status={pickup.status}
                        createdAt={pickup.createdAt}
                        assignedAt={pickup.assignedAt}
                        pickedAt={pickup.pickedAt}
                        deliveredAt={pickup.deliveredAt}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
