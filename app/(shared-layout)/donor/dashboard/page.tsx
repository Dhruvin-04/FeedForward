import Link from 'next/link'
import { Package, TrendingUp, Star, Plus } from 'lucide-react'
import Navbar from '@/components/web/Navbar'
import Sidebar from '@/components/web/Sidebar'
import StatCard from '@/components/web/StatCard'
import StatusBadge from '@/components/web/StatusBadge'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { getToken } from '@/lib/auth-server'

export default async function DonorDashboard() {

  const token = await getToken()
  
  const listings = await fetchQuery(api.foodList.getFoodList, {}, {token})
  const donorProfile = await fetchQuery(api.donorProfile.getDonorProfile, {}, {token})

  const filteredListings = Array.isArray(listings) ? listings.filter(l => l !== undefined) : []
  
  const stats = {
    totalDonated: filteredListings.length,
    activeListings: filteredListings.filter(l => l?.status === 'available' || l?.status === 'reserved').length,
    mealsServed: filteredListings.reduce((sum, l) => sum + (l?.status === 'delivered' ? (l?.quantity || 0) : 0), 0),
    rating: 4.8,
  }  

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="donor" userName={donorProfile?.businessName || "Donor"} />
      <div className="flex">
        <Sidebar role="donor" />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <Link href="/donor/new" className="btn-primary inline-flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Post New Donation
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Food Donated"
                value={stats.totalDonated}
                icon={Package}
                iconColor="primary"
              />
              <StatCard
                title="Active Listings"
                value={stats.activeListings}
                icon={TrendingUp}
                iconColor="secondary"
              />
              <StatCard
                title="Meals Served"
                value={stats.mealsServed}
                icon={Package}
                iconColor="primary"
              />
              <StatCard
                title="Rating Score"
                value={stats.rating}
                icon={Star}
                iconColor="secondary"
                trend={{ value: '+0.2 this month', isPositive: true }}
              />
            </div>

            {/* Past Food Listings Table */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Past Food Listings</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Food Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Quantity</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Pickup Window</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(listings) && filteredListings.length > 0 ? filteredListings.map((listing) => (
                      <tr key={listing?._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{listing?.foodName}</div>
                          <div className="text-sm text-gray-500">{listing?.category === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{listing?.quantity} servings</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{listing?.pickupWindow.openingTime} - {listing?.pickupWindow.closingTime}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={ 'available'} />
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {new Date(listing? listing._creationTime: '').toLocaleDateString()}
                        </td>
                      </tr>
                    )) : <tr><td colSpan={5} className="py-3 px-4 text-center text-gray-500">No donations yet. <Link href="/donor/new" className="text-blue-600 hover:underline">Post your first donation</Link></td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
