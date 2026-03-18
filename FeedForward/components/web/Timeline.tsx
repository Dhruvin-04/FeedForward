import { CheckCircle2, Circle, Clock } from 'lucide-react'

interface TimelineItem {
  label: string
  time?: string
  completed: boolean
}

interface TimelineProps {
  items: TimelineItem[]
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-start">
          <div className="flex flex-col items-center mr-4">
            {item.completed ? (
              <CheckCircle2 className="h-6 w-6 text-primary" />
            ) : (
              <Circle className="h-6 w-6 text-gray-300" />
            )}
            {index < items.length - 1 && (
              <div className={`w-0.5 h-8 mt-2 ${item.completed ? 'bg-primary' : 'bg-gray-200'}`} />
            )}
          </div>
          <div className="flex-1">
            <p className={`font-medium ${item.completed ? 'text-gray-900' : 'text-gray-400'}`}>
              {item.label}
            </p>
            {item.time && (
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {item.time}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
