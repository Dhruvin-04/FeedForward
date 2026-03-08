'use client'

import { CheckCircle2, Circle, Clock, Package, UserCheck, Truck, MapPin, PartyPopper } from 'lucide-react'

export interface TimelineStage {
  key: string
  label: string
  time?: string
  completed: boolean
  active: boolean
}

interface DeliveryTimelineProps {
  status: string
  createdAt: string
  assignedAt?: string
  pickedAt?: string
  deliveredAt?: string
}

const STAGES = [
  { key: 'accepted', label: 'Food Accepted', icon: Package },
  { key: 'assigned', label: 'Volunteer Assigned', icon: UserCheck },
  { key: 'pickup_pending', label: 'Pickup Confirmation', icon: MapPin },
  { key: 'picked_up', label: 'Picked Up from Donor', icon: MapPin },
  { key: 'delivery_pending', label: 'Delivery Confirmation', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: PartyPopper },
]

const STATUS_ORDER = ['pending', 'assigned', 'pickup_pending', 'picked_up', 'delivery_pending', 'delivered']

export default function DeliveryTimeline({ status, createdAt, assignedAt, pickedAt, deliveredAt }: DeliveryTimelineProps) {
  const currentIndex = STATUS_ORDER.indexOf(status)

  const stages: TimelineStage[] = STAGES.map((stage, i) => {
    // 0=accepted(always done), 1=assigned, 2=pickup_pending, 3=picked_up, 4=delivery_pending, 5=delivered
    let completed = false
    let active = false
    let time: string | undefined

    if (i === 0) {
      completed = true
      time = createdAt
    } else if (i === 1) {
      completed = currentIndex >= 1
      active = currentIndex === 0
      time = assignedAt
    } else if (i === 2) {
      // pickup_pending
      completed = currentIndex >= 3 // completed once picked_up is reached
      active = currentIndex === 1 || currentIndex === 2
    } else if (i === 3) {
      // picked_up
      completed = currentIndex >= 3
      active = currentIndex === 2
      time = pickedAt
    } else if (i === 4) {
      // delivery_pending
      completed = currentIndex >= 5
      active = currentIndex === 3 || currentIndex === 4
    } else if (i === 5) {
      completed = currentIndex >= 5
      active = currentIndex === 4
      time = deliveredAt
    }

    return { key: stage.key, label: stage.label, time, completed, active }
  })

  return (
    <div className="space-y-1">
      {stages.map((stage, index) => {
        const StageIcon = STAGES[index].icon
        return (
          <div key={stage.key} className="flex items-start">
            <div className="flex flex-col items-center mr-4">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  stage.completed
                    ? 'bg-green-100 text-green-600'
                    : stage.active
                    ? 'bg-primary/10 text-primary animate-pulse'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {stage.completed ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : stage.active ? (
                  <StageIcon className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </div>
              {index < stages.length - 1 && (
                <div
                  className={`w-0.5 h-8 mt-1 ${
                    stage.completed ? 'bg-green-400' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
            <div className="flex-1 pb-2">
              <p
                className={`font-medium text-sm ${
                  stage.completed
                    ? 'text-gray-900'
                    : stage.active
                    ? 'text-primary font-semibold'
                    : 'text-gray-400'
                }`}
              >
                {stage.label}
                {stage.active && (
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Current
                  </span>
                )}
              </p>
              {stage.time && (
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(stage.time).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
