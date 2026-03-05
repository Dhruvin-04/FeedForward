'use client'

import dynamic from 'next/dynamic'
import { X, MapPin, Store, Building2, Bike } from 'lucide-react'
import { useMemo } from 'react'
import type { LiveLocation } from './LiveMap'

const LiveMap = dynamic(() => import('./LiveMap'), { ssr: false })

interface MapTrackingModalProps {
  isOpen: boolean
  onClose: () => void
  donorLocation?: { lat: number; lng: number; label?: string }
  ngoLocation?: { lat: number; lng: number; label?: string }
  volunteerLocation?: { lat: number; lng: number; label?: string }
  foodName: string
  status: string
}

export default function MapTrackingModal({
  isOpen,
  onClose,
  donorLocation,
  ngoLocation,
  volunteerLocation,
  foodName,
  status,
}: MapTrackingModalProps) {
  if (!isOpen) return null

  const locations = useMemo<LiveLocation[]>(() => {
    const locs: LiveLocation[] = []
    if (donorLocation) {
      locs.push({
        userId: 'donor',
        lat: donorLocation.lat,
        lng: donorLocation.lng,
        role: 'donor',
        label: donorLocation.label ?? 'Donor',
      })
    }
    if (ngoLocation) {
      locs.push({
        userId: 'ngo',
        lat: ngoLocation.lat,
        lng: ngoLocation.lng,
        role: 'ngo',
        label: ngoLocation.label ?? 'NGO (You)',
      })
    }
    if (volunteerLocation) {
      locs.push({
        userId: 'volunteer',
        lat: volunteerLocation.lat,
        lng: volunteerLocation.lng,
        role: 'volunteer',
        label: volunteerLocation.label ?? 'Volunteer',
      })
    }
    return locs
  }, [donorLocation, ngoLocation, volunteerLocation])

  const center = useMemo(() => {
    if (volunteerLocation) return { lat: volunteerLocation.lat, lng: volunteerLocation.lng }
    if (donorLocation) return { lat: donorLocation.lat, lng: donorLocation.lng }
    if (ngoLocation) return { lat: ngoLocation.lat, lng: ngoLocation.lng }
    return { lat: 18.9774, lng: 72.835 }
  }, [donorLocation, ngoLocation, volunteerLocation])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Track Delivery</h2>
            <p className="text-sm text-gray-500">{foodName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Map */}
        <div className="h-100">
          <LiveMap locations={locations} center={center} height="h-full" />
        </div>

        {/* Legend */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-50 border-2 border-red-400 flex items-center justify-center">
                <Store className="w-3 h-3 text-red-500" />
              </div>
              <span className="text-gray-600">Donor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-50 border-2 border-blue-400 flex items-center justify-center">
                <Building2 className="w-3 h-3 text-blue-500" />
              </div>
              <span className="text-gray-600">NGO (You)</span>
            </div>
            {volunteerLocation && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-50 border-2 border-green-400 flex items-center justify-center">
                  <Bike className="w-3 h-3 text-green-500" />
                </div>
                <span className="text-gray-600">Volunteer</span>
              </div>
            )}
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              status === 'assigned' ? 'bg-purple-100 text-purple-700' :
              status === 'picked_up' ? 'bg-yellow-100 text-yellow-700' :
              status === 'on_the_way' ? 'bg-orange-100 text-orange-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              Status: {status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
