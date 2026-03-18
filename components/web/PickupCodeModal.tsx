'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import {
  CheckCircle,
  Copy,
  Clock,
  MapPin,
  AlertCircle,
  Download,
  Share2,
} from 'lucide-react'
import { toast } from 'sonner'

interface PickupCodeModalProps {
  pickup: {
    _id: string
    foodListingId: string
    pickupCode?: string
    status: string
    createdAt: string
    acceptedAt?: string
  }
  foodListing: any
  onComplete: () => void
}

export default function PickupCodeModal({
  pickup,
  foodListing,
  onComplete,
}: PickupCodeModalProps) {
  const handleCopyCode = () => {
    if (pickup.pickupCode) {
      navigator.clipboard.writeText(pickup.pickupCode)
      toast.success('Pickup code copied to clipboard!')
    }
  }

  const handleDownloadDetails = () => {
    // Create a text document with pickup details
    const details = `
FeedForward PICKUP DETAILS
==========================

Pickup Code: ${pickup.pickupCode}
Status: ${pickup.status}
Date: ${new Date(pickup.createdAt).toLocaleString()}

FOOD DETAILS:
- Item: ${foodListing.foodName}
- Category: ${foodListing.category === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
- Quantity: ${foodListing.quantity || 'Not specified'} servings
- From: ${foodListing.businessName}

PICKUP LOCATION: ${foodListing.location}
Pickup Window: ${foodListing.pickupWindow.openingTime} - ${foodListing.pickupWindow.closingTime}

IMPORTANT INSTRUCTIONS:
1. Arrive during the specified pickup window
2. Bring this document or have your pickup code ready
3. Share your code with the food donor
4. Collect the food carefully
5. Deliver to the designated NGO beneficiaries

Thank you for volunteering with FeedForward!
    `

    const element = document.createElement('a')
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(details)
    )
    element.setAttribute('download', `pickup_${pickup.pickupCode}.txt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('Pickup details downloaded!')
  }

  const handleShare = () => {
    const shareText = `I'm volunteering to pick up ${foodListing.foodName} from ${foodListing.businessName} with FeedForward! Pickup Code: ${pickup.pickupCode}`

    if (navigator.share) {
      navigator
        .share({
          title: 'FeedForward Pickup',
          text: shareText,
        })
        .catch((err) => console.log('Error sharing:', err))
    } else {
      navigator.clipboard.writeText(shareText)
      toast.success('Share text copied to clipboard!')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Card */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-900 mb-2">Pickup Confirmed!</h2>
            <p className="text-green-800">
              Your pickup request has been accepted. The NGO has assigned you a pickup code.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pickup Code Display */}
      <Card className="border-2 border-green-500">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
          <CardTitle>Your Pickup Code</CardTitle>
          <CardDescription>Save this code - you'll need it at pickup</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3 font-medium">PICKUP CODE</p>
            <div className="inline-block px-8 py-6 bg-gray-50 border-2 border-green-500 rounded-lg">
              <p className="text-4xl font-mono font-bold text-green-600 tracking-wider">
                {pickup.pickupCode}
              </p>
            </div>
            <Button
              onClick={handleCopyCode}
              variant="outline"
              className="mt-4 w-full sm:w-auto"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pickup Details */}
      <Card>
        <CardHeader>
          <CardTitle>Pickup Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Food Item */}
          <div className="pb-4 border-b">
            <p className="text-sm text-gray-600 mb-1">Food Item</p>
            <p className="text-lg font-semibold text-gray-900">{foodListing.foodName}</p>
            <p className="text-sm text-gray-600 mt-1">From: {foodListing.businessName}</p>
          </div>

          {/* Location & Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Pickup Location
              </p>
              <p className="font-medium text-gray-900">{foodListing.location}</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Pickup Window
              </p>
              <p className="font-medium text-gray-900">
                {foodListing.pickupWindow.openingTime} - {foodListing.pickupWindow.closingTime}
              </p>
            </div>
          </div>

          {/* Quantity */}
          {foodListing.quantity && (
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-sm text-gray-600 mb-1">Quantity</p>
              <p className="font-semibold text-gray-900">{foodListing.quantity} servings</p>
            </div>
          )}

          {/* Notes */}
          {foodListing.notes && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Special Notes</p>
              <p className="text-gray-900">{foodListing.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle>What to Do Next</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            <li className="flex gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 font-semibold text-sm shrink-0">
                1
              </span>
              <span className="text-gray-700">
                <strong>Save or Download</strong> your pickup code and details
              </span>
            </li>
            <li className="flex gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 font-semibold text-sm shrink-0">
                2
              </span>
              <span className="text-gray-700">
                <strong>Arrive On Time</strong> within the pickup window
              </span>
            </li>
            <li className="flex gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 font-semibold text-sm shrink-0">
                3
              </span>
              <span className="text-gray-700">
                <strong>Show Your Code</strong> to the food donor staff
              </span>
            </li>
            <li className="flex gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 font-semibold text-sm shrink-0">
                4
              </span>
              <span className="text-gray-700">
                <strong>Collect & Deliver</strong> the food to beneficiaries safely
              </span>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Alert className="bg-red-50 border-red-200">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <div className="ml-3">
          <p className="text-sm font-semibold text-red-900 mb-1">Important</p>
          <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
            <li>Arrive exactly within the pickup window to ensure food quality</li>
            <li>Keep the food properly stored during delivery</li>
            <li>Contact the NGO immediately if you face any issues</li>
          </ul>
        </div>
      </Alert>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleDownloadDetails}
          variant="outline"
          className="flex-1"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Details
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          className="flex-1"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button
          onClick={onComplete}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          Done
        </Button>
      </div>
    </div>
  )
}
