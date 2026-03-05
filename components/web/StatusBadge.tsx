interface StatusBadgeProps {
  status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    available: { label: 'Available', className: 'bg-green-100 text-green-800' },
    reserved: { label: 'Reserved', className: 'bg-blue-100 text-blue-800' },
    claimed: { label: 'Claimed', className: 'bg-indigo-100 text-indigo-800' },
    picked: { label: 'Picked', className: 'bg-yellow-100 text-yellow-800' },
    picked_up: { label: 'Picked Up', className: 'bg-yellow-100 text-yellow-800' },
    on_the_way: { label: 'On the Way', className: 'bg-orange-100 text-orange-800' },
    delivered: { label: 'Delivered', className: 'bg-gray-100 text-gray-800' },
    assigned: { label: 'Assigned', className: 'bg-purple-100 text-purple-800' },
    pending: { label: 'Pending', className: 'bg-amber-100 text-amber-800' },
  }

  const config = statusConfig[status] ?? { label: status, className: 'bg-gray-100 text-gray-800' }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
