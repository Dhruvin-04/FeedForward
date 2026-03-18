interface StatusBadgeProps {
  status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    available: { label: 'Available', className: 'bg-green-100 text-green-800' },
    reserved: { label: 'Reserved', className: 'bg-blue-100 text-blue-800' },
    claimed: { label: 'Claimed', className: 'bg-indigo-100 text-indigo-800' },
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
    assigned: { label: 'Assigned', className: 'bg-blue-100 text-blue-800' },
    pickup_pending: { label: 'Pickup Pending Confirmation', className: 'bg-yellow-100 text-yellow-800' },
    picked_up: { label: 'Picked Up', className: 'bg-orange-100 text-orange-800' },
    picked: { label: 'Picked', className: 'bg-orange-100 text-orange-800' },
    on_the_way: { label: 'In Transit', className: 'bg-purple-100 text-purple-800' },
    delivery_pending: { label: 'Delivery Pending Confirmation', className: 'bg-purple-100 text-purple-800' },
    delivered: { label: 'Delivered', className: 'bg-green-100 text-green-800' },
  }

  const config = statusConfig[status] ?? { label: status, className: 'bg-gray-100 text-gray-800' }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
