import { Star } from 'lucide-react'

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}

export default function RatingStars({ rating, maxRating = 5, size = 'md', showValue = false }: RatingStarsProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= Math.round(rating)
        return (
          <Star
            key={index}
            className={`${sizeClasses[size]} ${isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        )
      })}
      {showValue && <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>}
    </div>
  )
}
