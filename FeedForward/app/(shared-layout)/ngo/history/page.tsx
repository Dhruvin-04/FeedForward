'use client'

import { useMemo } from 'react'
import { Package, Clock, CheckCircle2, UtensilsCrossed, MapPin, Users } from 'lucide-react'
import Navbar from '@/components/web/Navbar'
import Sidebar from '@/components/web/Sidebar'
import StatusBadge from '@/components/web/StatusBadge'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'

export default function NGOHistoryPage() {
  const user = useQuery(api.ngoProfile.getNgoProfile)
  const ngoPickups = useQuery(api.pickups.getNgoPickups)

  const deliveredItems = useMemo(() => {
    if (!Array.isArray(ngoPickups)) return []
    return ngoPickups
      .filter(p => p.status === 'delivered')
      .sort((a, b) => new Date(b.deliveredAt ?? b.createdAt).getTime() - new Date(a.deliveredAt ?? a.createdAt).getTime())
  }, [ngoPickups])

  const totalMeals = deliveredItems.reduce((sum, item) => sum + (item.quantity ?? 0), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="ngo" userName={user?.organizationName || "My Organization"} />
      <div className="flex">
        <Sidebar role="ngo" />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Delivery History</h1>
              <p className="text-gray-500 mt-1">Past food deliveries received by your organization</p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl border p-4">
                <p className="text-sm text-gray-500">Total Deliveries</p>
                <p className="text-2xl font-bold text-gray-900">{deliveredItems.length}</p>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <p className="text-sm text-gray-500">Total Meals Received</p>
                <p className="text-2xl font-bold text-gray-900">{totalMeals}</p>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <p className="text-sm text-gray-500">Unique Donors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(deliveredItems.map(i => i.donorName)).size}
                </p>
              </div>
            </div>

            {/* History List */}
            {deliveredItems.length > 0 ? (
              <div className="space-y-3">
                {deliveredItems.map((item) => (
                  <div key={item._id} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.foodName}</h3>
                          <p className="text-sm text-gray-500">{item.businessName}</p>
                        </div>
                      </div>
                      <StatusBadge status="delivered" />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600">
                      {item.quantity && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> Serves {item.quantity}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {item.pickupLocation}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Delivered: {item.deliveredAt ? new Date(item.deliveredAt).toLocaleDateString() : 'N/A'}
                      </span>
                      {item.volunteerName && (
                        <span className="flex items-center gap-1">
                          <UtensilsCrossed className="w-3 h-3" /> Volunteer: {item.volunteerName}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 text-center py-16">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No History Yet</h2>
                <p className="text-gray-600">Completed deliveries will appear here.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
