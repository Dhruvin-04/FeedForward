'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Navbar from '@/components/web/Navbar'
import Sidebar from '@/components/web/Sidebar'
import StatusBadge from '@/components/web/StatusBadge'
import DeliveryTimeline from '@/components/web/DeliveryTimeline'
import PickupDetailsDownload from '@/components/web/PickupDetailsDownload'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Package, MapPin, Clock, User, Phone, UtensilsCrossed, Users, Copy,
  CheckCircle, Truck, ArrowLeft,
} from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import Link from 'next/link'

export default function PickupDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const pickupId = params.id as string

  const volunteerProfile = useQuery(api.volunteerProfile.getVolunteerProfile)
  const pickup = useQuery(api.pickups.getPickupDetails, { pickupId })
  const confirmPickup = useMutation(api.pickups.confirmFoodPickup)
  const markDelivered = useMutation(api.pickups.markFoodDelivered)

  const [confirming, setConfirming] = useState(false)
  const [delivering, setDelivering] = useState(false)

  if (!pickup) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar role="volunteer" userName={volunteerProfile?.userName || 'Volunteer'} />
        <div className="flex">
          <Sidebar role="volunteer" />
          <main className="flex-1 flex items-center justify-center p-8">
            <Spinner className="h-8 w-8" />
          </main>
        </div>
      </div>
    )
  }

  const handleConfirmPickup = async () => {
    setConfirming(true)
    try {
      await confirmPickup({ pickupId })
      toast.success('Pickup confirmed! Food collected from donor.')
    } catch (err: any) {
      toast.error(err?.data ?? 'Failed to confirm pickup')
    } finally {
      setConfirming(false)
    }
  }

  const handleMarkDelivered = async () => {
    setDelivering(true)
    try {
      await markDelivered({ pickupId })
      toast.success('Delivery completed! Thank you for volunteering.')
    } catch (err: any) {
      toast.error(err?.data ?? 'Failed to mark as delivered')
    } finally {
      setDelivering(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="volunteer" userName={volunteerProfile?.userName || 'Volunteer'} />
      <div className="flex">
        <Sidebar role="volunteer" />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <Link
              href="/volunteer/dashboard"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{pickup.foodName}</h1>
                <p className="text-gray-500 mt-1">
                  {pickup.donorName} → {pickup.ngoName}
                </p>
              </div>
              <StatusBadge status={pickup.status} />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column — Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Pickup Code */}
                {pickup.pickupCode && (
                  <Card className="border-2 border-green-400">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Pickup Code</p>
                          <p className="text-3xl font-mono font-bold text-green-600 tracking-wider">
                            {pickup.pickupCode}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(pickup.pickupCode ?? '')
                              toast.success('Copied!')
                            }}
                          >
                            <Copy className="w-4 h-4 mr-1" /> Copy
                          </Button>
                          <PickupDetailsDownload
                            pickup={{
                              pickupCode: pickup.pickupCode,
                              foodName: pickup.foodName,
                              quantity: pickup.quantity,
                              category: pickup.category,
                              donorName: pickup.donorName,
                              donorPhone: pickup.donorPhone,
                              donorAddress: pickup.donorAddress,
                              ngoName: pickup.ngoName,
                              ngoPhone: pickup.ngoPhone,
                              ngoAddress: pickup.ngoAddress,
                              pickupLocation: pickup.pickupLocation,
                              pickupWindow: pickup.pickupWindow,
                              notes: pickup.notes,
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Food Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UtensilsCrossed className="h-5 w-5" /> Food Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Food Name</p>
                        <p className="font-medium">{pickup.foodName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium">{pickup.category === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}</p>
                      </div>
                      {pickup.quantity && (
                        <div>
                          <p className="text-sm text-gray-500">Quantity</p>
                          <p className="font-medium">{pickup.quantity} servings</p>
                        </div>
                      )}
                      {pickup.pickupWindow && (
                        <div>
                          <p className="text-sm text-gray-500">Pickup Window</p>
                          <p className="font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {pickup.pickupWindow.openingTime} - {pickup.pickupWindow.closingTime}
                          </p>
                        </div>
                      )}
                      {pickup.notes && (
                        <div className="sm:col-span-2">
                          <p className="text-sm text-gray-500">Notes</p>
                          <p className="font-medium">{pickup.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Donor Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" /> Donor Details (Pick Up From)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{pickup.donorName}</span>
                        {pickup.businessName !== pickup.donorName && (
                          <span className="text-gray-500">({pickup.businessName})</span>
                        )}
                      </div>
                      {pickup.donorPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{pickup.donorPhone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{pickup.donorAddress || pickup.pickupLocation}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* NGO Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" /> NGO Details (Deliver To)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{pickup.ngoName}</span>
                      </div>
                      {pickup.ngoPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{pickup.ngoPhone}</span>
                        </div>
                      )}
                      {pickup.ngoAddress && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{pickup.ngoAddress}</span>
                        </div>
                      )}
                      {pickup.ngoContactPerson && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Contact: {pickup.ngoContactPerson}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  {pickup.status === 'assigned' && (
                    <Button
                      onClick={handleConfirmPickup}
                      disabled={confirming}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12"
                    >
                      {confirming ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Confirm Pickup
                        </>
                      )}
                    </Button>
                  )}
                  {pickup.status === 'picked_up' && (
                    <Button
                      onClick={handleMarkDelivered}
                      disabled={delivering}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12"
                    >
                      {delivering ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        <>
                          <Truck className="h-5 w-5 mr-2" />
                          Mark Delivered
                        </>
                      )}
                    </Button>
                  )}
                  {pickup.status === 'delivered' && (
                    <div className="flex-1 text-center py-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <p className="text-green-800 font-medium">Delivery Completed</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column — Timeline */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DeliveryTimeline
                      status={pickup.status}
                      createdAt={pickup.createdAt}
                      assignedAt={pickup.assignedAt}
                      pickedAt={pickup.pickedAt}
                      deliveredAt={pickup.deliveredAt}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
