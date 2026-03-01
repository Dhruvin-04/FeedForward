'use client'

import { useState } from 'react'
import { Package, User, Clock, MapPin, CheckCircle2 } from 'lucide-react'
import { getPickupsByNGO, mockPickups } from '@/lib/mockData'
import Navbar from '@/components/web/Navbar'
import Sidebar from '@/components/web/Sidebar'
import StatusBadge from '@/components/web/StatusBadge'
import MapPlaceholder from '@/components/web/MapPlaceholder'
import Timeline from '@/components/web/Timeline'
import RatingStars from '@/components/web/RatingStars'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'

export default function NGOReceivingPage() {

  const user = useQuery(api.ngoProfile.getNgoProfile)

  const ngoId = '2' // Mock NGO ID
  const pickups = getPickupsByNGO(ngoId)
  const activePickup = pickups.find(p => p.status !== 'delivered')

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const handleConfirmReceived = () => {
    // Mock confirm action
    console.log('Food received confirmed')
  }

  const handleSubmitRating = () => {
    // Mock rating submission
    console.log('Rating submitted:', rating, comment)
  }

  if (!activePickup) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar role="ngo" userName="Hope Foundation" />
        <div className="flex">
          <Sidebar role="ngo" />
          <main className="flex-1 p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="card text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Active Pickups</h2>
                <p className="text-gray-600">You don't have any food being delivered at the moment.</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const timelineItems = [
    { label: 'Food Reserved', time: new Date(activePickup.assignedAt).toLocaleString(), completed: true },
    { label: 'Volunteer Assigned', time: new Date(activePickup.assignedAt).toLocaleString(), completed: true },
    { label: 'Food Picked Up', time: activePickup.pickedAt ? new Date(activePickup.pickedAt).toLocaleString() : undefined, completed: !!activePickup.pickedAt },
    { label: 'Food Delivered', time: activePickup.deliveredAt ? new Date(activePickup.deliveredAt).toLocaleString() : undefined, completed: !!activePickup.deliveredAt },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="ngo" userName={user?.organizationName || "My Organization"} />
      <div className="flex">
        <Sidebar role="ngo" />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Receiving Food</h1>

            <div className='flex justify-between items-center'>
              {/* Reserved Food Details */}
              <div className="card mb-6 w-1/3">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-semibold">Reserved Food</h2>
                  <StatusBadge status={activePickup.status} />
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <Package className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Food Listing ID: {activePickup.foodListingId}</p>
                      <p className="text-sm text-gray-600">From: {activePickup.donorName}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Volunteer: {activePickup.volunteerName}</p>
                      <p className="text-sm text-gray-600">Pickup Code: {activePickup.pickupCode}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Pickup Location</p>
                      <p className="text-sm text-gray-600">{activePickup.donorLocation}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Delivery Location</p>
                      <p className="text-sm text-gray-600">{activePickup.ngoLocation}</p>
                    </div>
                  </div>

                  {activePickup.pickedAt && (
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Estimated Arrival</p>
                        <p className="text-sm text-gray-600">
                          {new Date(new Date(activePickup.pickedAt).getTime() + 45 * 60000).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="card mb-6 w-1/3">
                <h2 className="text-xl font-semibold mb-4">Delivery Timeline</h2>
                <Timeline items={timelineItems} />
              </div>
            </div>

            {/* Map */}
            <div className="card mb-6">
              <h2 className="text-xl font-semibold mb-4">Route Map</h2>
              <MapPlaceholder location={`${activePickup.donorLocation} → ${activePickup.ngoLocation}`} height="h-64" />
            </div>

            {/* Confirm Received */}
            {activePickup.status === 'picked' && (
              <div className="card mb-6">
                <h2 className="text-xl font-semibold mb-4">Confirm Receipt</h2>
                <button
                  onClick={handleConfirmReceived}
                  className="btn-primary w-full inline-flex items-center justify-center"
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Confirm Received
                </button>
              </div>
            )}

            {/* Rating Form */}
            {activePickup.status === 'delivered' && !activePickup.rating && (
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Rate Volunteer</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{rating} / 5</span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                      Comment (optional)
                    </label>
                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Share your experience..."
                    />
                  </div>
                  <button onClick={handleSubmitRating} className="btn-primary">
                    Submit Rating
                  </button>
                </div>
              </div>
            )}

            {activePickup.rating && (
              <div className="card">
                <h2 className="text-xl font-semibold mb-2">Your Rating</h2>
                <RatingStars rating={activePickup.rating} showValue />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
