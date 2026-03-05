'use client'

import { Package, MapPin, Users, UtensilsCrossed, Phone, User, Clock, Navigation } from 'lucide-react'
import StatusBadge from './StatusBadge'
import DeliveryTimeline from './DeliveryTimeline'
import { Button } from '../ui/button'

export interface ReceivingItem {
  _id: string
  foodListingId: string
  foodName: string
  businessName: string
  donorName: string
  quantity?: number
  category: string
  pickupLocation: string
  pickupWindow?: { openingTime: string; closingTime: string }
  status: string
  volunteerType: string
  volunteerName?: string
  volunteerPhone?: string
  ngoContactPerson: string
  pickupCode?: string
  createdAt: string
  assignedAt?: string
  pickedAt?: string
  deliveredAt?: string
}

interface ReceivingCardProps {
  item: ReceivingItem
  onTrackMap?: () => void
}

export default function ReceivingCard({ item, onTrackMap }: ReceivingCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-linear-to-br from-green-50 to-green-100 flex items-center justify-center text-green-700">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{item.foodName}</h3>
              <p className="text-sm text-gray-500">{item.businessName}</p>
            </div>
          </div>
          <StatusBadge status={item.status} />
        </div>

        {/* Food Info Tags */}
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {item.quantity && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              <Users className="w-3 h-3" /> Serves {item.quantity}
            </span>
          )}
          {item.category && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              <UtensilsCrossed className="w-3 h-3" />
              {item.category === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            <MapPin className="w-3 h-3" /> {item.pickupLocation}
          </span>
          {item.pickupWindow && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              <Clock className="w-3 h-3" /> {item.pickupWindow.openingTime} - {item.pickupWindow.closingTime}
            </span>
          )}
        </div>
      </div>

      {/* Body - two columns on larger screens */}
      <div className="p-5 grid md:grid-cols-2 gap-5">
        {/* Volunteer Info */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Volunteer Details</h4>
          {item.status === 'pending' ? (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <p className="text-sm text-amber-700 font-medium">Waiting for volunteer to accept delivery</p>
              </div>
              <p className="text-xs text-amber-600 mt-1">A platform volunteer will pick this up soon.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900 font-medium">{item.volunteerName}</span>
              </div>
              {item.volunteerPhone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{item.volunteerPhone}</span>
                </div>
              )}
              {item.pickupCode && (
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    Pickup Code: <span className="font-mono font-bold text-primary">{item.pickupCode}</span>
                  </span>
                </div>
              )}
              {item.status === 'assigned' && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Clock className="h-4 w-4" />
                  <span>ETA: ~30-45 mins</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Timeline */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Delivery Timeline</h4>
          <DeliveryTimeline
            status={item.status}
            createdAt={item.createdAt}
            assignedAt={item.assignedAt}
            pickedAt={item.pickedAt}
            deliveredAt={item.deliveredAt}
          />
        </div>
      </div>

      {/* Footer Actions */}
      {(item.status === 'assigned' || item.status === 'picked_up' || item.status === 'on_the_way') && onTrackMap && (
        <div className="px-5 pb-5">
          <Button onClick={onTrackMap} variant="outline" className="w-full text-black">
            <Navigation className="h-4 w-4 mr-2" />
            Track on Map
          </Button>
        </div>
      )}
    </div>
  )
}
