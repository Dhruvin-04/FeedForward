'use client'

import Link from 'next/link'
import { Package, MapPin, Clock, ArrowRight, UtensilsCrossed, Users, Phone, User } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { Button } from '../ui/button'

export interface PickupCardData {
  _id: string
  foodName: string
  businessName: string
  donorName: string
  ngoName: string
  quantity?: number
  category: string
  pickupLocation: string
  pickupWindow?: { openingTime: string; closingTime: string }
  pickupCode?: string
  status: string
  volunteerName?: string
  createdAt: string
  assignedAt?: string
  pickedAt?: string
  deliveredAt?: string
}

interface PickupCardProps {
  pickup: PickupCardData
  showAcceptButton?: boolean
  onAccept?: () => void
}

export default function PickupCard({ pickup, showAcceptButton = false, onAccept }: PickupCardProps) {
  const isActive = pickup.status !== 'delivered'

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-linear-to-br from-green-50 to-green-100 flex items-center justify-center text-green-700">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{pickup.foodName}</h3>
            <p className="text-sm text-gray-500">
              {pickup.donorName} → {pickup.ngoName}
            </p>
          </div>
        </div>
        <StatusBadge status={pickup.status} />
      </div>

      {/* Info tags */}
      <div className="flex flex-wrap gap-2 text-xs mb-3">
        {pickup.quantity && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            <Users className="w-3 h-3" /> Serves {pickup.quantity}
          </span>
        )}
        {pickup.category && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            <UtensilsCrossed className="w-3 h-3" />
            {pickup.category === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
          </span>
        )}
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700">
          <MapPin className="w-3 h-3" /> {pickup.pickupLocation}
        </span>
        {pickup.pickupWindow && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            <Clock className="w-3 h-3" /> {pickup.pickupWindow.openingTime} - {pickup.pickupWindow.closingTime}
          </span>
        )}
      </div>

      {/* Pickup code */}
      {pickup.pickupCode && isActive && (
        <div className="flex items-center gap-2 mb-4 p-2 bg-green-50 border border-green-200 rounded-lg">
          <Package className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">Pickup Code:</span>
          <span className="font-mono font-bold text-green-700 tracking-wider">{pickup.pickupCode}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {showAcceptButton && onAccept ? (
          <Button onClick={onAccept} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
            Accept Pickup
          </Button>
        ) : (
          <Link
            href={`/volunteer/pickup/${pickup._id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            View Details <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  )
}
