'use client'

import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import FoodCard from '@/components/web/FoodCard'
import PickupAcceptanceModal from '@/components/web/PickupAcceptanceModal'
import PickupCodeModal from '@/components/web/PickupCodeModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { AlertCircle, CheckCircle, Package, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'

interface PickupState {
  _id: string
  foodListingId: string
  volunteerId: string
  volunteerName: string
  pickupCode?: string
  status: string
  createdAt: string
  acceptedAt?: string
}

export default function VolunteerPickupsPage() {
  const [activeStep, setActiveStep] = useState<'browse' | 'accept' | 'details' | 'pickupCode'>('browse')
  const [selectedFoodListing, setSelectedFoodListing] = useState<any>(null)
  const [volunteerDetails, setVolunteerDetails] = useState<any>(null)
  const [activePickup, setActivePickup] = useState<PickupState | null>(null)
  const [showDetailsForm, setShowDetailsForm] = useState(false)
  const [showPickupCode, setShowPickupCode] = useState(false)

  // Query available food listings accepted by NGOs
  const availableFoodListings = useQuery(api.foodList.getAvailableFoodListings) || []
  
  // Query volunteer's pickups
  const volunteerPickups = useQuery(api.pickups?.getVolunteerPickups) || []

  // Mutations
  const acceptPickup = useMutation(api.pickups?.acceptPickup)
  const submitVolunteerDetails = useMutation(api.volunteerProfile.updateVolunteerProfile)
  const assignPickupCode = useMutation(api.pickups?.assignPickupCode)

  const handleAcceptFood = (foodListing: any) => {
    setSelectedFoodListing(foodListing)
    setActiveStep('accept')
  }

  const handleConfirmAcceptance = async () => {
    try {
      if (!selectedFoodListing) return

      const pickup = await acceptPickup({
        foodListingId: selectedFoodListing._id,
        donorId: selectedFoodListing.donorId,
      })

      setActivePickup(pickup)
      setShowDetailsForm(true)
      setActiveStep('details')
    } catch (error) {
      console.error('Error accepting pickup:', error)
    }
  }

  const handleSubmitDetails = async (details: any) => {
    try {
      await submitVolunteerDetails({
        userName: details.userName,
        phone: details.phone,
        address: details.address,
      })

      // Generate pickup code
      if (!activePickup?._id) {
        throw new Error('Pickup ID is missing')
      }
      const pickupCodeData = await assignPickupCode({
        pickupId: activePickup._id,
      })

      setActivePickup({
        ...activePickup,
        pickupCode: pickupCodeData.pickupCode,
        status: 'assigned',
      })

      setShowDetailsForm(false)
      setShowPickupCode(true)
      setActiveStep('pickupCode')
    } catch (error) {
      console.error('Error submitting details:', error)
    }
  }

  const handleResetFlow = () => {
    setActiveStep('browse')
    setSelectedFoodListing(null)
    setShowDetailsForm(false)
    setShowPickupCode(false)
    setActivePickup(null)
  }

  const filterListingsByNgoAcceptance = (listings: any[]) => {
    // Filter listings where status is 'available' and not yet picked up
    return listings.filter(
      (listing) => listing.status === 'available' && !listing.volunteerId
    )
  }

  const filteredListings = filterListingsByNgoAcceptance(availableFoodListings)

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Volunteer Pickups</h1>
          <p className="text-gray-600">Help distribute surplus food to those in need</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            {['browse', 'accept', 'details', 'pickupCode'].map((step, index) => (
              <React.Fragment key={step}>
                <div
                  className={`flex flex-col items-center gap-2 ${
                    step === activeStep ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                      ['browse', 'accept', 'details', 'pickupCode'].indexOf(step) <
                      ['browse', 'accept', 'details', 'pickupCode'].indexOf(activeStep)
                        ? 'bg-green-500 text-white'
                        : step === activeStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs md:text-sm font-medium capitalize text-center">
                    {step === 'pickupCode' ? 'Pickup Code' : step}
                  </span>
                </div>

                {index < 3 && (
                  <div
                    className={`flex-1 h-1 mb-6 ${
                      ['browse', 'accept', 'details', 'pickupCode'].indexOf(step) <
                      ['browse', 'accept', 'details', 'pickupCode'].indexOf(activeStep)
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Step 1: Browse Available Food */}
          {activeStep === 'browse' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Available Food Pickups
              </h2>

              {filteredListings.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No available pickups at the moment</p>
                  <p className="text-gray-400 text-sm mt-2">Check back later for more food listings</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredListings.map((listing) => (
                    <div key={listing._id} className="hover:shadow-md transition-shadow">
                      <FoodCard
                        listing={listing}
                        showActions={true}
                        onAccept={() => handleAcceptFood(listing)}
                        onViewMap={() => {
                          // TODO: Implement map view
                          console.log('View map for:', listing.location)
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* My Pickups Section */}
              {volunteerPickups && volunteerPickups.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    My Pickups
                  </h2>
                  <div className="grid gap-4">
                    {volunteerPickups.map((pickup: PickupState) => (
                      <Card key={pickup._id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>Pickup #{pickup._id}</CardTitle>
                              <CardDescription>
                                Status: <span className="font-semibold capitalize">{pickup.status}</span>
                              </CardDescription>
                            </div>
                            {pickup.pickupCode && (
                              <div className="text-right">
                                <p className="text-xs text-gray-500">Pickup Code</p>
                                <p className="text-lg font-mono font-bold text-green-600">
                                  {pickup.pickupCode}
                                </p>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            {pickup.acceptedAt && (
                              <p>Accepted: {new Date(pickup.acceptedAt).toLocaleString()}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Accept Food - Confirmation */}
          {activeStep === 'accept' && selectedFoodListing && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Confirm Pickup
              </h2>

              <Card>
                <CardHeader>
                  <CardTitle>Review Food Details</CardTitle>
                  <CardDescription>Please confirm the details before accepting</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FoodCard listing={selectedFoodListing} showActions={false} />

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">Pickup Location</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {selectedFoodListing.location}
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">Pickup Window</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {selectedFoodListing.pickupWindow.openingTime} -{' '}
                        {selectedFoodListing.pickupWindow.closingTime}
                      </p>
                    </div>
                  </div>

                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-amber-900">
                        You will need to provide your contact details in the next step
                      </p>
                      <p className="text-xs text-amber-800 mt-1">
                        The NGO will use this to assign your pickup code
                      </p>
                    </div>
                  </Alert>

                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActiveStep('browse')
                        setSelectedFoodListing(null)
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleConfirmAcceptance}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Accept & Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Volunteer Details Form */}
          {activeStep === 'details' && showDetailsForm && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Your Contact Information
              </h2>

              <PickupAcceptanceModal
                foodListing={selectedFoodListing}
                onSubmit={handleSubmitDetails}
                onCancel={() => {
                  setActiveStep('browse')
                  setShowDetailsForm(false)
                  setSelectedFoodListing(null)
                }}
              />
            </div>
          )}

          {/* Step 4: Pickup Code */}
          {activeStep === 'pickupCode' && showPickupCode && activePickup && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Pickup Code Assigned
              </h2>

              <PickupCodeModal
                pickup={activePickup}
                foodListing={selectedFoodListing}
                onComplete={handleResetFlow}
              />
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Browse available food pickups</li>
                  <li>Accept a pickup that matches your schedule</li>
                  <li>Fill in your contact details</li>
                  <li>Receive pickup code from NGO</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pickup Process</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <ul className="space-y-2">
                  <li>✓ Arrive during pickup window</li>
                  <li>✓ Share your pickup code</li>
                  <li>✓ Collect the food</li>
                  <li>✓ Deliver to NGO beneficiaries</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact Support</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <p className="mb-3">Need assistance?</p>
                <p>Email: <span className="font-semibold">support@mealbridge.com</span></p>
                <p>Phone: <span className="font-semibold">1-800-MEAL-BRIDGE</span></p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
