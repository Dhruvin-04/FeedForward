'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { AlertCircle, Phone, User, MapPin } from 'lucide-react'

interface PickupAcceptanceModalProps {
  foodListing: any
  onSubmit: (details: { userName: string; phone: string; address: string }) => Promise<void>
  onCancel: () => void
}

export default function PickupAcceptanceModal({
  foodListing,
  onSubmit,
  onCancel,
}: PickupAcceptanceModalProps) {
  const [formData, setFormData] = useState({
    userName: '',
    phone: '',
    address: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.userName.trim()) {
      newErrors.userName = 'Name is required'
    } else if (formData.userName.length < 3) {
      newErrors.userName = 'Name must be at least 3 characters'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    } else if (formData.address.length < 5) {
      newErrors.address = 'Please provide a valid address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors({
        submit: 'Failed to submit details. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Volunteer Information</CardTitle>
        <CardDescription>
          Please provide your contact details. The NGO will use this to contact you and assign your
          pickup code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Food Listing Summary */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600 mb-2">Picking up:</p>
            <h3 className="font-semibold text-lg text-gray-900">{foodListing.foodName}</h3>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <p>
                <span className="text-gray-600">From:</span> {foodListing.businessName}
              </p>
              {foodListing.quantity && (
                <p>
                  <span className="text-gray-600">Serves:</span> {foodListing.quantity} people
                </p>
              )}
            </div>
          </div>

          {/* Alert */}
          {errors.submit && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div className="ml-3">
                <p className="text-sm text-red-900">{errors.submit}</p>
              </div>
            </Alert>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <Label htmlFor="userName" className="text-gray-700 font-medium">
                <User className="inline w-4 h-4 mr-2" />
                Full Name
              </Label>
              <Input
                id="userName"
                name="userName"
                type="text"
                placeholder="Enter your full name"
                value={formData.userName}
                onChange={handleInputChange}
                disabled={isLoading}
                className={errors.userName ? 'border-red-500' : ''}
              />
              {errors.userName && <p className="text-red-600 text-sm mt-1">{errors.userName}</p>}
            </div>

            {/* Phone Field */}
            <div>
              <Label htmlFor="phone" className="text-gray-700 font-medium">
                <Phone className="inline w-4 h-4 mr-2" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your 10-digit phone number"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                  setFormData((prev) => ({
                    ...prev,
                    phone: value,
                  }))
                  if (errors.phone) {
                    setErrors((prev) => {
                      const newErrors = { ...prev }
                      delete newErrors.phone
                      return newErrors
                    })
                  }
                }}
                disabled={isLoading}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Address Field */}
            <div>
              <Label htmlFor="address" className="text-gray-700 font-medium">
                <MapPin className="inline w-4 h-4 mr-2" />
                Delivery Address
              </Label>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="Enter your delivery address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={isLoading}
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
            </div>
          </div>

          {/* Info Alert */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-blue-900">
                Your information will be shared with the NGO to verify your pickup and ensure safe
                food delivery.
              </p>
            </div>
          </Alert>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? 'Submitting...' : 'Submit & Get Pickup Code'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
