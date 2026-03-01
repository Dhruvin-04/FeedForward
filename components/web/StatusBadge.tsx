import { FoodListing, Pickup } from "@/lib/mockData";


type Status = FoodListing['status'] | Pickup['status']

interface StatusBadgeProps {
  status: Status
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig: Record<Status, { label: string; className: string }> = {
    available: { label: 'Available', className: 'bg-green-100 text-green-800' },
    reserved: { label: 'Reserved', className: 'bg-blue-100 text-blue-800' },
    picked: { label: 'Picked', className: 'bg-yellow-100 text-yellow-800' },
    delivered: { label: 'Delivered', className: 'bg-gray-100 text-gray-800' },
    assigned: { label: 'Assigned', className: 'bg-purple-100 text-purple-800' },
  }

  const config = statusConfig[status]

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
