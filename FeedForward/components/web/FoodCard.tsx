import { Clock, MapPin, Users, UtensilsCrossed } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { FoodListing } from '@/lib/mockData'
import { Button, buttonVariants } from '../ui/button'

interface FoodCardProps {
  listing: FoodListing
  showActions?: boolean
  onAccept?: () => void
  onViewMap?: () => void
}

export default function FoodCard({ listing, showActions = false, onAccept, onViewMap }: FoodCardProps) {
  return (
    <div className="card p-4 rounded-lg bg-white border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-md bg-linear-to-br from-green-50 to-green-100 flex items-center justify-center text-green-700">
          <UtensilsCrossed className="w-6 h-6" />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{listing.foodName}</h3>
              <p className="text-sm text-gray-600">{listing.businessName}</p>
            </div>
            <div className="ml-4 shrink-0">
              <StatusBadge status={listing.status} />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              <Users className="w-4 h-4" />
              <span>Serves {listing.quantity}</span>
            </span>

            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              <UtensilsCrossed className="w-4 h-4" />
              <span>{listing.category === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}</span>
            </span>

            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              <Clock className="w-4 h-4" />
              <span>Pickup: {listing.pickupWindow.openingTime} - {listing.pickupWindow.closingTime}</span>
            </span>

            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              <MapPin className="w-4 h-4" />
              <span className="truncate max-w-xs">{listing.location}</span>
            </span>
          </div>

          {listing.notes && (
            <p className="text-sm text-gray-600 mt-3 italic">{listing.notes}</p>
          )}

          {showActions && (
            <div className="flex items-center gap-4 mt-4 w-100">
              {listing.status === 'available' && onAccept && (
                <Button onClick={onAccept} className={`${buttonVariants({ variant: 'default' })} flex-1`}>
                  Accept Food
                </Button>
              )}
              {onViewMap && (
                <Button onClick={onViewMap} className={`${buttonVariants({ variant: 'outline' })} flex-1 text-black`}>
                    View on Map
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
