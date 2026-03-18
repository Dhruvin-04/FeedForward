'use client'

import { useState } from 'react'
import { Package, CheckCircle } from 'lucide-react'
import Navbar from '@/components/web/Navbar'
import Sidebar from '@/components/web/Sidebar'
import StatusBadge from '@/components/web/StatusBadge'
import DeliveryTimeline from '@/components/web/DeliveryTimeline'
import { api } from '@/convex/_generated/api'
import { useQuery, useMutation } from 'convex/react'
import { toast } from 'sonner'

export default function DonorPickupTrackingPage() {
  const profile = useQuery(api.donorProfile.getDonorProfile)
  const donorPickups = useQuery(api.pickups.getDonorPickupTracking) ?? []
  const donorConfirmPickup = useMutation(api.pickups.donorConfirmPickup)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="donor" userName={profile?.businessName || 'Donor'} />
      <div className="flex">
        <Sidebar role="donor" />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Package className="h-7 w-7 text-primary" />
              <h1 className="text-3xl font-bold text-gray-900">Pickup Tracking</h1>
            </div>

            {donorPickups.length === 0 ? (
              <div className="card text-center py-16">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500">No active pickups</h3>
                <p className="text-sm text-gray-400 mt-1">
                  When an NGO claims your food donation, it will appear here.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {donorPickups.map((pickup: any) => (
                  <div key={pickup._id} className="card border border-gray-200">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{pickup.foodName}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {pickup.quantity && <>{pickup.quantity} servings &bull; </>}
                          {pickup.category === 'veg' ? 'Vegetarian' : pickup.category === 'non-veg' ? 'Non-Veg' : pickup.category}
                        </p>
                      </div>
                      <StatusBadge status={pickup.status} />
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <p className="text-xs text-gray-500">NGO</p>
                        <p className="text-sm font-medium text-gray-900">{pickup.ngoName}</p>
                      </div>
                      {pickup.volunteerName && (
                        <div className="bg-gray-50 rounded-lg px-3 py-2">
                          <p className="text-xs text-gray-500">Volunteer</p>
                          <p className="text-sm font-medium text-gray-900">{pickup.volunteerName}</p>
                        </div>
                      )}
                      {pickup.pickupWindow && (
                        <div className="bg-gray-50 rounded-lg px-3 py-2">
                          <p className="text-xs text-gray-500">Pickup Window</p>
                          <p className="text-sm font-medium text-gray-900">
                            {pickup.pickupWindow.openingTime} - {pickup.pickupWindow.closingTime}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Pickup Code */}
                    {pickup.pickupCode && (
                      <div className="mb-4 inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-md px-4 py-2">
                        <span className="text-xs font-medium text-blue-600">Pickup Code:</span>
                        <span className="text-base font-bold tracking-widest text-blue-800">{pickup.pickupCode}</span>
                      </div>
                    )}

                    {/* Donor pickup confirmation */}
                    {(pickup.status === 'assigned' || pickup.status === 'pickup_pending') && !pickup.donorPickupConfirmed && (
                      <div className="mb-4">
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
                      <p className="text-sm text-amber-600 mb-4">Waiting for volunteer confirmation...</p>
                    )}

                    {/* Timeline */}
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
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
