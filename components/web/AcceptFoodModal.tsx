'use client'

import { useState } from 'react'
import { X, Building2, Phone, User, FileText, Truck, Users } from 'lucide-react'
import { Button } from '../ui/button'

interface AcceptFoodModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AcceptFoodFormData) => void
  foodName: string
  defaultOrgName?: string
  isSubmitting?: boolean
}

export interface AcceptFoodFormData {
  contactPerson: string
  phone: string
  organizationName: string
  pickupNotes: string
  volunteerType: 'ngo' | 'platform'
  volunteerName: string
  volunteerPhone: string
}

export default function AcceptFoodModal({
  isOpen,
  onClose,
  onSubmit,
  foodName,
  defaultOrgName = '',
  isSubmitting = false,
}: AcceptFoodModalProps) {
  const [form, setForm] = useState<AcceptFoodFormData>({
    contactPerson: '',
    phone: '',
    organizationName: defaultOrgName,
    pickupNotes: '',
    volunteerType: 'platform',
    volunteerName: '',
    volunteerPhone: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof AcceptFoodFormData, string>>>({})

  if (!isOpen) return null

  const validate = (): boolean => {
    const newErrors: typeof errors = {}
    if (!form.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required'
    if (!form.phone.trim() || form.phone.length !== 10) newErrors.phone = 'Valid 10-digit phone required'
    if (!form.organizationName.trim()) newErrors.organizationName = 'Organization name is required'
    if (form.volunteerType === 'ngo') {
      if (!form.volunteerName.trim()) newErrors.volunteerName = 'Volunteer name is required'
      if (!form.volunteerPhone.trim() || form.volunteerPhone.length !== 10) newErrors.volunteerPhone = 'Valid 10-digit phone required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(form)
    }
  }

  const updateField = (field: keyof AcceptFoodFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Accept Food</h2>
            <p className="text-sm text-gray-500 mt-1">{foodName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* NGO Details Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">NGO Details</h3>
            <div className="space-y-3">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <User className="h-4 w-4" /> Contact Person
                </label>
                <input
                  type="text"
                  value={form.contactPerson}
                  onChange={(e) => updateField('contactPerson', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter contact person name"
                />
                {errors.contactPerson && <p className="text-red-500 text-xs mt-1">{errors.contactPerson}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Phone className="h-4 w-4" /> Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="10-digit phone number"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Building2 className="h-4 w-4" /> Organization Name
                </label>
                <input
                  type="text"
                  value={form.organizationName}
                  onChange={(e) => updateField('organizationName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                  placeholder="Organization name"
                  readOnly={!!defaultOrgName}
                />
                {errors.organizationName && <p className="text-red-500 text-xs mt-1">{errors.organizationName}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <FileText className="h-4 w-4" /> Pickup Notes <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  value={form.pickupNotes}
                  onChange={(e) => updateField('pickupNotes', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Any special instructions for pickup..."
                />
              </div>
            </div>
          </div>

          {/* Volunteer Option Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Volunteer Option</h3>
            <div className="space-y-3">
              {/* Option Cards */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateField('volunteerType', 'ngo')}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    form.volunteerType === 'ngo'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Users className={`h-5 w-5 mb-1 ${form.volunteerType === 'ngo' ? 'text-primary' : 'text-gray-400'}`} />
                  <p className="font-medium text-sm">Use NGO Volunteer</p>
                  <p className="text-xs text-gray-500">Assign your own volunteer</p>
                </button>

                <button
                  type="button"
                  onClick={() => updateField('volunteerType', 'platform')}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    form.volunteerType === 'platform'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Truck className={`h-5 w-5 mb-1 ${form.volunteerType === 'platform' ? 'text-primary' : 'text-gray-400'}`} />
                  <p className="font-medium text-sm">Platform Volunteer</p>
                  <p className="text-xs text-gray-500">Wait for a volunteer to accept</p>
                </button>
              </div>

              {/* NGO Volunteer Fields */}
              {form.volunteerType === 'ngo' && (
                <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Volunteer Name</label>
                    <input
                      type="text"
                      value={form.volunteerName}
                      onChange={(e) => updateField('volunteerName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter volunteer name"
                    />
                    {errors.volunteerName && <p className="text-red-500 text-xs mt-1">{errors.volunteerName}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Volunteer Phone</label>
                    <input
                      type="tel"
                      value={form.volunteerPhone}
                      onChange={(e) => updateField('volunteerPhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="10-digit phone number"
                    />
                    {errors.volunteerPhone && <p className="text-red-500 text-xs mt-1">{errors.volunteerPhone}</p>}
                  </div>
                </div>
              )}

              {form.volunteerType === 'platform' && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-sm text-amber-700">
                    The food item will be placed in <strong>Pending</strong> status and will appear in the Receiving tab
                    until a platform volunteer accepts the delivery.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 text-black">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Accept Food'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
