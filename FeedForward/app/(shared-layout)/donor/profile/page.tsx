'use client'

import { useState } from 'react'
import { UserCircle, Mail, Phone, Building2, MapPin, Package, UtensilsCrossed, Pencil, X, Check } from 'lucide-react'
import Navbar from '@/components/web/Navbar'
import Sidebar from '@/components/web/Sidebar'
import { api } from '@/convex/_generated/api'
import { useQuery, useMutation } from 'convex/react'

export default function DonorProfilePage() {
  const profile = useQuery(api.donorProfile.getDonorProfile)
  const updateProfile = useMutation(api.donorProfile.updateDonorProfile)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    businessName: '',
    address: '',
    phone: '',
    fssaiNumber: '',
  })
  const [saving, setSaving] = useState(false)

  const startEdit = () => {
    if (!profile) return
    setForm({
      businessName: profile.businessName,
      address: profile.address,
      phone: profile.phone,
      fssaiNumber: profile.fssaiNumber,
    })
    setEditing(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile(form)
      setEditing(false)
    } catch (err) {
      console.error('Failed to update profile:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="donor" userName={profile?.businessName || 'Donor'} />
      <div className="flex">
        <Sidebar role="donor" />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

            {!profile ? (
              <div className="card text-center py-12 text-gray-500">Loading profile...</div>
            ) : editing ? (
              /* Edit Mode */
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
                  <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business / Restaurant Name</label>
                    <input
                      type="text"
                      value={form.businessName}
                      onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">FSSAI Number</label>
                    <input
                      type="text"
                      value={form.fssaiNumber}
                      onChange={(e) => setForm({ ...form, fssaiNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-primary inline-flex items-center"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="space-y-6">
                {/* Profile Card */}
                <div className="card">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <UserCircle className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{profile.businessName}</h2>
                        <p className="text-sm text-gray-500">Donor</p>
                      </div>
                    </div>
                    <button
                      onClick={startEdit}
                      className="btn-primary inline-flex items-center text-sm"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-900">{profile.email || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm font-medium text-gray-900">{profile.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Building2 className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">FSSAI Number</p>
                        <p className="text-sm font-medium text-gray-900">{profile.fssaiNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="text-sm font-medium text-gray-900">{profile.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Donation Stats Card */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Statistics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-lg">
                      <Package className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold text-green-700">{profile.totalDonations}</p>
                        <p className="text-sm text-green-600">Total Donations</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                      <UtensilsCrossed className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold text-blue-700">{profile.totalMealsDonated}</p>
                        <p className="text-sm text-blue-600">Meals Donated</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
