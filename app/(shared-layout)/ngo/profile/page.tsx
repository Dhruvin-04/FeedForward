'use client'

import { Building2, Phone, FileText, MapPin } from 'lucide-react'
import Navbar from '@/components/web/Navbar'
import Sidebar from '@/components/web/Sidebar'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'

export default function NGOProfilePage() {
  const user = useQuery(api.ngoProfile.getNgoProfile)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="ngo" userName={user?.organizationName || "My Organization"} />
      <div className="flex">
        <Sidebar role="ngo" />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{user?.organizationName ?? 'Loading...'}</h2>
                  <p className="text-sm text-gray-500">NGO Organization</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{user?.phone ?? '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-900">{user?.address ?? '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Registration ID</p>
                    <p className="font-medium text-gray-900">{user?.registrationId ?? '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
