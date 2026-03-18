import { MapPin } from 'lucide-react'

interface MapPlaceholderProps {
  location?: string
  height?: string
}

export default function MapPlaceholder({ location, height = 'h-64' }: MapPlaceholderProps) {
  return (
    <div className={`${height} bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden`}>
      <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-gray-200"></div>
      <div className="relative z-10 text-center">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Map View</p>
        {location && <p className="text-xs text-gray-400 mt-1">{location}</p>}
      </div>
      <div className="absolute inset-0 grid grid-cols-8 gap-1 opacity-20">
        {Array.from({ length: 64 }).map((_, i) => (
          <div key={i} className="bg-gray-400 rounded"></div>
        ))}
      </div>
    </div>
  )
}
