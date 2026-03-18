'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Navbar from '@/components/web/Navbar'
import Sidebar from '@/components/web/Sidebar'
import StatusBadge from '@/components/web/StatusBadge'
import { Package, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function CompletedDeliveriesPage() {
  const volunteerProfile = useQuery(api.volunteerProfile.getVolunteerProfile)
  const assignments = useQuery(api.pickups.getVolunteerAssignments) ?? []
  const completedPickups = assignments.filter(a => a.status === 'delivered')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="volunteer" userName={volunteerProfile?.userName || 'Volunteer'} />
      <div className="flex">
        <Sidebar role="volunteer" />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Completed Deliveries</h1>
              <p className="text-gray-500 mt-1">
                {completedPickups.length} delivery{completedPickups.length !== 1 ? 'ies' : 'y'} completed
              </p>
            </div>

            {completedPickups.length === 0 ? (
              <div className="text-center py-16">
                <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No completed deliveries yet</p>
                <Link href="/volunteer/pickups" className="text-green-600 hover:underline text-sm mt-2 inline-block">
                  Browse available pickups
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {completedPickups.map((pickup) => (
                  <Link key={pickup._id} href={`/volunteer/pickup/${pickup._id}`} className="block">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{pickup.foodName}</h3>
                          <p className="text-sm text-gray-500">
                            {pickup.donorName} → {pickup.ngoName}
                          </p>
                        </div>
                        <StatusBadge status={pickup.status} />
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-2">
                        {pickup.quantity && <span>Serves {pickup.quantity}</span>}
                        <span>{pickup.pickupLocation}</span>
                        {pickup.deliveredAt && (
                          <span suppressHydrationWarning>
                            Delivered: {new Date(pickup.deliveredAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
