'use client'

import { Download } from 'lucide-react'
import { Button } from '../ui/button'
import { toast } from 'sonner'

interface PickupDetailsDownloadProps {
  pickup: {
    pickupCode?: string
    foodName: string
    quantity?: number
    category: string
    donorName: string
    donorPhone: string
    donorAddress: string
    ngoName: string
    ngoPhone: string
    ngoAddress: string
    pickupLocation: string
    pickupWindow?: { openingTime: string; closingTime: string }
    notes?: string
  }
}

export default function PickupDetailsDownload({ pickup }: PickupDetailsDownloadProps) {
  const handleDownload = () => {
    const details = `
════════════════════════════════════════
       FeedForward PICKUP DETAILS
════════════════════════════════════════

PICKUP CODE: ${pickup.pickupCode ?? 'N/A'}

────────────────────────────────────────
FOOD DETAILS
────────────────────────────────────────
  Food Name:  ${pickup.foodName}
  Category:   ${pickup.category === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
  Quantity:   ${pickup.quantity ?? 'Not specified'} servings
  ${pickup.pickupWindow ? `Pickup Window: ${pickup.pickupWindow.openingTime} - ${pickup.pickupWindow.closingTime}` : ''}
  ${pickup.notes ? `Notes: ${pickup.notes}` : ''}

────────────────────────────────────────
DONOR DETAILS (PICK UP FROM)
────────────────────────────────────────
  Name:    ${pickup.donorName}
  Phone:   ${pickup.donorPhone || 'N/A'}
  Address: ${pickup.donorAddress || pickup.pickupLocation}

────────────────────────────────────────
NGO DETAILS (DELIVER TO)
────────────────────────────────────────
  Name:    ${pickup.ngoName}
  Phone:   ${pickup.ngoPhone || 'N/A'}
  Address: ${pickup.ngoAddress || 'N/A'}

────────────────────────────────────────
INSTRUCTIONS
────────────────────────────────────────
  1. Arrive at the donor location during the pickup window.
  2. Show your pickup code to the donor.
  3. Collect the food items carefully.
  4. Transport to the NGO delivery address.
  5. Mark delivery as completed in the app.

════════════════════════════════════════
     Thank you for volunteering!
════════════════════════════════════════
`.trim()

    const blob = new Blob([details], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pickup_${pickup.pickupCode ?? 'details'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Pickup details downloaded!')
  }

  return (
    <Button onClick={handleDownload} variant="outline" className="gap-2">
      <Download className="w-4 h-4" />
      Download Details
    </Button>
  )
}
