'use client'

import React, { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import PickupCard from '@/components/web/PickupCard'
import PickupDetailsDownload from '@/components/web/PickupDetailsDownload'
import Navbar from '@/components/web/Navbar'
import Sidebar from '@/components/web/Sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import {
  CheckCircle, Package, MapPin, Clock, Copy, User, Phone, Truck, FileText, X,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

type FlowStep = 'browse' | 'accept' | 'success'

export default function VolunteerPickupsPage() {
  const [step, setStep] = useState<FlowStep>('browse')
  const [selectedPickup, setSelectedPickup] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [acceptResult, setAcceptResult] = useState<{ pickupCode?: string; pickupId?: string } | null>(null)

  // Form state
  const [form, setForm] = useState({ volunteerName: '', phone: '', vehicleType: '', notes: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const volunteerProfile = useQuery(api.volunteerProfile.getVolunteerProfile)
  const pendingPickups = useQuery(api.pickups.getPendingPickups) ?? []
  const assignVolunteer = useMutation(api.pickups.assignVolunteerToFood)

  // Pre-fill form from profile
  React.useEffect(() => {
    if (volunteerProfile) {
      setForm(f => ({
        ...f,
        volunteerName: f.volunteerName || volunteerProfile.userName || '',
        phone: f.phone || volunteerProfile.phone || '',
      }))
    }
  }, [volunteerProfile])

  const handleAcceptClick = (pickup: any) => {
    setSelectedPickup(pickup)
    setStep('accept')
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.volunteerName.trim() || form.volunteerName.length < 3) e.volunteerName = 'Name must be at least 3 characters'
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit phone'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmitAccept = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || !selectedPickup) return

    setSubmitting(true)
    try {
      const result = await assignVolunteer({
        pickupId: selectedPickup._id,
        volunteerName: form.volunteerName,
        volunteerPhone: form.phone,
        vehicleType: form.vehicleType || undefined,
        notes: form.notes || undefined,
      })
      setAcceptResult(result)
      setStep('success')
      toast.success('Pickup accepted!')
    } catch (err: any) {
      toast.error(err?.data ?? 'Failed to accept pickup')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setStep('browse')
    setSelectedPickup(null)
    setAcceptResult(null)
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="volunteer" userName={volunteerProfile?.userName || 'Volunteer'} />
      <div className="flex">
        <Sidebar role="volunteer" />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Live Pickups</h1>
              <p className="text-gray-500 mt-1">Accept pending food pickup requests from NGOs</p>
            </div>

            {/* ── Browse Step ── */}
            {step === 'browse' && (
              <>
                {pendingPickups.length === 0 ? (
                  <div className="text-center py-16">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No pending pickups right now</p>
                    <p className="text-gray-400 text-sm mt-2">Check back soon — NGOs post new requests regularly.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {pendingPickups.map((pickup: any) => (
                      <PickupCard
                        key={pickup._id}
                        pickup={pickup}
                        showAcceptButton
                        onAccept={() => handleAcceptClick(pickup)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── Accept Step (modal-like card) ── */}
            {step === 'accept' && selectedPickup && (
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Accept Pickup</CardTitle>
                      <CardDescription>Provide your details to accept this pickup</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleReset}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Pickup summary */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                    <h3 className="font-semibold text-lg text-gray-900">{selectedPickup.foodName}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      From: {selectedPickup.businessName} &bull; {selectedPickup.pickupLocation}
                    </p>
                    {selectedPickup.pickupWindow && (
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {selectedPickup.pickupWindow.openingTime} - {selectedPickup.pickupWindow.closingTime}
                      </p>
                    )}
                  </div>

                  <form onSubmit={handleSubmitAccept} className="space-y-4">
                    <div>
                      <Label htmlFor="volunteerName">
                        <User className="inline w-4 h-4 mr-1" /> Full Name *
                      </Label>
                      <Input
                        id="volunteerName"
                        value={form.volunteerName}
                        onChange={e => setForm(f => ({ ...f, volunteerName: e.target.value }))}
                        className={errors.volunteerName ? 'border-red-500' : ''}
                      />
                      {errors.volunteerName && <p className="text-red-600 text-xs mt-1">{errors.volunteerName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone">
                        <Phone className="inline w-4 h-4 mr-1" /> Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <Label htmlFor="vehicleType">
                        <Truck className="inline w-4 h-4 mr-1" /> Vehicle Type (optional)
                      </Label>
                      <Input
                        id="vehicleType"
                        placeholder="e.g. Bike, Car, Van"
                        value={form.vehicleType}
                        onChange={e => setForm(f => ({ ...f, vehicleType: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">
                        <FileText className="inline w-4 h-4 mr-1" /> Notes (optional)
                      </Label>
                      <Input
                        id="notes"
                        placeholder="Any special notes"
                        value={form.notes}
                        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button type="button" variant="outline" className="flex-1" onClick={handleReset}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={submitting} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                        {submitting ? <Spinner className="h-4 w-4" /> : 'Confirm Accept'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* ── Success Step ── */}
            {step === 'success' && acceptResult && selectedPickup && (
              <div className="max-w-2xl mx-auto space-y-6">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6 text-center">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-green-900 mb-2">Pickup Assigned!</h2>
                    <p className="text-green-800">Show this code to the donor when you arrive.</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-500">
                  <CardHeader className="bg-linear-to-r from-green-50 to-green-100">
                    <CardTitle>Your Pickup Code</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-8 text-center">
                    <div className="inline-block px-8 py-6 bg-gray-50 border-2 border-green-500 rounded-lg">
                      <p className="text-4xl font-mono font-bold text-green-600 tracking-wider">
                        {acceptResult.pickupCode}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-center gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(acceptResult.pickupCode ?? '')
                          toast.success('Copied!')
                        }}
                      >
                        <Copy className="w-4 h-4 mr-2" /> Copy Code
                      </Button>
                      <PickupDetailsDownload
                        pickup={{
                          pickupCode: acceptResult.pickupCode,
                          foodName: selectedPickup.foodName,
                          quantity: selectedPickup.quantity,
                          category: selectedPickup.category,
                          donorName: selectedPickup.donorName,
                          donorPhone: '',
                          donorAddress: selectedPickup.pickupLocation,
                          ngoName: selectedPickup.ngoName ?? '',
                          ngoPhone: selectedPickup.ngoPhone ?? '',
                          ngoAddress: '',
                          pickupLocation: selectedPickup.pickupLocation,
                          pickupWindow: selectedPickup.pickupWindow,
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={handleReset}>
                    Back to Pickups
                  </Button>
                  <Link
                    href={`/volunteer/pickup/${acceptResult.pickupId}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    View Pickup
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
